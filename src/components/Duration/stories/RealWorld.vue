<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Duration, formatDuration } from 'frappe-ui'

// Logging effort against a CRM task: the user types a duration in any
// notation, "Log time" appends it, and the entries roll up into a total.
const entries = ref<{ label: string; seconds: number }[]>([
  { label: 'Discovery call', seconds: 2700 },
  { label: 'Proposal draft', seconds: 5445 },
])

const draft = ref<number | null>(null)

const total = computed(() =>
  entries.value.reduce((sum, entry) => sum + entry.seconds, 0),
)

function logTime() {
  if (!draft.value) return
  entries.value.push({ label: 'Follow-up', seconds: draft.value })
  draft.value = null
}
</script>

<template>
  <div class="flex w-80 flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div
        v-for="(entry, index) in entries"
        :key="index"
        class="flex items-center justify-between text-base text-ink-gray-7"
      >
        <span>{{ entry.label }}</span>
        <span class="text-ink-gray-9">{{ formatDuration(entry.seconds) }}</span>
      </div>
    </div>

    <div class="flex items-end gap-2">
      <Duration v-model="draft" label="Log time" placeholder="e.g. 45m" />
      <Button label="Log time" @click="logTime" />
    </div>

    <div
      class="flex items-center justify-between border-t border-outline-gray-1 pt-3 text-base font-medium text-ink-gray-9"
    >
      <span>Total logged</span>
      <span>{{ formatDuration(total, 'long') }}</span>
    </div>
  </div>
</template>
