<script setup lang="ts">
// Figma: espresso-2.0 › Embed › "modal new" (32480:13935) — variant
// dialog, size sm: the 360px card under the 2xl elevation, the 20px red
// badge with the 14px trash before an 18px semibold title, 12px to the
// 14px/150% body, 16px to the sm buttons on the right. The word before
// the deed, since an embed is a link that may be hard to find again.
import { Button } from '../../../src'
import EspressoModal from '../modals/EspressoModal.vue'

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
    title="Remove Embed"
    variant="dialog"
    shadow="2xl"
    width="360"
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
      This embedded content will be removed from the document.
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
