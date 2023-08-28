<script setup lang="ts">
import FileUploader from './FileUploader.vue'
import Button from './Button.vue'

const validateFileFunction = (fileObject) => {}
const onSuccess = (file) => {}
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }" autoPropsDisabled>
    <FileUploader
      :fileTypes="['image/*']"
      :validateFile="validateFileFunction"
      @success="onSuccess"
    >
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
        <Button @click="openFileSelector" :loading="uploading">
          {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
        </Button>
      </template>
    </FileUploader>
  </Story>
</template>
