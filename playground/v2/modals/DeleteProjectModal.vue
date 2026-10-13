<script setup lang="ts">
// Figma: espresso-2.0 › References › modal › "modal new" (34945:94320) —
// variant dialog, size md; the 600px set reuses it at `width="600"`.
import { Button } from '../../../src'
import EspressoModal from './EspressoModal.vue'

withDefaults(defineProps<{ width?: '440' | '600' }>(), { width: '440' })

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ confirm: [] }>()

function confirm(close: () => void) {
  emit('confirm')
  close()
}
</script>

<template>
  <EspressoModal
    v-model:open="open"
    title="Delete project"
    variant="dialog"
    shadow="2xl"
    :width="width"
  >
    <!-- 20px badge: 3px inset, 4px radius, 14px icon -->
    <template #prefix>
      <div
        class="flex size-5 shrink-0 items-center justify-center rounded-1 bg-surface-red-2"
      >
        <span
          class="lucide-trash-2 size-3.5 text-ink-red-7"
          aria-hidden="true"
        />
      </div>
    </template>

    <p class="text-p-base text-ink-gray-6">
      This will permanently remove the project. This action cannot be undone.
    </p>

    <template #footer="{ close }">
      <Button variant="subtle" theme="gray" size="sm" @click="close">
        Cancel
      </Button>
      <Button variant="solid" theme="red" size="sm" @click="confirm(close)">
        Delete
      </Button>
    </template>
  </EspressoModal>
</template>
