<template>
  <Story title="Divider Action" :layout="{ width: 480 }">
    <Variant title="Action button">
      <div class="space-y-3">
        <p class="text-base text-ink-gray-7">Older items</p>
        <Divider :action="{ label: 'Load more', onClick }" />
        <p class="text-base text-ink-gray-7">Newer items</p>
      </div>
    </Variant>

    <Variant title="Vertical action">
      <div class="flex h-32 items-center gap-4">
        <span class="text-base text-ink-gray-7">Panel A</span>
        <Divider
          orientation="vertical"
          flex-item
          position="center"
          :action="{ label: 'Edit', onClick }"
        />
        <span class="text-base text-ink-gray-7">Panel B</span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { Divider } from 'frappe-ui'

function onClick() {
  console.log('divider action clicked')
}
</script>
