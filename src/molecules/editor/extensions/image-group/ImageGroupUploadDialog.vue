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
      <div ref="dialogBody" class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <Button size="sm" @click="triggerFileInput">
            <template #prefix>
              <span class="lucide-image-plus size-4" />
            </template>
            Add images
          </Button>
          <div
            v-if="dialog.images.value.length"
            class="flex items-center gap-3"
          >
            <span class="text-p-sm text-ink-gray-5">
              {{ dialog.images.value.length }}
              {{ dialog.images.value.length === 1 ? 'image' : 'images' }}
            </span>
            <Select
              id="columns-select"
              :options="columnOptions"
              v-model="columnsModel"
              size="sm"
              variant="subtle"
              class="w-28"
            />
          </div>
        </div>

        <ImageGroupGrid
          v-if="dialog.images.value.length"
          :images="dialog.images.value"
          :columns="dialog.columns.value"
          @remove="onRemove"
          @retry="onRetry"
          @update-caption="onUpdateCaption"
          @reorder="onReorder"
        />
        <div
          v-if="dialog.images.value.length"
          class="text-p-xs text-ink-gray-4"
        >
          Drag images to reorder · hover an image to caption or remove it ·
          drop files anywhere to add more
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center min-h-[200px]"
        >
          <div
            class="w-full flex flex-1 flex-col items-center justify-center border border-outline-gray-2 rounded-lg bg-surface-gray-1 h-full cursor-pointer transition hover:border-outline-gray-3 hover:bg-surface-gray-2 text-center"
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
          <div class="mb-2 text-sm text-ink-gray-6">
            Uploading {{ dialog.uploadedCount.value }} of
            {{ dialog.totalCount.value }}…
          </div>
          <div class="w-full bg-surface-gray-2 rounded h-2 overflow-hidden">
            <div
              class="bg-surface-gray-8 h-2 transition-all"
              :style="{ width: dialog.uploadProgress.value + '%' }"
            ></div>
          </div>
        </div>
        <ErrorMessage
          v-if="dialog.hasUploadError.value"
          class="mt-2"
          message="Some images failed to upload. Retry or remove the marked images to continue."
        />
      </div>
    </template>
    <template #actions>
      <div class="flex justify-end gap-2">
        <Button size="sm" variant="ghost" @click="handleCancel">
          {{ dialog.uploading.value ? 'Cancel uploads' : 'Cancel' }}
        </Button>
        <Button
          v-if="props.mode === 'new' && dialog.images.value.length > 1"
          size="sm"
          variant="subtle"
          :loading="dialog.uploading.value"
          @click="handleInsertSeparate"
        >
          Insert as separate images
        </Button>
        <Button
          v-if="props.mode === 'edit'"
          size="sm"
          variant="solid"
          :loading="dialog.uploading.value"
          @click="handleSave"
        >
          Save
        </Button>
        <Button
          v-else
          size="sm"
          variant="solid"
          :disabled="!dialog.images.value.length"
          :loading="dialog.uploading.value"
          @click="handleUpload"
        >
          {{ insertLabel }}
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
import Dialog from '#components/Dialog/Dialog.vue'
import Button from '#components/Button/Button.vue'
import Select from '#components/Select/Select.vue'
import { ErrorMessage } from '#components/ErrorMessage'
import type { Editor } from '@tiptap/core'
import { useScopedFileDrop } from '#molecules/editor/composables/useScopedFileDrop'
import {
  clampColumns,
  columnSelectOptions,
  getDefaultColumns,
} from './image-group-utils'
import { useImageGroupDialog } from './useImageGroupDialog'
import { useStrayDropGuard } from './useStrayDropGuard'
import ImageGroupGrid from './ImageGroupGrid.vue'
import type { ExistingImage } from '#molecules/editor/extensions/shared/upload-types'

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

const emit = defineEmits(['update:modelValue', 'close', 'update:files', 'save'])

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

const insertLabel = computed(() => {
  const count = dialog.images.value.length
  if (count > 1) return `Insert ${count} images`
  return 'Insert image'
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

function onRetry(index: number) {
  void dialog.retryImage(index)
}

function handleCancel() {
  dialog.abortAll()
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
    props.editor
      .chain()
      .focus()
      .setImage({ src: lone.src, alt: lone.alt })
      .run()
  }
  modelValue.value = false
  emit('close')
}

async function handleInsertSeparate() {
  const finalImages = await dialog.buildFinalImages()
  if (dialog.isUnmounted()) return
  if (dialog.hasUploadError.value) return
  if (!props.editor.isDestroyed) {
    for (const image of finalImages) {
      props.editor
        .chain()
        .focus()
        .setImage({ src: image.src, alt: image.alt })
        .run()
    }
  }
  modelValue.value = false
  emit('close')
}
</script>
