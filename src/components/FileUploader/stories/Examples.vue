<script setup lang="ts">
import { Button, FileUploader } from 'frappe-ui'

const validateFileFunction = (file: File) => {
  // optional validation hook
}

const onSuccess = (file: File) => {
  // upload success handler
}
</script>

<template>
  <FileUploader
    :fileTypes="['image/*']"
    :validateFile="validateFileFunction"
    @success="onSuccess"
  >
    <template #default="{ uploading, progress, openFileSelector }">
      <Button @click="openFileSelector" :loading="uploading">
        {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
      </Button>
    </template>
  </FileUploader>
</template>
