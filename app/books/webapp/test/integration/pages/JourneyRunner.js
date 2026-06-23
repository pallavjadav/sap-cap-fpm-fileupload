sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"books/test/integration/pages/BooksMain"
], function (JourneyRunner, BooksMain) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('books') + '/test/flpSandbox.html#books-tile',
        pages: {
			onTheBooksMain: BooksMain
        },
        async: true
    });

    return runner;
});

