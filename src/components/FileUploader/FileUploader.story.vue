<script setup lang="ts">
import FileUploader from './FileUploader.vue'
import { Button } from '../Button'

const validateFileFunction = (fileObject) => {}
const onSuccess = (file) => {}
</script>

<template>
  <div class="grid gap-5" style="width: 500px">
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
  </div>
</template>
