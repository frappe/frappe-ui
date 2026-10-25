<script setup lang="ts">
import { ref } from 'vue'
import {
  Avatar,
  Button,
  ErrorMessage,
  FileUploader,
  type UploadedFile,
} from 'frappe-ui'

const photo = ref('https://i.pravatar.cc/80?u=jane@example.com')

function checkSize(file: File) {
  if (file.size > 2 * 1024 * 1024) return 'Pick an image under 2 MB.'
}

function onSuccess(file: UploadedFile) {
  photo.value = file.file_url
}
</script>

<template>
  <FileUploader
    file-types="image/*"
    :private="false"
    doctype="User"
    docname="jane@example.com"
    fieldname="user_image"
    optimize
    :validate-file="checkSize"
    @success="onSuccess"
  >
    <template #default="{ uploading, progress, error, openFileSelector }">
      <div class="flex items-center gap-4">
        <Avatar :image="photo" label="Jane Cooper" size="3xl" />
        <div class="space-y-1.5">
          <Button
            :loading="uploading"
            :loading-text="`Uploading ${progress}%`"
            label="Change photo"
            @click="openFileSelector"
          />
          <ErrorMessage v-if="error" :message="error" />
          <p v-else class="text-sm text-ink-gray-5">Any image up to 2 MB</p>
        </div>
      </div>
    </template>
  </FileUploader>
</template>
