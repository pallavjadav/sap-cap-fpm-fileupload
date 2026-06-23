namespace fileupload;

using { cuid } from '@sap/cds/common';


entity Books {
    key ID     : Integer @title : 'ID';
        Title  : String(100)@title : 'Title';
        Author : String(100)@title : 'Author';
        Genre  : String(50)@title : 'Genre';
        Price  : Decimal(10, 2)@title : 'Price';
}


entity Files : cuid {
    fileName : String(260);
    fileType : String      @Core.IsMediaType;
    content  : LargeBinary @Core.MediaType                  : fileType
                           @Core.AcceptableMediaTypes       : ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                           @Core.ContentDisposition.Filename: fileName;
}