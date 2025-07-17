<template>
  <div
    class="flex max-h-[140px] items-center gap-2 overflow-hidden bg-surface-white text-ink-gray-8 px-6 pt-5"
    :class="config.delta ? 'pb-6' : 'pb-3'"
  >
    <div class="flex w-full flex-col">
      <span class="truncate text-sm font-medium">
        {{ config.title }}
      </span>
      <div
        class="flex-1 flex-shrink-0 truncate text-[24px] font-semibold leading-10"
      >
        {{ config.prefix }}{{ formatNumber(config.value, { compact: true })
        }}{{ config.suffix }}
      </div>
      <div
        v-if="config.delta"
        class="flex items-center gap-0.5 text-xs font-medium"
        :class="[
          config.negativeIsBetter
            ? config.delta >= 0
              ? 'text-ink-red-4'
              : 'text-ink-green-3'
            : config.delta >= 0
              ? 'text-ink-green-3'
              : 'text-ink-red-4',
        ]"
      >
        <span class="">
          {{ config.delta >= 0 ? '↑' : '↓' }}
        </span>
        <span>
          {{ config.deltaPrefix }}{{ formatNumber(config.delta, { compact: true })
          }}{{ config.deltaSuffix }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatNumber } from '@/utils/format';
import { NumberChartConfig } from './types'

const props = defineProps<{ config: NumberChartConfig }>()
const error = ref('')
</script>
