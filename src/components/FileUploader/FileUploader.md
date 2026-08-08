# FileUploader

Uploads a file to Frappe's upload endpoint and reports progress and the
result. Renders no chrome of its own beyond a fallback trigger button — the
default slot receives the upload state so you can build your own trigger and
progress UI.

Uploads are **private by default** (`is_private=1`). Pass `:private="false"`
only for intentionally public files — profile pictures served in an email
digest, for example, where there is no session to authenticate against.

For a custom upload UI (drag-and-drop, multiple files, a headless flow with no
default trigger at all), use the `useFileUpload()` composable directly instead
— see [Utilities](../other/utilities#usefileupload-fileuploadhandler).
`FileUploader` is the ready-made entry point; `useFileUpload()` is the one to
reach for when the component's shape doesn't fit.

<ComponentPreview name="FileUploader-Examples" />
