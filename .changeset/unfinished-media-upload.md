---
'frappe-ui': patch
---

Editor: an image or video that is still uploading, or failed to upload, is no longer written to the editor's `v-model` value or `change` event. Saved content used to keep it as an empty `<video>` that loaded back as "This video hasn't yet been uploaded." with nothing to retry. A `<video>` without a `src` in existing content is now ignored when it loads. `upload()`, `useFileUpload` and `FileUploadHandler` now report a 413 from a proxy as a file that is too big, with the file's size, instead of "Upload failed".
