namespace fileupload;

using {cuid} from '@sap/cds/common';

using {sap.common.CodeList} from '@sap/cds/common';

entity AvailabilityStatus : CodeList {
    key code : String(1);
}

entity Books {
    key ID     : Integer        @title: 'ID';
    key Title  : String(100)    @title: 'Title';
        Author : String(100)    @title: 'Author';
        Genre  : String(50)     @title: 'Genre';
        Price  : Decimal(10, 2) @title: 'Price';
        currentlyAvailableStatus : Association to AvailabilityStatus @title : 'Currently Available Status';
}


entity Files : cuid {
    fileName : String(260);
    fileType : String      @Core.IsMediaType;
    content  : LargeBinary @Core.MediaType                  : fileType
                           @Core.AcceptableMediaTypes       : ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                           @Core.ContentDisposition.Filename: fileName;
}
