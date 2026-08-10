<template>
  <!-- The state is on the element as well as in what it draws, so an app can
       style a loading or failed card from CSS without tracking the state
       itself: `[data-state='error'] { … }`. -->
  <div
    data-slot="chart-container"
    :data-state="state"
    class="flex h-full w-full min-w-0 flex-col gap-1.5"
    :dir="dir"
  >
    <div
      v-if="title || subtitle || $slots.actions"
      data-slot="chart-header"
      class="flex items-start justify-between gap-3"
    >
      <div class="min-w-0">
        <div v-if="title" class="truncate text-p-base text-ink-gray-8">
          {{ title }}
        </div>
        <div v-if="subtitle" class="truncate text-p-sm text-ink-gray-5">
          {{ subtitle }}
        </div>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- Value-axis titles, each over the edge its axis is drawn on, so the row
         mirrors with the plot in RTL. -->
    <div
      v-if="topPlotLabel"
      class="flex items-baseline justify-between gap-3 text-p-xs text-ink-gray-5"
    >
      <span class="truncate">{{ plotLabel }}</span>
      <span v-if="plotLabelSecondary" class="truncate">
        {{ plotLabelSecondary }}
      </span>
    </div>

    <!-- The pad stands in for the space a legend would have taken, so a
         single-series chart sits in the card the way a multi-series one does. -->
    <div
      data-slot="chart-plot"
      class="relative min-h-0 flex-1"
      :class="{ 'pb-3': !$slots.legend && !bottomPlotLabel }"
    >
      <!-- The plot stays mounted through every state: unmounting it would
           dispose the echarts instance and re-init it on the way back. -->
      <div class="h-full w-full" :class="{ invisible: state !== 'ready' }">
        <slot />
      </div>

      <!-- The loading state gets the whole plot box rather than a row in the
           middle of it, because what it draws is the shape of the plot. A
           caller replacing it is drawing a placeholder, not a caption. -->
      <div
        v-if="state === 'loading'"
        data-slot="chart-loading"
        class="absolute inset-0"
      >
        <!-- Announced by the container, so an app's own placeholder does not
             have to carry the announcement with it. -->
        <span class="sr-only" role="status">Loading chart</span>
        <slot name="loading">
          <!-- A block the size of the plot, not a spinner in the middle of it.
               A dashboard fills in a card at a time, and a placeholder holding
               the grid's shape reads as one card arriving rather than as eight
               spinners turning out of step. NumberCard, which has no plot,
               skeletons its reading the same way. -->
          <Skeleton class="h-full w-full rounded-4" />
        </slot>
      </div>

      <div
        v-else-if="state !== 'ready'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
      >
        <template v-if="state === 'error'">
          <slot name="error" :error="error">
            <span class="text-sm-medium text-ink-red-7">
              Could not render this chart
            </span>
            <span v-if="error" class="max-w-sm text-p-sm text-ink-gray-5">
              {{ error }}
            </span>
          </slot>
        </template>

        <template v-else>
          <slot name="empty">
            <span class="text-p-sm text-ink-gray-5">No data to show</span>
          </slot>
        </template>
      </div>
    </div>

    <!-- The same titles under the plot, for a value axis that runs along the
         bottom. Pinned to the far end: the near end of a row chart is the
         category-label column, where a title would read as a heading for it. -->
    <div
      v-if="bottomPlotLabel"
      class="-mt-2 flex items-baseline justify-end gap-3 text-p-xs text-ink-gray-5"
    >
      <span class="truncate">{{ plotLabel }}</span>
      <span v-if="plotLabelSecondary" class="truncate">
        {{ plotLabelSecondary }}
      </span>
    </div>

    <slot name="legend" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Skeleton from '#components/Skeleton/Skeleton.vue'
import type { ChartContainerProps, ChartContainerSlots } from '../types'

const props = defineProps<ChartContainerProps>()

defineSlots<ChartContainerSlots>()

const state = computed(() => {
  if (props.error) return 'error'
  if (props.loading) return 'loading'
  if (props.empty) return 'empty'
  return 'ready'
})

// The label heads an axis, so it goes wherever that axis does: over a
// placeholder, a message or an empty card it is a title for a plot that isn't
// drawn.
const showPlotLabel = computed(
  () =>
    state.value === 'ready' &&
    Boolean(props.plotLabel || props.plotLabelSecondary),
)

const topPlotLabel = computed(
  () => showPlotLabel.value && props.plotLabelPlacement !== 'bottom',
)
const bottomPlotLabel = computed(
  () => showPlotLabel.value && props.plotLabelPlacement === 'bottom',
)
</script>
