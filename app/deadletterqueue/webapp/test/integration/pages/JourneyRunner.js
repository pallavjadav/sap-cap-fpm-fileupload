sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"deadletterqueue/test/integration/pages/DeadOutboxMessagesList",
	"deadletterqueue/test/integration/pages/DeadOutboxMessagesObjectPage"
], function (JourneyRunner, DeadOutboxMessagesList, DeadOutboxMessagesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('deadletterqueue') + '/test/flpSandbox.html#deadletterqueue-tile',
        pages: {
			onTheDeadOutboxMessagesList: DeadOutboxMessagesList,
			onTheDeadOutboxMessagesObjectPage: DeadOutboxMessagesObjectPage
        },
        async: true
    });

    return runner;
});

