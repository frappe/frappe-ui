<template>
  <div data-slot="root" :data-state="dataState">
    <input
      ref="input"
      type="file"
      :accept="acceptedFileTypes"
      class="hidden"
      @change="onFileAdd"
    />
    <slot
      v-bind="{
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
      <div>
        <Button @click="openFileSelector" :loading="uploading">
          {{ uploading ? `Uploading ${progress}%` : 'Upload File' }}
        </Button>
        <ErrorMessage :message="error ?? undefined" class="mt-1" />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '../Button'
import { ErrorMessage } from '../ErrorMessage'
import FileUploadHandler from '../../utils/fileUploadHandler'
import type {
  FileUploaderEmits,
  FileUploaderProps,
  FileUploaderSlotProps,
  FileUploaderValidationResult,
} from './types'
import type { UploadOptions } from '../../utils/useFileUpload'

defineOptions({
  name: 'FileUploader',
})

const props = withDefaults(defineProps<FileUploaderProps>(), {
  private: true,
  validateFile: undefined,
})

const emit = defineEmits<FileUploaderEmits>()
defineSlots<{
  default(props: FileUploaderSlotProps): unknown
}>()

const input = ref<HTMLInputElement | null>(null)
const uploader = ref<FileUploadHandler | null>(null)
const uploading = ref(false)
const uploaded = ref(0)
const total = ref(0)
const error = ref<string | null>(null)
const message = ref('')
const file = ref<File | null>(null)
const finishedUploading = ref(false)

const acceptedFileTypes = computed(() => {
  return Array.isArray(props.fileTypes)
    ? props.fileTypes.join(',')
    : props.fileTypes
})

const progress = computed(() => {
  const value = Math.floor((uploaded.value / total.value) * 100)
  return Number.isNaN(value) ? 0 : value
})

const success = computed(() => {
  return finishedUploading.value && !error.value
})

const dataState = computed(() => {
  if (uploading.value) return 'uploading'
  if (success.value) return 'success'
  if (error.value) return 'error'
  return 'idle'
})

const uploadOptions = computed<UploadOptions>(() => ({
  private: props.private,
  folder: props.folder,
  doctype: props.doctype,
  docname: props.docname,
  fieldname: props.fieldname,
  upload_endpoint: props.uploadEndpoint,
  optimize: props.optimize,
}))

function openFileSelector() {
  input.value?.click()
}

async function onFileAdd(event: Event) {
  error.value = null

  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0] || null
  file.value = selectedFile

  if (!selectedFile) return

  const validationError = await validateSelectedFile(selectedFile)
  if (validationError) {
    error.value =
      validationError instanceof Error
        ? validationError.message
        : validationError
    emit('failure', validationError)
    return
  }

  await uploadFile(selectedFile)
}

async function validateSelectedFile(
  selectedFile: File,
): Promise<FileUploaderValidationResult> {
  if (!props.validateFile) return null

  try {
    return await props.validateFile(selectedFile)
  } catch (validationError) {
    return validationError as Error
  }
}

async function uploadFile(selectedFile: File) {
  error.value = null
  uploaded.value = 0
  total.value = 0
  finishedUploading.value = false

  uploader.value = new FileUploadHandler()
  uploader.value.on('start', () => {
    uploading.value = true
  })
  uploader.value.on('progress', (data: { uploaded: number; total: number }) => {
    uploaded.value = data.uploaded
    total.value = data.total
  })
  uploader.value.on('error', () => {
    uploading.value = false
    error.value = 'Error Uploading File'
  })
  uploader.value.on('finish', () => {
    uploading.value = false
    finishedUploading.value = true
  })

  try {
    const data = await uploader.value.upload(selectedFile, uploadOptions.value)
    emit('success', data)
  } catch (uploadError) {
    uploading.value = false
    error.value = getUploadErrorMessage(uploadError)
    emit('failure', uploadError)
  }
}

function getUploadErrorMessage(uploadError: unknown) {
  if (uploadError instanceof Error && uploadError.message) {
    return uploadError.message
  }

  const errorResponse = uploadError as {
    message?: string
    _server_messages?: string
    exc?: string
  }
  if (errorResponse?.message) return errorResponse.message
  if (errorResponse?._server_messages) {
    return JSON.parse(JSON.parse(errorResponse._server_messages)[0]).message
  }
  if (errorResponse?.exc) {
    return JSON.parse(errorResponse.exc)[0].split('\n').slice(-2, -1)[0]
  }
  return 'Error Uploading File'
}
</script>
