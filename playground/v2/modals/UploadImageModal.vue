<script setup lang="ts">
// Figma: espresso-2.0 › References › modal › "modal new" (34953:130699) —
// variant default, size md. A dashed drop zone as the body.
import { computed, ref, watch } from 'vue'
import { Button } from '../../../src'
import EspressoModal from './EspressoModal.vue'

const ACCEPT = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']
const MAX_BYTES = 5 * 1024 * 1024

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ attach: [file: File] }>()

const file = ref<File | null>(null)
const error = ref('')
const dragging = ref(false)
const input = ref<HTMLInputElement | null>(null)

const hint = computed(
  () => error.value || 'Supports JPEG, PNG, PDF, and MP4 up to 5 MB.',
)

watch(open, (isOpen) => {
  if (!isOpen) reset()
})

function reset() {
  file.value = null
  error.value = ''
  dragging.value = false
}

function pick(picked: File | undefined) {
  if (!picked) return
  if (!ACCEPT.includes(picked.type)) {
    error.value = 'That file type isn’t supported.'
    return
  }
  if (picked.size > MAX_BYTES) {
    error.value = 'That file is larger than 5 MB.'
    return
  }
  error.value = ''
  file.value = picked
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  pick(target.files?.[0])
  target.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  pick(event.dataTransfer?.files[0])
}

function attach(close: () => void) {
  if (!file.value) return
  emit('attach', file.value)
  close()
}
</script>

<template>
  <EspressoModal v-model:open="open" title="Upload image">
    <!-- drop zone: dashed outline-gray-2, 16px radius, px 24 · py 38 -->
    <div
      class="flex cursor-pointer flex-col items-center gap-4 rounded-7 border border-dashed px-6 py-[38px] transition-colors"
      :class="
        dragging
          ? 'border-outline-gray-3 bg-surface-gray-2'
          : 'border-outline-gray-2'
      "
      @click="input?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <!-- icon → text: 16px -->
      <div class="flex w-full flex-col items-center gap-4">
        <span
          class="lucide-arrow-up-to-line size-6 text-ink-gray-7"
          aria-hidden="true"
        />
        <!-- title → hint: 4px -->
        <div class="flex w-full flex-col items-center gap-1 text-center">
          <p class="w-full truncate text-base-medium text-ink-gray-9">
            {{ file ? file.name : 'Drag files here or click to browse' }}
          </p>
          <p
            class="text-p-sm"
            :class="error ? 'text-ink-red-5' : 'text-ink-gray-5'"
          >
            {{ hint }}
          </p>
        </div>
      </div>

      <Button
        variant="subtle"
        theme="gray"
        size="sm"
        @click.stop="input?.click()"
      >
        {{ file ? 'Replace file' : 'Select file' }}
      </Button>

      <input
        ref="input"
        type="file"
        class="hidden"
        :accept="ACCEPT.join(',')"
        @change="onChange"
      />
    </div>

    <template #footer="{ close }">
      <Button
        variant="subtle"
        theme="gray"
        size="md"
        :disabled="!file"
        @click="attach(close)"
      >
        Attach
      </Button>
    </template>
  </EspressoModal>
</template>
