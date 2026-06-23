# FileUpload FPM — The Spreadsheet Whisperer

A small, bold CAP app that turns Excel into books. Drop a .xlsx into the Files entity and watch rows transform into bookstore records — no incantations, just code.

---

## Why this little beast exists
It’s simple: spreadsheets are everywhere and repeating manual copy-paste is a crime against time. FileUpload FPM ingests Excel files, sanitizes rows, and bulk-inserts them as `Books`. It’s playful, practical and built with SAP CAP + Fiori.

---

## Highlights
- Excel → CAP entities pipeline implemented in [`fileuploadfpm/srv/service.js`](fileuploadfpm/srv/service.js) (see the [`CREATE (Files)` handler](fileuploadfpm/srv/service.js)).
- Domain model: [`fileupload.Books`](fileuploadfpm/db/schema.cds) and media-enabled [`fileupload.Files`](fileuploadfpm/db/schema.cds).
- OData projection service: [`MyBooks.Books`](fileuploadfpm/srv/service.cds) and [`MyBooks.Files`](fileuploadfpm/srv/service.cds).
- Fiori app UI: launch from [`fileuploadfpm/app/books/webapp/index.html`](fileuploadfpm/app/books/webapp/index.html) configured by [`fileuploadfpm/app/books/webapp/manifest.json`](fileuploadfpm/app/books/webapp/manifest.json).
- Nav flow and Upload page wired to UI controllers: [`books.ext.view.Main`](fileuploadfpm/app/books/webapp/ext/view/Main.controller.js) and [`books.ext.view.UploadExcel`](fileuploadfpm/app/books/webapp/ext/view/UploadExcel.controller.js).

---

## Quick start (local)
1. cd into the app root:
   ```sh
   cd fileuploadfpm
   ```
2. Install & start (dev):
   ```sh
   npm ci
   npm start
   ```
3. Open the UI:
   - http://localhost:4004/books/webapp/index.html — or open [`fileuploadfpm/app/books/webapp/index.html`](fileuploadfpm/app/books/webapp/index.html)

See the CAP service wiring in [`fileuploadfpm/package.json`](fileuploadfpm/package.json) and the cloud packaging in [`fileuploadfpm/mta.yaml`](fileuploadfpm/mta.yaml).

---

## Flow (short)
1. Upload file to the Files entity via the UI.
2. The server-side [`CREATE` handler for Files](fileuploadfpm/srv/service.js) reads the uploaded stream, parses Excel with `read-excel-file`, filters empty rows, maps headers → properties and performs a bulk INSERT into [`Books`](fileuploadfpm/db/schema.cds).
3. Uploaded file metadata (and content) is preserved in `Files`.

---

## Important files & symbols
- Service implementation: [`fileuploadfpm/srv/service.js`](fileuploadfpm/srv/service.js)
- Service definition / projections: [`fileuploadfpm/srv/service.cds`](fileuploadfpm/srv/service.cds)
- Database model: [`fileuploadfpm/db/schema.cds`](fileuploadfpm/db/schema.cds) (entities: [`fileupload.Books`](fileuploadfpm/db/schema.cds), [`fileupload.Files`](fileuploadfpm/db/schema.cds))
- UI entry: [`fileuploadfpm/app/books/webapp/index.html`](fileuploadfpm/app/books/webapp/index.html)
- UI manifest: [`fileuploadfpm/app/books/webapp/manifest.json`](fileuploadfpm/app/books/webapp/manifest.json)
- UI views & controllers:
  - Upload view: [`fileuploadfpm/app/books/webapp/ext/view/UploadExcel.view.xml`](fileuploadfpm/app/books/webapp/ext/view/UploadExcel.view.xml) + [`books.ext.view.UploadExcel`](fileuploadfpm/app/books/webapp/ext/view/UploadExcel.controller.js)
  - Main view: [`fileuploadfpm/app/books/webapp/ext/view/Main.view.xml`](fileuploadfpm/app/books/webapp/ext/view/Main.view.xml) + [`books.ext.view.Main`](fileuploadfpm/app/books/webapp/ext/view/Main.controller.js)
- Project entry & deps: [`fileuploadfpm/package.json`](fileuploadfpm/package.json)
- Cloud packaging: [`fileuploadfpm/mta.yaml`](fileuploadfpm/mta.yaml)

---

## Designer’s note (tiny manifesto)
This project is less about novelty and more about delight: convert mundane XLSX rows into meaningful domain records with predictable validation and minimal fuss. It celebrates:
- resilient parsing (skip blank rows),
- clear projections (DB model ⇢ service ⇢ UI), and
- a tiny UX bridge for a common business ritual: “upload the spreadsheet”.

---