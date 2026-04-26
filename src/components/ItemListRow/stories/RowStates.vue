<script setup lang="ts">
import { ItemListRow } from 'frappe-ui'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-2 rounded-lg border border-outline-gray-2 bg-surface-modal p-2">
    <ItemListRow>
      Simple row with no prefix or suffix
    </ItemListRow>

    <ItemListRow active>
      <template #prefix>
        <span class="lucide-bell size-4 text-ink-gray-6" />
      </template>
      Active row with prefix
    </ItemListRow>

    <ItemListRow selected>
      <template #prefix>
        <span class="lucide-bell size-4 text-ink-gray-6" />
      </template>
      Selected row with suffix
      <template #suffix>
        <span class="lucide-check size-4 text-ink-gray-6" />
      </template>
    </ItemListRow>

    <ItemListRow disabled>
      <template #suffix>
        <span class="lucide-chevron-right size-4" />
      </template>
      Disabled row with suffix only
    </ItemListRow>
  </div>
</template>
