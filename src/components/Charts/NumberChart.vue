<template>
  <div
    class="flex max-h-[140px] items-center gap-2 overflow-hidden bg-surface-white text-ink-gray-8 px-6 pt-5"
    :class="config.delta ? 'pb-6' : 'pb-3'"
  >
    <slot name="body">
      <div class="flex w-full flex-col">
        <slot name="title">
          <span class="truncate text-sm font-medium text-ink-gray-5">
            {{ config.title }}
          </span>
        </slot>
        <slot name="subtitle" v-bind="{ formatValue }">
          <div
            class="flex-1 flex-shrink-0 truncate text-[24px] text-ink-gray-6 font-semibold leading-10"
          >
            {{ config.prefix }}{{ formatValue(config.value, 1, true)
            }}{{ config.suffix }}
          </div>
        </slot>
        <slot name="delta" v-bind="{ formatValue }">
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
              {{ config.deltaPrefix }}{{ formatValue(config.delta, 1, true)
              }}{{ config.deltaSuffix }}
            </span>
          </div>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from './helpers'
import { NumberChartConfig } from './types'

defineProps<{ config: NumberChartConfig }>()
</script>
