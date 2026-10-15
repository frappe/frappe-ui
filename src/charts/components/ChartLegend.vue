<template>
  <!-- One row at most: past a handful of series a wrapping legend takes the
       plot's height, and the plot is what the chart is for. The largest series
       stay on the row and the rest wait behind "+N more", where every name is
       one press away rather than behind a scroll nobody makes. -->
  <div data-slot="chart-legend" class="relative min-w-0 shrink-0">
    <DefineEntry v-slot="{ item }">
      <span class="flex items-center gap-1.5">
        <span
          class="size-2 shrink-0 rounded-full"
          :class="{ 'opacity-30': item.hidden }"
          :style="{ backgroundColor: item.color }"
        />
        <!-- A step back from the axis titles: the legend names the marks, it
             is not a label of the chart's own. -->
        <span :class="item.hidden ? 'text-ink-gray-4' : 'text-ink-gray-6'">
          {{ item.label }}
        </span>
        <span v-if="item.hint" class="tabular-nums text-ink-gray-4">
          {{ item.hint }}
        </span>
      </span>
    </DefineEntry>

    <div ref="rowEl" class="flex min-w-0 items-center justify-center gap-x-1">
      <Button
        v-for="item in shown"
        :key="item.name"
        variant="ghost"
        size="xs"
        :aria-pressed="!item.hidden"
        :label="toggleLabel(item)"
        @click="emit('change', item.name)"
        @mouseenter="emit('highlight', item.name)"
        @mouseleave="emit('highlight', null)"
        @focus="emit('highlight', item.name)"
        @blur="emit('highlight', null)"
      >
        <ReuseEntry :item="item" />
      </Button>

      <!-- The model is the visible series, so a checked row is a drawn one.
           Ranked rather than matched while searching: the list reads largest
           first whatever is typed. -->
      <MultiSelect
        v-if="shown.length < items.length"
        v-model:open="open"
        v-model:query="query"
        :model-value="visible"
        :options="options"
        :filterable="false"
        :hide-search="items.length <= SEARCH_AFTER"
        placeholder="Search series"
        empty-text="No series match"
        side="top"
        align="end"
        :portal-to="portalEl"
        @update:model-value="showOnly"
      >
        <template #trigger="{ open: isOpen }">
          <Button
            variant="ghost"
            size="xs"
            aria-haspopup="listbox"
            :aria-expanded="isOpen"
            :label="`Show ${items.length - shown.length} more series`"
          >
            <span class="tabular-nums text-ink-gray-6">
              {{ moreText(items.length - shown.length) }}
            </span>
          </Button>
        </template>
        <template #item-prefix="{ item }">
          <span
            class="size-2 shrink-0 rounded-full"
            :class="{ 'opacity-30': item.hidden }"
            :style="{ backgroundColor: item.color }"
          />
        </template>
        <template #item-suffix="{ item }">
          <span v-if="item.formattedValue" class="tabular-nums text-ink-gray-5">
            {{ item.formattedValue }}
          </span>
        </template>
        <!-- Clear All would hide every series, which the chart refuses, and
             Select All is one more control than a legend has ever had. -->
        <template #footer />
      </MultiSelect>
    </div>

    <!-- The list is portalled out of the chart, so it would lay out in the
         page's direction. This holder carries the row's instead. -->
    <Teleport v-if="shown.length < items.length" :to="portalTarget ?? 'body'">
      <div ref="portalEl" :dir="dir" />
    </Teleport>

    <!-- Every entry and the trigger at their natural widths, so the fit is
         measured rather than guessed. After the row, so a search by text finds
         the real entry first. Clipped to nothing: left at full width it
         overflows the card, and the browser scrolls the card sideways to reach
         whatever takes focus. -->
    <div
      aria-hidden="true"
      inert
      class="invisible absolute h-0 w-0 overflow-hidden"
    >
      <div ref="rulerEl" class="flex w-max gap-x-1">
        <Button
          v-for="item in ranked"
          :key="item.name"
          variant="ghost"
          size="xs"
        >
          <ReuseEntry :item="item" />
        </Button>
        <!-- One trigger per digit count the hidden count can have: the
             digits are tabular, so the count's length is all that moves the
             width. -->
        <Button
          v-for="digits in String(items.length).length"
          :key="`more-${digits}`"
          variant="ghost"
          size="xs"
        >
          <span class="tabular-nums text-ink-gray-6">
            {{ moreText(Number('8'.repeat(digits))) }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import Button from '#components/Button/Button.vue'
import MultiSelect from '#components/MultiSelect/MultiSelect.vue'
import { usePortalTarget } from '#composables/usePortalTarget'
import { legendFit, rankLegendItems } from '../legendOverflow'
import type {
  ChartLegendEmits,
  ChartLegendItem,
  ChartLegendProps,
} from '../types'

// Past this many entries, finding one by reading the list is slower than typing.
const SEARCH_AFTER = 15

const props = defineProps<ChartLegendProps>()

const emit = defineEmits<ChartLegendEmits>()

const [DefineEntry, ReuseEntry] = createReusableTemplate<{
  item: ChartLegendItem
}>()

const ranked = computed(() => rankLegendItems(props.items))

const rowEl = ref<HTMLElement>()
const rulerEl = ref<HTMLElement>()
const fit = ref(props.items.length)

// A row that fits keeps the order the series are drawn in. Only an overflowing
// one trades that order for size.
const shown = computed(() =>
  fit.value < props.items.length
    ? ranked.value.slice(0, fit.value)
    : props.items,
)

function measure() {
  const row = rowEl.value
  const ruler = rulerEl.value
  if (!row || !ruler) return
  const widths = Array.from(
    ruler.children,
    (child) => child.getBoundingClientRect().width,
  )
  // The triggers follow the entries, one per digit count.
  const triggers = widths.splice(ranked.value.length)
  const gap = parseFloat(getComputedStyle(ruler).columnGap) || 0
  fit.value = legendFit(
    widths,
    row.getBoundingClientRect().width,
    (hidden) => triggers[String(hidden).length - 1] ?? 0,
    gap,
  )
  // The panel goes with its trigger. Left open, it would come back on its own
  // the next time the row overflows.
  if (fit.value >= props.items.length) open.value = false
}

// The row follows the card's width and the ruler follows the labels and the
// font, so either one changing can change the fit.
let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(() => measure())
  if (rowEl.value) observer.observe(rowEl.value)
  if (rulerEl.value) observer.observe(rulerEl.value)
  measure()
})
onBeforeUnmount(() => observer?.disconnect())
// A new ranking can leave the ruler's width alone and still reorder the widths
// within it.
watch(ranked, measure, { flush: 'post' })

const open = ref(false)
const query = ref('')
const dir = ref<string>()
const portalTarget = usePortalTarget()
const portalEl = ref<HTMLElement>()

const visible = computed(() =>
  props.items.filter((item) => !item.hidden).map((item) => item.name),
)

const options = computed(() => {
  const text = query.value.trim().toLowerCase()
  return ranked.value
    .filter((item) => !text || item.label.toLowerCase().includes(text))
    .map((item) => ({ ...item, value: item.name }))
})

// Each series whose checkbox moved is one `change`, the same press an entry on
// the row makes. The chart may refuse it, as it refuses hiding the last visible
// series, and then the model it hands back leaves the row checked.
function showOnly(names: Array<string | number>) {
  const next = new Set(names)
  for (const item of props.items) {
    if (next.has(item.name) === item.hidden) emit('change', item.name)
  }
}

// The query is bound, so the list never clears it on its own.
watch(open, (value) => {
  query.value = ''
  if (value && rowEl.value) dir.value = getComputedStyle(rowEl.value).direction
})

function moreText(count: number) {
  return `+${count} more`
}

// The visible text is the series label; the accessible name has to say what the
// press does, since the toggle state alone doesn't read as an action.
function toggleLabel(item: ChartLegendItem) {
  return `${item.hidden ? 'Show' : 'Hide'} ${item.label}`
}
</script>
