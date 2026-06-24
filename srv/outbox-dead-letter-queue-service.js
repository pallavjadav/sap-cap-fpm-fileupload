const cds = require('@sap/cds')

module.exports = class OutboxDeadLetterQueueService extends cds.ApplicationService {
    async init() {
        // this.before('READ', 'DeadOutboxMessages', function (req) {
        //     const { maxAttempts } = cds.env.requires.queue
        //     req.query.where('attempts >= ', maxAttempts)
        // })

        this.on('revive', 'DeadOutboxMessages', async function (req) {
            await UPDATE(req.subject).set({ attempts: 0 })
            console.log(`DeadOutboxMessages: Message with ID ${req.subject.ID} revived and eligible for reprocessing.`)
       
                console.log("🚀 App bootstrapped. Yielding event loop for outbox processing engines...");

                // Defer for 200ms to guarantee persistent-queue initialization completes safely
                setTimeout(async () => {
                    try {
                        const outboxTarget = await cds.connect.to('OutboxTestService');
                        const queuedSrv = cds.queued(outboxTarget);
                        const result = await queuedSrv.flush();
                        console.log("Flush Processing Result:", result);

                        // Now queuedSrv.flush WILL be populated cleanly by CAP's task runner extensions
                //         if (queuedSrv && typeof queuedSrv.flush === 'function') {
                //             console.log("Processing persistent queue tasks...");
                //             const result = await queuedSrv.flush();
                //             console.log("Flush Processing Result:", result);
                //             console.log("✅ Outbox flush completed.");
                //         } else {
                //             console.warn("⚠️ .flush() is not a function. Check package.json for proper 'queue' layout.");
                //         }
                    } catch (err) {
                        console.error("❌ Startup outbox flush failed:", err);
                    }
                }, 200);
         
        })

        this.on('deleteQueue', 'DeadOutboxMessages', async function (req) {
            await DELETE.from(req.subject)
        })

        await super.init()
    }
}