<template>
  <div
    class="relative aspect-square w-full h-full overflow-hidden group bg-surface-white"
  >
    <button
      type="button"
      class="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label="Remove image"
      @click.stop="$emit('remove')"
    >
      <span class="lucide-x w-4 h-4 text-gray-700" />
    </button>

    <!-- Unsupported preview (HEIC/HEIF): filename placeholder -->
    <div
      v-if="!previewable"
      class="flex flex-col items-center justify-center w-full h-full text-ink-gray-4 bg-surface-gray-1 rounded-[2px]"
    >
      <span
        class="text-p-xs text-ink-gray-4 w-full text-center px-2 mt-1"
        :title="fileName"
      >
        {{ fileName }}
      </span>
    </div>

    <img
      v-else
      :src="previewSrc"
      :alt="caption || ''"
      class="object-cover w-full h-full rounded-[2px]"
    />

    <!-- Caption overlay -->
    <div
      v-if="previewable"
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[2px] transition-opacity"
      :class="editing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useObjectUrl } from '#molecules/editor/composables/useObjectUrl'
import { isImageSupported } from './image-group-utils'
import type { ImageItem } from './useImageGroupDialog'

const props = defineProps<{ item: ImageItem }>()
const emit = defineEmits<{
  remove: []
  'update:caption': [value: string]
}>()

const editing = ref(false)
const draft = ref('')
const captionInput = useTemplateRef<HTMLInputElement>('captionInput')

const isFile = computed(() => props.item.type === 'file' && !!props.item.file)
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
    ? props.item.existing?.alt ?? ''
    : props.item.alt ?? '',
)

const previewSrc = computed(() =>
  props.item.type === 'existing'
    ? props.item.existing?.src ?? ''
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
