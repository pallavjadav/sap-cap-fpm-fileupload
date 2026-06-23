const cds = require('@sap/cds');
const readXlsxFile = require('read-excel-file/node');

module.exports = cds.service.impl(function () {

    const { Files, Books } = this.entities;

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

            // Persist uploaded file metadata/content
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