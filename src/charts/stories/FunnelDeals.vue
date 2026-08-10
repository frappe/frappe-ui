<script setup lang="ts">
import { ref } from 'vue'
import { FunnelChart } from 'frappe-ui/charts'
import type { FunnelStageEvent } from 'frappe-ui/charts'

const dealStages = [
  { stage: 'Leads', count: 563 },
  { stage: 'Qualified', count: 385 },
  { stage: 'Quotation sent', count: 291 },
  { stage: 'Ready to close', count: 191 },
  { stage: 'Won', count: 39 },
]

const stage = ref<FunnelStageEvent | null>(null)
</script>

<template>
  <div class="flex h-96 w-full flex-col gap-2">
    <div class="min-h-0 flex-1">
      <FunnelChart
        :data="dealStages"
        category="stage"
        value="count"
        :show-percentages="false"
        title="Deal pipeline"
        subtitle="Open deals by stage, this quarter"
        @select="stage = $event"
      />
    </div>
    <p class="text-p-sm text-ink-gray-5">
      <template v-if="stage">
        Selected {{ stage.label }} · {{ stage.value }} · index {{ stage.index }}
      </template>
      <template v-else>Select a stage.</template>
    </p>
  </div>
</template>
