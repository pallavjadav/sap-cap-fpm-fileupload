const cds = require('@sap/cds');

let attempts = 0;

module.exports = cds.service.impl(function () {

    this.on('simulateRemoteCall', async req => {

        attempts++;

        console.log('================================');
        console.log(`OUTBOX ATTEMPT #${attempts}`);
        console.log(req.data);
        console.log('================================');

        // Fail first 3 times
        if (attempts <= 8) {
            throw new Error(
                `Simulated remote failure. Attempt ${attempts}`
            );
        }

        console.log('SUCCESS AFTER RETRY');

        return {
            success: true
        };

    });
    this.on('longRunningProcess', async req => {

        console.log('================================');
        console.log('LONG RUNNING PROCESS STARTED');
        console.log(req.data);
        console.log('================================');

        // Simulate 60 second processing
        await new Promise(resolve =>
            setTimeout(resolve, 60000)
        );

        console.log('================================');
        console.log('LONG RUNNING PROCESS COMPLETED');
        console.log('================================');

        return {
            status: 'SUCCESS'
        };

    });

});