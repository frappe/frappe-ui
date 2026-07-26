<script setup lang="ts">
// A quota meter can pair calculated progress with richer usage details below.
import { computed } from 'vue'
import { Button, Progress } from 'frappe-ui'

const usedGB = 700
const totalGB = 2048

const percent = computed(() => Math.round((usedGB / totalGB) * 100))
const usageLabel = computed(
  () => `${formatSize(usedGB)} of ${formatSize(totalGB)}`,
)

function formatSize(gigabytes: number) {
  if (gigabytes >= 1024) return `${gigabytes / 1024} TB`
  return `${gigabytes} GB`
}
</script>

<template>
  <div class="w-full max-w-[240px]">
    <Progress :value="percent" label="Storage" size="md" />

    <div class="mt-3.5 flex items-center gap-2">
      <span
        class="lucide-cloud size-4 shrink-0 text-ink-gray-5"
        aria-hidden="true"
      />
      <span class="text-base text-ink-gray-5">{{ usageLabel }}</span>
      <Button class="ml-auto" variant="ghost" size="sm">Manage</Button>
    </div>
  </div>
</template>
