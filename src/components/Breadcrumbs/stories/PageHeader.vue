<script setup lang="ts">
import { ref } from 'vue'
import { Breadcrumbs, Button } from 'frappe-ui'

const lastClicked = ref('')

const items = [
  { label: 'Projects', onClick: () => (lastClicked.value = 'Projects') },
  {
    label: 'Website redesign',
    onClick: () => (lastClicked.value = 'Website redesign'),
  },
  { label: 'Homepage copy' },
]
</script>

<template>
  <div class="w-full max-w-2xl">
    <header
      class="flex h-12 items-center justify-between gap-4 border-b border-outline-gray-1 px-4"
    >
      <Breadcrumbs :items="items" />
      <div class="flex shrink-0 items-center gap-2">
        <Button icon-left="lucide-share-2">Share</Button>
        <Button variant="solid" icon-left="lucide-plus">New task</Button>
      </div>
    </header>
    <p class="px-4 pt-3 text-p-sm text-ink-gray-5">
      {{ lastClicked ? `Opened ${lastClicked}` : 'Click a parent page' }}
    </p>
  </div>
</template>
