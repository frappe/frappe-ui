<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

// From Frappe Builder's analytics: "Filter by route" narrows the stats to
// one page, and an empty filter means every route. The list has no "All
// routes" option, so without a clear button there's no way back. Both sides
// are live.
const routes = ['/', '/pricing', '/blog', '/careers', '/contact']
const withClear = ref<string | null>('/pricing')
const withoutClear = ref<string | null>('/pricing')
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. When empty means something (a filter showing everything), give
         the field a clear button. `#suffix` and `clear()` are the pattern
         from the Clear button section in Behavior. -->
    <Guideline
      layout="stack"
      caption="Add a clear button when empty means something, like a filter that shows everything."
    >
      <template #do>
        <Combobox
          v-model="withClear"
          class="w-56"
          aria-label="Filter by route"
          placeholder="Filter by route"
          :options="routes"
        >
          <template #suffix="{ clear }">
            <button
              v-if="withClear"
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
      <template #dont>
        <Combobox
          v-model="withoutClear"
          class="w-56"
          aria-label="Filter by route"
          placeholder="Filter by route"
          :options="routes"
        />
      </template>
    </Guideline>
  </div>
</template>
