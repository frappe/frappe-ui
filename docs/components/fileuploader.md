<script setup>
import { FileUploader, Button, ErrorMessage } from '../../src/index'
</script>

# FileUploader

The FileUploader component is a renderless component used to upload files. It
only works with a Frappe Framework backend.

## Usage

Use the default slot to render any HTML you like. A lot of slot props are
available to render a UI that shows file progress. Make sure to call
`openFileSelector` using a user action like a button click.

When the file upload is complete, the `success` event is emitted with the File
document as JSON object.

<!-- prettier-ignore -->
::: info Note
The following example can't upload the file because it is not connected to a
Frappe backend.
:::

<Story class="gap-4">
  <FileUploader @success="(file) => handleFile(file)">
    <template
      v-slot="{
        file,
        uploading,
        progress,
        uploaded,
        message,
        error,
        total,
        success,
        openFileSelector,
      }"
    >
      <div class="w-full text-center">
        <Button @click="openFileSelector" :loading="uploading">
          {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
        </Button>
        <ErrorMessage class="mt-2" :message="error" />
      </div>
    </template>
  </FileUploader>
</Story>

```vue
<template>
  <FileUploader @success="(file) => handleFile(file)">
    <template
      v-slot="{
        file,
        uploading,
        progress,
        uploaded,
        message,
        error,
        total,
        success,
        openFileSelector,
      }"
    >
      <div class="w-full text-center">
        <Button @click="openFileSelector" :loading="uploading">
          {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
        </Button>
        <ErrorMessage class="mt-2" :message="error" />
      </div>
    </template>
  </FileUploader>
</template>

<script setup>
import { FileUploader, Button } from 'frappe-ui'
</script>
```

## Props

| Name           | Default | Value      | Description                                                                                                                                                   |
| :------------- | :------ | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fileTypes`    | `null`  | `String`   | String passed to `accept` attribute of file input. Use it to restrict file types to be uploaded.                                                              |
| `uploadArgs`   | `null`  | `Object`   | See [uploadArgs](#uploadargs)                                                                                                                                 |
| `validateFile` | `null`  | `Function` | Validator function to validate the selected file. File object is passed as first parameter. Return an error message or throw an Error to prevent file upload. |

## `uploadArgs`

Options passed to `/api/method/upload_file` as arguments. Object structure looks
like this:

```js
{
  private, folder, file_url, doctype, docname, fieldname, method, type
}
```
