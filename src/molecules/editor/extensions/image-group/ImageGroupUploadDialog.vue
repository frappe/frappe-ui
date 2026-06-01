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
      <div ref="dialogBody" class="space-y-2">
        <div class="flex items-center gap-2">
          <Button @click="triggerFileInput">
            <template #prefix>
              <span class="lucide-image-plus size-4" />
            </template>
            Add images
          </Button>
          <Select
            id="columns-select"
            :options="columnOptions"
            v-model="columnsModel"
            size="sm"
            variant="subtle"
            class="w-28"
          />
        </div>

        <ImageGroupGrid
          v-if="dialog.images.value.length"
          :images="dialog.images.value"
          :columns="dialog.columns.value"
          @remove="onRemove"
          @update-caption="onUpdateCaption"
          @reorder="onReorder"
        />
        <div
          v-if="dialog.images.value.length"
          class="text-p-sm text-ink-gray-5"
        >
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
          >
            <div class="text-ink-gray-4 mb-2">
              <span class="lucide-image-plus size-6" />
            </div>
            <div class="text-ink-gray-5 text-sm font-medium">
              Drag & drop images here or click to select
            </div>
          </div>
        </div>

        <div v-if="dialog.uploading.value">
          <div class="mb-2 text-sm">
            Uploading: {{ dialog.uploadedCount.value }}/{{
              dialog.totalCount.value
            }}
          </div>
          <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div
              class="bg-surface-gray-5 h-2 transition-all"
              :style="{ width: dialog.uploadProgress.value + '%' }"
            ></div>
          </div>
        </div>
        <div
          v-if="dialog.hasUploadError.value"
          class="mt-2 text-red-500 text-xs"
        >
          Some files failed to upload. They have been kept so you can try again.
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-end gap-2">
        <Button
          variant="ghost"
          :disabled="dialog.uploading.value"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          v-if="props.mode === 'edit'"
          variant="solid"
          :loading="dialog.uploading.value"
          @click="handleSave"
        >
          Save
        </Button>
        <Button
          v-else
          variant="solid"
          :loading="dialog.uploading.value"
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
          Drop images here
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import Dialog from '@components/Dialog/Dialog.vue'
import Button from '@components/Button/Button.vue'
import Select from '@components/Select/Select.vue'
import type { Editor } from '@tiptap/core'
import { useScopedFileDrop } from '@molecules/editor/composables/useScopedFileDrop'
import {
  clampColumns,
  columnSelectOptions,
  getDefaultColumns,
} from './image-group-utils'
import { useImageGroupDialog } from './useImageGroupDialog'
import { useStrayDropGuard } from './useStrayDropGuard'
import ImageGroupGrid from './ImageGroupGrid.vue'
import type { ExistingImage } from '@molecules/editor/extensions/shared/upload-types'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    files: File[]
    editor: Editor
    mode: 'new' | 'edit'
    existingImages?: ExistingImage[]
    initialColumns?: number
  }>(),
  { mode: 'new' },
)

const emit = defineEmits([
  'update:modelValue',
  'close',
  'update:files',
  'save',
])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const columnOptions = columnSelectOptions()

const dialog = useImageGroupDialog({
  editor: () => props.editor,
  mode: () => props.mode,
})

const columnsModel = computed({
  get: () => String(dialog.columns.value),
  set: (val) => {
    dialog.columns.value = clampColumns(val)
  },
})

const dialogBody = useTemplateRef<HTMLElement>('dialogBody')
const { isFileDragging } = useScopedFileDrop(dialogBody, (dropped) => {
  emit('update:files', dialog.addFiles(dropped))
})

// Swallow file drops outside the dialog so a stray drop can't navigate the page
// away while the dialog is open (see useStrayDropGuard).
useStrayDropGuard(modelValue)

function syncFromProps() {
  dialog.reset({ files: props.files ?? [], existing: props.existingImages })
  if (props.mode === 'edit') {
    dialog.columns.value = clampColumns(props.initialColumns ?? 4)
  } else {
    dialog.columns.value = getDefaultColumns(dialog.images.value.length)
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) syncFromProps()
  },
  { immediate: true },
)

watch(
  () => props.files,
  (files) => {
    // `update:files` echoes back through `props.files`; skip re-sync on an echo
    // (same file set) so it doesn't wipe typed captions / chosen columns.
    if (props.modelValue && !dialog.matchesFileSet(files ?? [])) {
      syncFromProps()
    }
  },
  { deep: true },
)

watch(
  () => props.existingImages,
  () => {
    if (props.modelValue && props.mode === 'edit') syncFromProps()
  },
  { deep: true },
)

function triggerFileInput() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = (e) => {
    const picked = (e.target as HTMLInputElement).files
    if (picked) emit('update:files', dialog.addFiles(Array.from(picked)))
  }
  input.click()
}

function onRemove(index: number) {
  emit('update:files', dialog.removeImage(index))
}

function onUpdateCaption({
  index,
  caption,
}: {
  index: number
  caption: string
}) {
  dialog.setCaption(index, caption)
}

function onReorder({ from, to }: { from: number; to: number }) {
  emit('update:files', dialog.reorder(from, to))
}

function handleCancel() {
  modelValue.value = false
  emit('close')
}

async function handleSave() {
  const finalImages = await dialog.buildFinalImages()
  if (dialog.isUnmounted()) return
  if (dialog.hasUploadError.value) return // keep open for retry
  emit('save', { images: finalImages, columns: dialog.columns.value })
  modelValue.value = false
}

async function handleUpload() {
  const finalImages = await dialog.buildFinalImages()
  if (dialog.isUnmounted()) return
  if (dialog.hasUploadError.value) return // keep open for retry
  if (finalImages.length > 1 && !props.editor.isDestroyed) {
    props.editor
      .chain()
      .focus()
      .setImageGroup({ images: finalImages, columns: dialog.columns.value })
      .run()
  } else if (finalImages.length === 1 && !props.editor.isDestroyed) {
    const lone = finalImages[0]
    props.editor.chain().focus().setImage({ src: lone.src, alt: lone.alt }).run()
  }
  modelValue.value = false
  emit('close')
}
</script>
