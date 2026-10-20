---
'frappe-ui': minor
---

Uploads: `useFileUpload`, `upload`, `FileUploadHandler` and `FileUploader` now send a file larger than the new `fileChunkSize` config (25 MB by default) in chunks, one request after another, so a proxy's request size limit no longer blocks large files. A 413 from a proxy now says the server rejected the upload as too large, instead of quoting `maxFileSize` (additive).
