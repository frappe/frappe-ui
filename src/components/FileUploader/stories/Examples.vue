<script setup lang="ts">
import { Button, FileUploader, type UploadedFile } from 'frappe-ui'

const validateFileFunction = (file: File) => {
  // optional validation hook
}

const onSuccess = (file: UploadedFile) => {
  // upload success handler
}
</script>

<template>
  <FileUploader
    :fileTypes="['image/*']"
    :validateFile="validateFileFunction"
    :private="false"
    folder="Attachments"
    doctype="ToDo"
    docname="TODO-0001"
    @success="onSuccess"
  >
    <template #default="{ uploading, progress, openFileSelector }">
      <Button @click="openFileSelector" :loading="uploading">
        {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
      </Button>
    </template>
  </FileUploader>
</template>
