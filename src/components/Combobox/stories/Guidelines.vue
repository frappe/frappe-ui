<script setup lang="ts">
import { Combobox } from 'frappe-ui'

const timezones = [
  'Eastern Standard Time (EST)',
  'Central Standard Time (CST)',
  'Pacific Standard Time (PST)',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Allow clearing the selection (do-only, real component). The
         `#suffix` slot and `clear()` are the documented pattern from the
         Clear button section above. -->
    <Guideline
      caption="Add a clear button to an optional field, so people can undo a pick."
    >
      <template #do>
        <Combobox
          class="w-64"
          label="Timezone"
          :options="timezones"
          model-value="Eastern Standard Time (EST)"
        >
          <template #suffix="{ clear }">
            <button
              type="button"
              aria-label="Clear"
              class="text-ink-gray-5"
              @click.stop="clear"
              @pointerdown.stop
            >
              <span class="lucide-x size-4" aria-hidden="true" />
            </button>
          </template>
        </Combobox>
      </template>
    </Guideline>
  </div>
</template>
