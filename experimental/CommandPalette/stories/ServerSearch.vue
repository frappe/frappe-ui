<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from 'frappe-ui'
import {
  CommandPalette,
  CommandPaletteEmpty,
  CommandPaletteGroup,
  CommandPaletteInput,
  CommandPaletteItem,
} from '..'

// `:filterable="false"` hands the matching to the server. Without it, a
// second literal substring pass on the client would drop the fuzzy and
// relevance-ranked rows the backend just returned (ADR-0009).
const everything = [
  { name: 'design-review', title: 'Design review', team: 'Product' },
  { name: 'release-plan', title: 'Release plan', team: 'Engineering' },
  { name: 'onboarding', title: 'Onboarding checklist', team: 'People' },
  { name: 'q3-budget', title: 'Q3 budget', team: 'Finance' },
]

const open = ref(false)
const query = ref('')
const results = ref<typeof everything>([])
const loading = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined

// A debounced refetch stands in for the real request.
watch(query, (text) => {
  clearTimeout(timer)
  if (!text) {
    results.value = []
    loading.value = false
    return
  }
  loading.value = true
  timer = setTimeout(() => {
    const needle = text.toLowerCase()
    results.value = everything.filter(
      (row) =>
        row.title.toLowerCase().includes(needle) ||
        row.team.toLowerCase().includes(needle),
    )
    loading.value = false
  }, 300)
})
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Button @click="open = true">Search the server</Button>

    <CommandPalette
      v-model:open="open"
      v-model:query="query"
      :filterable="false"
      @select="open = false"
    >
      <CommandPaletteInput placeholder="Search documents" />

      <!-- The default slot is open, so a loading row needs no extra part. -->
      <div
        v-if="loading"
        class="px-4.5 py-8 text-center text-base text-ink-gray-5"
      >
        Searching…
      </div>

      <CommandPaletteGroup v-else label="Documents">
        <CommandPaletteItem v-for="row in results" :key="row.name" :value="row">
          {{ row.title }}
          <template #suffix>
            <span class="text-ink-gray-5">{{ row.team }}</span>
          </template>
        </CommandPaletteItem>
      </CommandPaletteGroup>

      <CommandPaletteEmpty v-if="!loading" v-slot="{ query: text }">
        {{ text ? `No documents match "${text}"` : 'Type to search' }}
      </CommandPaletteEmpty>
    </CommandPalette>
  </div>
</template>
