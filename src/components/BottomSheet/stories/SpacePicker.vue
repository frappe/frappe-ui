<script setup lang="ts">
import { ref } from 'vue'
import { BottomSheet, Button } from 'frappe-ui'

const open = ref(false)
const current = ref('Design')
const spaces = [
  'Announcements',
  'Customer success',
  'Design',
  'Engineering',
  'Finance',
  'Hiring',
  'Infrastructure',
  'Legal',
  'Marketing',
  'Mobile',
  'Operations',
  'Partnerships',
  'Product',
  'Research',
  'Sales',
  'Security',
  'Support',
  'Website',
]

function pick(space: string) {
  current.value = space
  open.value = false
}
</script>

<template>
  <Button
    :label="`Space: ${current}`"
    icon-right="lucide-chevron-down"
    @click="open = true"
  />

  <BottomSheet v-model:open="open" title="Move to space">
    <div class="flex flex-col p-2 pb-8">
      <button
        v-for="space in spaces"
        :key="space"
        type="button"
        class="flex items-center justify-between rounded-4 px-3 py-2.5 text-start text-p-base text-ink-gray-8 hover:bg-surface-gray-2"
        @click="pick(space)"
      >
        {{ space }}
        <span
          v-if="space === current"
          class="lucide-check size-4 text-ink-gray-7"
          aria-hidden="true"
        />
      </button>
    </div>
  </BottomSheet>
</template>
