const cds = require('@sap/cds');
const readXlsxFile = require('read-excel-file/node');

// cds.on('served', async () => {
//     console.log("🚀 App bootstrapped. Yielding event loop for outbox processing engines...");

//     // Defer for 200ms to guarantee persistent-queue initialization completes safely
//     setTimeout(async () => {
//         try {
//             const outboxTarget = await cds.connect.to('OutboxTestService');
//             const queuedSrv = cds.queued(outboxTarget);

//             // Now queuedSrv.flush WILL be populated cleanly by CAP's task runner extensions
//             if (queuedSrv && typeof queuedSrv.flush === 'function') {
//                 console.log("Processing persistent queue tasks...");
//                 const result = await queuedSrv.flush();
//                 console.log("Flush Processing Result:", result);
//                 console.log("✅ Outbox flush completed.");
//             } else {
//                 console.warn("⚠️ .flush() is not a function. Check package.json for proper 'queue' layout.");
//             }
//         } catch (err) {
//             console.error("❌ Startup outbox flush failed:", err);
//         }
//     }, 200);
// });




module.exports = cds.service.impl(async function () {

    const { Files, Books } = this.entities;
    const outboxTarget = await cds.connect.to('OutboxTestService');
    const queuedSrv = cds.queued(outboxTarget);
    const result = await queuedSrv.flush();
    console.log("Flush Processing Result:", result);
    

    const srv = await cds.connect.to('OutboxTestService')
    // console.log("srv" , srv)
    // console.log("flush" , await cds.queued(srv).flush())
    // ✅ CORRECT PLACEMENT 1: Wake up the queue automatically when the app boots up
    // cds.on('served', async () => {
    //     console.log("Application started. Flushing leftover outbox messages...");
    //     try {
    //         console.log("flush" , await cds.queued(srv).flush());
    //     } catch (err) {
    //         console.error("Failed to flush outbox on startup", err);
    //     }
    // });

    this.on('CREATE', Files, async (req, next) => {

        const tx = cds.tx(req);

        try {
            // Read upload stream
            const chunks = [];

            for await (const chunk of req.data.content) {
                chunks.push(chunk);
            }

            const buffer = Buffer.concat(chunks);

            if (!buffer.length) {
                return req.reject(400, 'Uploaded file is empty');
            }

            // Read Excel
            const workbook = await readXlsxFile(buffer);

            let rows;

            // Handle both possible return formats
            if (
                Array.isArray(workbook) &&
                workbook.length > 0 &&
                workbook[0] &&
                workbook[0].data
            ) {
                rows = workbook[0].data;
            } else {
                rows = workbook;
            }

            if (!rows?.length) {
                return req.reject(400, 'No data found in Excel file');
            }

            const [headers, ...dataRows] = rows;

            if (!headers?.length) {
                return req.reject(400, 'Excel header row is missing');
            }

            // Remove completely empty rows
            const validRows = dataRows.filter(row =>
                row?.some(value =>
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ''
                )
            );

            if (!validRows.length) {
                return req.reject(400, 'Excel file contains no business data');
            }

            // Convert Excel rows to CAP entities
            const entries = validRows.map(row => {

                const record = {};

                headers.forEach((header, index) => {
                    if (!header) return;

                    record[String(header).trim()] = row[index];
                });

                return record;
            });

            console.log(`Uploading ${entries.length} records into Books`);
            console.log(entries);

            // Bulk insert
            await tx.run(
                INSERT.into(Books).entries(entries)
            );

            console.log(`Successfully inserted ${entries.length} records`);
            
            const alert = await cds.connect.to('notifications')
            alert.notify({
                recipients: ["pallavjadav@gmail.com"],
                priority: "HIGH",
                title: "New Excel Upload",
                description: "A New Excel file has been uploaded and processed successfully."
            })
            // Persist uploaded file metadata/content

            // need to call an api which fails to test outbox behavior
            // =====================================
            // OUTBOX DEMO STARTS HERE
            // =====================================
            const outboxService = cds.queued(
                await cds.connect.to('OutboxTestService')
            );

            await outboxService.simulateRemoteCall({
                fileName: req.data.fileName || 'Books.xlsx',
                recordCount: entries.length
            });
            // await outboxService.longRunningProcess({
            //     fileName: req.data.fileName || 'Books.xlsx',
            //     recordCount: entries.length
            // });

            console.log('Outbox message created');

            // =====================================
            // OUTBOX DEMO ENDS HERE
            // =====================================
            return next();

        } catch (error) {

            console.error('Excel processing failed:', error);

            return req.reject(
                500,
                `Excel upload failed: ${error.message}`
            );
        }
    });
});