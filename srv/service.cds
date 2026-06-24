using { fileupload as db } from '../db/schema';

service MyBooks {
    @odata.draft.enabled
    entity Books as projection on db.Books;
    
    
    @odata.draft.enabled
    entity Files as projection on db.Files;
}