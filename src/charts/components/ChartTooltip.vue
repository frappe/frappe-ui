<template>
  <Teleport to="body">
    <div
      v-if="open && items.length"
      ref="tooltipEl"
      data-slot="chart-tooltip"
      class="pointer-events-none fixed z-[100] max-w-xs rounded-6 border border-outline-gray-1 bg-surface-elevation-2 px-3 py-2 shadow-lg"
      :style="position"
      :dir="dir"
      role="tooltip"
    >
      <slot :label="label" :items="items">
        <div v-if="label" class="mb-2 text-p-sm text-ink-gray-5">
          {{ label }}
        </div>
        <div class="flex flex-col gap-1.5">
          <div
            v-for="item in items"
            :key="item.name"
            class="flex items-center justify-between gap-5 text-p-sm"
          >
            <span class="flex min-w-0 items-center gap-2">
              <span
                class="size-2 shrink-0 rounded-1"
                :style="{ backgroundColor: item.color }"
              />
              <span class="truncate text-ink-gray-6">{{ item.label }}</span>
            </span>
            <span
              class="shrink-0 text-p-sm-semibold tabular-nums text-ink-gray-8"
            >
              {{ item.formattedValue }}
              <span
                v-if="item.percent !== undefined"
                class="text-p-sm text-ink-gray-5"
              >
                {{ formatPercent(item.percent) }}
              </span>
            </span>
          </div>
        </div>
      </slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { formatPercent } from '../format'
import type { ChartTooltipItem, ChartTooltipProps } from '../types'

const props = defineProps<ChartTooltipProps>()

defineSlots<{
  default: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
}>()

const OFFSET = 12

const tooltipEl = ref<HTMLElement>()
const position = ref<Record<string, string>>({ left: '0px', top: '0px' })

// Measured after render rather than estimated: the slot content is the app's,
// so its size isn't knowable up front.
watch(
  () => [props.open, props.x, props.y, props.items] as const,
  async () => {
    if (!props.open) return
    await nextTick()
    const el = tooltipEl.value
    if (!el) return

    const { width, height } = el.getBoundingClientRect()
    const flipX = props.x + OFFSET + width > window.innerWidth
    const flipY = props.y + OFFSET + height > window.innerHeight

    const left = flipX ? props.x - OFFSET - width : props.x + OFFSET
    const top = flipY ? props.y - OFFSET - height : props.y + OFFSET

    position.value = {
      left: `${clamp(left, 4, window.innerWidth - width - 4)}px`,
      top: `${clamp(top, 4, window.innerHeight - height - 4)}px`,
    }
  },
  { immediate: true, flush: 'post' },
)

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}
</script>
