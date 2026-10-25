# FileUploader

Opens the file picker, uploads the chosen file to a Frappe site and reports
the progress through its slot. For drag and drop, several files at once, or an
upload with no trigger, use
[`useFileUpload()`](../other/utilities#usefileupload-fileuploadhandler)
instead.

<ComponentPreview name="FileUploader-Attachments" />

## Examples

### Profile photo

The default slot draws the trigger. `openFileSelector` opens the picker, and
`uploading`, `progress` and `error` drive the button and the message below it.
The photo is public (`:private="false"`) so it can show where no one is
signed in, and `validateFile` rejects images over 2 MB before they upload.
The docs site has no Frappe server, so uploads on this page end with an error.

<ComponentPreview name="FileUploader-ProfilePhoto" />

## Behavior

### Private by default

Uploads are private (`is_private=1`) unless you pass `:private="false"`. A
private file needs a signed-in session to download. Make a file public only
when it must load without one, such as a profile photo in an email digest.

### Where the file goes

- `folder` sets the folder in Frappe's file manager. It defaults to `Home`.
- `doctype`, `docname` and `fieldname` attach the file to a document and a
  field on it.
- `uploadEndpoint` sets the URL the file is posted to. It defaults to
  `/api/method/upload_file`.
- `optimize` asks the server to resize an image before it stores it.

### Picking a file

`fileTypes` sets the file types the picker accepts, as a string or an array,
such as `'image/*'` or `['.pdf', '.docx']`. The picker takes one file at a
time.

### Validation

`validateFile` runs on the chosen file before the upload starts. Return a
message or an `Error` to stop the upload, or nothing to let it through. It can
be async, and an error it throws also stops the upload. The message shows as
`error` in the slot, and `failure` fires with it.

### Slot props

Without a default slot, FileUploader renders an "Upload File" button that
shows the progress, and an error message under it. The default slot replaces
both and receives:

| Prop               | Value                                              |
| ------------------ | -------------------------------------------------- |
| `openFileSelector` | Opens the file picker                              |
| `file`             | The chosen `File`, or `null`                       |
| `uploading`        | `true` while the file uploads                      |
| `progress`         | Percent uploaded, from `0` to `100`                |
| `uploaded`         | Bytes uploaded so far                              |
| `total`            | Total bytes to upload                              |
| `success`          | `true` once the upload finished without an error   |
| `error`            | The error message as a string, or `null`           |
| `message`          | Not set by the component; always an empty string   |

### Events

`success` fires with the uploaded file record, which has `file_name`,
`file_url` and `file_size`. `failure` fires when validation stops the file or
the request fails.

<!-- @include: ./FileUploader.api.md -->
