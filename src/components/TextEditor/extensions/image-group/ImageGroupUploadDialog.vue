<template>
  <Dialog
    v-model="modelValue"
    :options="{
      title: props.mode === 'edit' ? 'Edit Images' : 'Upload Images',
      size: '3xl',
    }"
    @close="$emit('close')"
    :disableOutsideClickToClose="true"
  >
    <template #body-content>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <Button @click="triggerFileInput">
            <template #prefix>
              <LucideImagePlus class="size-4" />
            </template>
            Add images
          </Button>
          <Select
            id="columns-select"
            :options="selectOptions"
            v-model="internalColumns"
            size="sm"
            variant="subtle"
            class="w-28"
            @update:modelValue="(val) => (columns = +val)"
          />
        </div>
        <div
          v-if="images && images.length"
          class="grid gap-px mb-4"
          :style="gridStyle"
        >
          <div
            v-for="(item, idx) in images"
            :key="item.id"
            class="relative aspect-square w-full h-full overflow-hidden group bg-surface-white"
            :draggable="true"
            @dragstart="onDragStart(idx)"
            @dragover="onDragOver($event, idx)"
            @drop="onDrop($event)"
            @dragend="onDragEnd"
            @dragleave="onDragLeave($event, idx)"
            :class="{ 'ring-2 ring-primary-400 z-10': isDropTarget(idx) }"
          >
            <button
              type="button"
              class="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove image"
              @click.stop="removeImage(idx)"
            >
              <LucideX class="w-4 h-4 text-gray-700" />
            </button>

            <!-- Existing images from edit mode -->
            <template v-if="item.type === 'existing'">
              <img
                :src="item.existing?.src"
                :alt="item.existing?.alt || ''"
                class="object-cover w-full h-full rounded-[2px]"
              />
              <!-- Caption overlay -->
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[2px] transition-opacity"
                :class="
                  editingCaption === `${item.type}-${idx}`
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                "
              >
                <div
                  v-if="editingCaption !== `${item.type}-${idx}`"
                  class="p-2 cursor-pointer"
                  @click.stop="
                    startEditingCaption(
                      `${item.type}-${idx}`,
                      item.existing?.alt || '',
                    )
                  "
                >
                  <div
                    class="text-white text-xs truncate"
                    :title="item.existing?.alt || 'Click to add caption'"
                  >
                    {{ item.existing?.alt || 'Add caption...' }}
                  </div>
                </div>
                <div v-else class="p-2" @click.stop>
                  <input
                    :ref="(el) => (captionInputRef = el as HTMLInputElement)"
                    v-model="captionEditValue"
                    @blur="handleCaptionBlur(`${item.type}-${idx}`, idx)"
                    @keydown.enter.prevent="
                      saveCaption(`${item.type}-${idx}`, idx)
                    "
                    @keydown.escape="cancelEditingCaption"
                    class="w-full text-xs bg-white/90 text-gray-900 px-1 py-0.5 rounded-sm border-none outline-none"
                    placeholder="Add caption..."
                    maxlength="200"
                  />
                </div>
              </div>
            </template>

            <!-- New file uploads -->
            <template v-else-if="item.type === 'file' && item.file">
              <template v-if="!isImageSupported(item.file)">
                <div
                  class="flex flex-col items-center justify-center w-full h-full text-ink-gray-4 bg-surface-gray-1 rounded-[2px]"
                >
                  <span
                    class="text-p-xs text-ink-gray-4 w-full text-center px-2 mt-1"
                    :title="item.file.name"
                  >
                    {{ item.file.name }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.file.type.startsWith('image/')">
                <img
                  :src="filePreview(item.file)"
                  class="object-cover w-full h-full rounded-[2px]"
                  :alt="item.alt || ''"
                />
                <!-- Caption overlay -->
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[2px] transition-opacity"
                  :class="
                    editingCaption === `${item.type}-${idx}`
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  "
                >
                  <div
                    v-if="editingCaption !== `${item.type}-${idx}`"
                    class="p-2 cursor-pointer"
                    @click.stop="
                      startEditingCaption(`${item.type}-${idx}`, item.alt || '')
                    "
                  >
                    <div
                      class="text-white text-xs truncate"
                      :title="item.alt || 'Click to add caption'"
                    >
                      {{ item.alt || 'Add caption...' }}
                    </div>
                  </div>
                  <div v-else class="p-2" @click.stop>
                    <input
                      ref="captionInput"
                      v-model="captionEditValue"
                      @blur="handleCaptionBlur(`${item.type}-${idx}`, idx)"
                      @keydown.enter.prevent="
                        saveCaption(`${item.type}-${idx}`, idx)
                      "
                      @keydown.escape="cancelEditingCaption"
                      class="w-full text-xs bg-white/90 text-gray-900 px-1 py-0.5 rounded border-none outline-none"
                      placeholder="Add caption..."
                      maxlength="200"
                    />
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
        <div v-if="images && images.length" class="text-p-sm text-ink-gray-5">
          Upload more images by dropping them anywhere in this window. Reorder
          images by dragging them. Hover over an image to edit caption.
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center min-h-[200px]"
        >
          <div
            class="w-full flex flex-1 flex-col items-center justify-center border border-outline-gray-2 rounded-lg bg-surface-gray-1 h-full cursor-pointer transition hover:border-primary-400 hover:bg-primary-50 text-center"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <div class="text-ink-gray-4 mb-2">
              <LucideImagePlus class="size-6" />
            </div>
            <div class="text-ink-gray-5 text-sm font-medium">
              Drag & drop images here or click to select
            </div>
          </div>
        </div>
        <div v-if="uploading">
          <div class="mb-2 text-sm">
            Uploading: {{ uploadedCount }}/{{ totalCount }}
          </div>
          <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div
              class="bg-surface-gray-5 h-2 transition-all"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <div
            v-if="uploadErrors && uploadErrors.some((e) => e)"
            class="mt-2 text-red-500 text-xs"
          >
            Some files failed to upload.
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-end gap-2">
        <Button variant="ghost" :disabled="uploading" @click="handleCancel">
          Cancel
        </Button>
        <Button
          v-if="props.mode === 'edit'"
          variant="solid"
          :loading="uploading"
          @click="handleSave"
        >
          Save
        </Button>
        <Button
          v-if="props.mode === 'new'"
          variant="solid"
          :loading="uploading"
          @click="handleUpload"
        >
          Upload
        </Button>
      </div>
    </template>
  </Dialog>
  <Teleport to="body">
    <Transition
      name="fade"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isFileDragging"
        class="fixed inset-0 z-50 bg-gray-900/60 pointer-events-none flex items-center justify-center"
      >
        <div class="text-ink-gray-1 text-base font-medium">
          Drop images anywhere
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  useTemplateRef,
} from 'vue'
import Dialog from '../../../Dialog/Dialog.vue'
import Button from '../../../Button/Button.vue'
import Select from '../../../Select/Select.vue'
import type { Editor } from '@tiptap/vue-3'
import type { UploadedFile } from '../../../../utils/useFileUpload'
import LucideX from '~icons/lucide/x'
import LucideImagePlus from '~icons/lucide/image-plus'

interface UploadResult {
  success: boolean
  file?: UploadedFile
  error?: Error
}

interface ExistingImage {
  src: string
  alt: string
}

interface ImageItem {
  type: 'file' | 'existing'
  file?: File
  existing?: ExistingImage
  alt?: string
  id: string
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    files: File[]
    editor: Editor
    mode: 'new' | 'edit'
    existingImages?: ExistingImage[]
    initialColumns?: number
  }>(),
  {
    mode: 'new',
  },
)

const emit = defineEmits(['update:modelValue', 'close', 'update:files', 'save'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isFileDragging = ref(false)
const draggedIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)
const columnsInitialized = ref(false)

// Caption editing state
const editingCaption = ref<string | null>(null)
const captionEditValue = ref('')
const captionInputRef = ref<HTMLInputElement | null>(null)

const uploading = ref(false)
const columns = ref(4)
const uploadProgress = ref(0)
const uploadedCount = ref(0)
const totalCount = ref(0)
const uploadErrors = ref<(Error | null)[]>([])
const uploadResults = ref<UploadResult[]>([])

// Unified images array handling both files and existing images
const images = ref<ImageItem[]>([])

// Initialize images when modal opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.mode === 'edit') {
      const existingItems = (props.existingImages || []).map(
        createExistingImageItem,
      )
      const fileItems = (props.files || []).map(createImageItem)
      images.value = [...existingItems, ...fileItems]

      if (props.initialColumns) {
        columns.value = props.initialColumns
        columnsInitialized.value = true
      }
    } else if (isOpen && props.mode === 'new') {
      images.value = (props.files || []).map(createImageItem)
      columns.value = getDefaultColumns(images.value.length)
      columnsInitialized.value = true
    }
  },
  { immediate: true },
)

watch(
  () => props.existingImages,
  (newExistingImages) => {
    if (props.modelValue && props.mode === 'edit') {
      const existingItems = (newExistingImages || []).map(
        createExistingImageItem,
      )
      const fileItems = (props.files || []).map(createImageItem)
      images.value = [...existingItems, ...fileItems]
    }
  },
  { deep: true },
)

watch(
  () => props.files,
  (newFiles) => {
    if (props.mode === 'new') {
      images.value = (newFiles || []).map(createImageItem)
    }
  },
  { deep: true },
)

onMounted(() => {
  window.addEventListener('dragover', onDragOverWindow)
  window.addEventListener('drop', onDrop)
  window.addEventListener('dragleave', onDragLeaveWindow)
})

onUnmounted(() => {
  window.removeEventListener('dragover', onDragOverWindow)
  window.removeEventListener('drop', onDrop)
  window.removeEventListener('dragleave', onDragLeaveWindow)
})

async function handleSave() {
  // Upload new files and combine with existing images
  const newFiles = images.value
    .filter((item) => item.type === 'file' && item.file)
    .map((item) => item.file!)

  const existingImages = images.value
    .filter((item) => item.type === 'existing' && item.existing)
    .map((item) => item.existing!)

  let uploadResults: UploadResult[] = []

  if (newFiles.length > 0) {
    uploadResults = await uploadFiles(newFiles)
  }

  // Map files to their upload results for reliable lookup
  const fileToUploadMap = new Map<File, ExistingImage>()
  newFiles.forEach((file, index) => {
    const result = uploadResults[index]
    if (result?.success && result.file) {
      fileToUploadMap.set(file, {
        src: result.file.file_url || '',
        alt: result.file.file_name || '',
      })
    }
  })

  // Build final images maintaining UI order
  const finalImages: ExistingImage[] = []
  for (const item of images.value) {
    if (item.type === 'existing' && item.existing) {
      finalImages.push(item.existing)
    } else if (item.type === 'file' && item.file) {
      const uploadedImage = fileToUploadMap.get(item.file)
      if (uploadedImage) {
        finalImages.push(uploadedImage)
      }
    }
  }

  emit('save', {
    images: finalImages,
    columns: columns.value,
  })

  uploading.value = false
  modelValue.value = false
}

async function handleUpload() {
  if (!props.files || props.files.length === 0) return

  const results = await uploadFiles(props.files)

  const uploadedImages = results
    .filter((result) => result.success && result.file)
    .map((result) => ({
      src: result.file?.file_url || '',
      alt: result.file?.file_name || '',
    }))

  if (uploadedImages.length > 1) {
    props.editor
      .chain()
      .focus()
      .setImageGroup({ images: uploadedImages, columns: columns.value })
      .run()
  }

  uploading.value = false
  modelValue.value = false
  emit('close')
}

function handleCancel() {
  modelValue.value = false
  emit('close')
}

function removeImage(idx: number) {
  images.value.splice(idx, 1)

  if (props.mode === 'new') {
    const newFiles = images.value
      .filter((item) => item.type === 'file' && item.file)
      .map((item) => item.file!)
    emit('update:files', newFiles)
  }
}

function triggerFileInput() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.multiple = true
  fileInput.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files) {
      addFiles(Array.from(files))
    }
  }
  fileInput.click()
}

function addFiles(files: File[]) {
  const imageFiles = files.filter((file) => file.type.startsWith('image/'))
  const newImageItems = imageFiles.map(createImageItem)

  const existingFileSignatures = images.value
    .filter((item) => item.type === 'file' && item.file)
    .map((item) => `${item.file!.name}-${item.file!.size}`)

  const uniqueNewItems = newImageItems.filter(
    (item) =>
      !existingFileSignatures.includes(`${item.file!.name}-${item.file!.size}`),
  )

  images.value.push(...uniqueNewItems)

  if (props.mode === 'new') {
    const newFiles = images.value
      .filter((item) => item.type === 'file' && item.file)
      .map((item) => item.file!)
    emit('update:files', newFiles)
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  const droppedFiles = Array.from(e.dataTransfer?.files || [])
  if (droppedFiles.length) {
    addFiles(droppedFiles)
  } else if (
    draggedIndex.value !== null &&
    overIndex.value !== null &&
    draggedIndex.value !== overIndex.value
  ) {
    // Handle image reordering
    const [moved] = images.value.splice(draggedIndex.value, 1)
    images.value.splice(overIndex.value, 0, moved)

    if (props.mode === 'new') {
      const newFiles = images.value
        .filter((item) => item.type === 'file' && item.file)
        .map((item) => item.file!)
      emit('update:files', newFiles)
    }
  }
  isFileDragging.value = false
  draggedIndex.value = null
  overIndex.value = null
}

function createImageItem(file: File): ImageItem {
  return {
    type: 'file',
    file,
    id: `file-${file.name}-${file.size}-${Date.now()}`,
  }
}

function createExistingImageItem(existing: ExistingImage): ImageItem {
  return {
    type: 'existing',
    existing,
    id: `existing-${existing.src}-${Date.now()}`,
  }
}

function getDefaultColumns(count: number) {
  if (count <= 4) return count
  if (count % 4 === 0) return 4
  if (count % 3 === 0) return 3
  if (count > 10) return 4
  return 3
}

function getUploadFunction() {
  const imageGroupExtension = props.editor.extensionManager.extensions.find(
    (ext) => ext.name === 'imageGroup',
  )
  return imageGroupExtension?.options?.uploadFunction
}

function filePreview(file: File) {
  const url = URL.createObjectURL(file)

  onUnmounted(() => {
    URL.revokeObjectURL(url)
  })

  return url
}

function isImageSupported(file: File): boolean {
  // HEIC/HEIF files can't be previewed in browsers
  const unsupportedTypes = ['image/heic', 'image/heif']
  const unsupportedExtensions = ['.heic', '.heif']

  const hasUnsupportedType = unsupportedTypes.includes(file.type)
  const hasUnsupportedExtension = unsupportedExtensions.some((ext) =>
    file.name?.toLowerCase().endsWith(ext),
  )

  return !hasUnsupportedType && !hasUnsupportedExtension
}

function onDragOver(e: DragEvent, idx: number) {
  e.preventDefault()
  overIndex.value = idx
}

function onDragStart(idx: number) {
  draggedIndex.value = idx
}

function onDragEnd() {
  draggedIndex.value = null
  overIndex.value = null
}

function onDragLeave(e: DragEvent, idx: number) {
  if (overIndex.value === idx) {
    overIndex.value = null
  }
}

function isDropTarget(idx: number) {
  return (
    overIndex.value === idx &&
    draggedIndex.value !== null &&
    draggedIndex.value !== idx
  )
}

function onDragOverWindow(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
    isFileDragging.value = true
  }
}

function onDragLeaveWindow(e: DragEvent) {
  if (e.target === window || e.relatedTarget === null) {
    isFileDragging.value = false
  }
}

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value || 4}, minmax(0, 1fr))`,
}))

const internalColumns = computed({
  get: () => String(columns.value ?? 4),
  set: (val) => {
    columns.value = +val
  },
})

const selectOptions = [
  { label: '2 columns', value: '2' },
  { label: '3 columns', value: '3' },
  { label: '4 columns', value: '4' },
]

function startEditingCaption(itemId: string, currentAlt: string) {
  editingCaption.value = itemId
  captionEditValue.value = currentAlt

  nextTick(() => {
    if (captionInputRef.value) {
      captionInputRef.value.focus()
      captionInputRef.value.select()
    }
  })
}

function saveCaption(itemId: string, itemIndex: number) {
  const [type, indexStr] = itemId.split('-')
  const newCaption = captionEditValue.value.trim()

  if (type === 'existing') {
    if (images.value[itemIndex]?.existing) {
      images.value[itemIndex].existing.alt = newCaption
    }
  } else if (type === 'file') {
    if (images.value[itemIndex]) {
      images.value[itemIndex].alt = newCaption
    }
  }

  editingCaption.value = null
  captionEditValue.value = ''
}

function cancelEditingCaption() {
  editingCaption.value = null
  captionEditValue.value = ''
}

function handleCaptionBlur(itemId: string, itemIndex: number) {
  if (editingCaption.value === itemId) {
    saveCaption(itemId, itemIndex)
  }
}

async function uploadFiles(files: File[]): Promise<UploadResult[]> {
  const uploadFunction = getUploadFunction()
  if (!uploadFunction) {
    console.error('uploadFunction not found')
    throw new Error('Upload function not found')
  }

  uploading.value = true
  totalCount.value = files.length
  uploadedCount.value = 0
  uploadProgress.value = 0
  uploadErrors.value = Array(files.length).fill(null)
  uploadResults.value = Array(files.length).fill(null)

  const uploadPromises = files.map(async (file, index) => {
    try {
      const result = await uploadFunction(file)
      uploadResults.value[index] = { success: true, file: result }
      return { success: true, file: result }
    } catch (error) {
      const err = error as Error
      uploadErrors.value[index] = err
      uploadResults.value[index] = { success: false, error: err }
      return { success: false, error: err }
    } finally {
      uploadedCount.value++
      uploadProgress.value = Math.round(
        (uploadedCount.value / totalCount.value) * 100,
      )
    }
  })

  // Execute all uploads in parallel
  const results = await Promise.all(uploadPromises)
  return results
}
</script>
