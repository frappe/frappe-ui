<template>
  <div
    class="relative aspect-square w-full h-full overflow-hidden group rounded bg-surface-gray-1"
  >
    <button
      v-if="item.status !== 'uploading'"
      type="button"
      class="absolute top-1 right-1 z-10 rounded bg-black/65 p-1 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
      aria-label="Remove image"
      @click.stop="$emit('remove')"
    >
      <span class="lucide-x size-4 text-ink-gray-4 hover:text-ink-white" />
    </button>

    <!-- Unsupported preview (HEIC/HEIF): filename placeholder -->
    <div
      v-if="!previewable"
      class="flex flex-col items-center justify-center w-full h-full text-ink-gray-4 bg-surface-gray-1 rounded"
    >
      <span
        class="text-p-xs text-ink-gray-4 w-full text-center px-2 mt-1"
        :title="fileName"
      >
        {{ fileName }}
      </span>
      <span class="mt-1 px-2 text-center text-p-xs text-ink-gray-5">
        Preview not available (HEIC)
      </span>
    </div>

    <img
      v-else
      :src="previewSrc"
      :alt="caption || ''"
      class="object-cover w-full h-full"
      :class="item.status === 'uploading' && 'opacity-40'"
    />

    <!-- Caption overlay: persistent when a caption is set (so the user can see
         what they typed); hover-revealed "Add caption…" affordance when empty. -->
    <div
      v-if="previewable"
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b transition-opacity"
      :class="
        editing || caption
          ? 'opacity-100'
          : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
      "
    >
      <div
        v-if="!editing"
        class="p-2 cursor-pointer"
        @click.stop="startEditing"
      >
        <div
          class="text-white text-xs truncate"
          :title="caption || 'Click to add caption'"
        >
          {{ caption || 'Add caption...' }}
        </div>
      </div>
      <div v-else class="p-2" @click.stop>
        <input
          ref="captionInput"
          v-model="draft"
          @blur="commit"
          @keydown.enter.prevent="commit"
          @keydown.escape="cancel"
          class="w-full text-xs bg-white/90 text-gray-900 px-1 py-0.5 rounded-sm border-none outline-none"
          placeholder="Add caption..."
          maxlength="200"
          aria-label="Image caption"
        />
      </div>
    </div>

    <UploadProgressIndicator
      v-if="item.status === 'uploading'"
      class="z-10"
      :percent="uploadProgress?.percent ?? 0"
      @cancel="abortUpload(item.id)"
    />

    <div
      v-if="item.status === 'failed'"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/65 p-2 text-center"
      aria-live="assertive"
    >
      <div class="text-p-xs text-ink-white">
        {{ item.error || 'Upload failed' }}
      </div>
      <div class="flex gap-2">
        <Button size="xs" variant="subtle" @click.stop="$emit('retry')">
          Retry
        </Button>
        <Button size="xs" variant="subtle" @click.stop="$emit('remove')">
          Remove
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import Button from '#components/Button/Button.vue'
import UploadProgressIndicator from '#molecules/editor/components/UploadProgressIndicator.vue'
import { useObjectUrl } from '#molecules/editor/composables/useObjectUrl'
import {
  abortUpload,
  getUploadProgress,
} from '#molecules/editor/extensions/shared/media-upload-state'
import { isImageSupported } from './image-group-utils'
import type { ImageItem } from './useImageGroupDialog'

const props = defineProps<{ item: ImageItem }>()
const emit = defineEmits<{
  remove: []
  retry: []
  'update:caption': [value: string]
}>()

const editing = ref(false)
const draft = ref('')
const captionInput = useTemplateRef<HTMLInputElement>('captionInput')

const isFile = computed(() => props.item.type === 'file' && !!props.item.file)
const uploadProgress = computed(() => getUploadProgress(props.item.id))
const fileRef = computed<File | null>(() =>
  isFile.value ? (props.item.file as File) : null,
)
// useObjectUrl tracks the ref and revokes the URL on unmount (kills the leak).
const objectUrl = useObjectUrl(fileRef)

const previewable = computed(() =>
  isFile.value ? isImageSupported(props.item.file as File) : true,
)
const fileName = computed(() => props.item.file?.name ?? '')

const caption = computed(() =>
  props.item.type === 'existing'
    ? (props.item.existing?.alt ?? '')
    : (props.item.alt ?? ''),
)

const previewSrc = computed(() =>
  props.item.type === 'existing'
    ? (props.item.existing?.src ?? '')
    : objectUrl.value,
)

function startEditing() {
  draft.value = caption.value
  editing.value = true
  nextTick(() => {
    captionInput.value?.focus()
    captionInput.value?.select()
  })
}

function commit() {
  if (!editing.value) return
  editing.value = false
  emit('update:caption', draft.value.trim())
}

function cancel() {
  editing.value = false
}
</script>
