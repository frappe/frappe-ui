---
'frappe-ui': minor
---

Uploads can now send large files in pieces. Set `setConfig('uploadChunkSize', bytes)`, or pass `chunkSize` to one upload, and files larger than that go to the server one piece per request. A proxy's request size limit no longer blocks them. Without the setting, every file is still sent in one request. Chunked uploads need Frappe v17 or later. `FileUploader` and `FileUploadHandler` use the same upload code, so they support it too.
