<script setup lang="ts">
import { Tooltip } from 'frappe-ui'

// A long file name cut short in a narrow column. The tooltip shows the full
// name as soon as the pointer reaches it. The name is extra context: the
// file opens either way, so nothing essential lives only in the tooltip.
const fileName = 'Quarterly revenue forecast, final version for the board.xlsx'
</script>

<template>
  <div
    class="flex w-56 items-center gap-2 rounded-4 bg-surface-gray-2 px-2 py-1.5"
  >
    <span
      class="lucide-file-spreadsheet size-4 shrink-0 text-ink-gray-5"
      aria-hidden="true"
    />
    <Tooltip :text="fileName" :hover-delay="0" side="top">
      <span class="truncate text-base text-ink-gray-8" tabindex="0">
        {{ fileName }}
      </span>
    </Tooltip>
  </div>
</template>
