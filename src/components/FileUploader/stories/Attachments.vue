<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  ErrorMessage,
  FileUploader,
  type UploadedFile,
} from 'frappe-ui'

const attachments = ref([
  {
    file_name: 'contract-draft.pdf',
    file_url: '/private/files/contract-draft.pdf',
  },
  { file_name: 'site-photos.zip', file_url: '/private/files/site-photos.zip' },
])

function onSuccess(file: UploadedFile) {
  attachments.value.push(file)
}
</script>

<template>
  <div class="w-80 space-y-2">
    <div class="text-base-medium text-ink-gray-8">Attachments</div>
    <div
      class="divide-y divide-outline-gray-1 rounded-6 border border-outline-gray-1"
    >
      <div
        v-for="attachment in attachments"
        :key="attachment.file_url"
        class="flex items-center gap-2 px-3 py-2 text-base text-ink-gray-7"
      >
        <span
          class="lucide-paperclip size-4 text-ink-gray-5"
          aria-hidden="true"
        />
        <span class="truncate">{{ attachment.file_name }}</span>
      </div>
    </div>
    <FileUploader
      doctype="Project"
      docname="PROJ-0042"
      :file-types="['.pdf', '.docx', '.zip', 'image/*']"
      @success="onSuccess"
    >
      <template
        #default="{ file, uploading, progress, error, openFileSelector }"
      >
        <div v-if="uploading" class="space-y-1 px-1">
          <div class="flex justify-between text-sm text-ink-gray-6">
            <span class="truncate">{{ file?.name }}</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="h-1 rounded-full bg-surface-gray-2">
            <div
              class="h-1 rounded-full bg-surface-gray-7"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
        <Button
          v-else
          variant="ghost"
          icon-left="lucide-plus"
          label="Attach file"
          @click="openFileSelector"
        />
        <ErrorMessage v-if="error" :message="error" class="mt-1 px-1" />
      </template>
    </FileUploader>
  </div>
</template>
