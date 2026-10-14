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

      <Popover
        v-if="shown.length < items.length"
        v-model:open="open"
        side="top"
        align="end"
      >
        <template #trigger>
          <Button
            variant="ghost"
            size="xs"
            :label="`Show ${items.length - shown.length} more series`"
          >
            <span class="text-ink-gray-6">
              {{ moreText(items.length - shown.length) }}
            </span>
          </Button>
        </template>
        <!-- The panel is portalled out of the chart, so it takes the
             direction the row was laid out in rather than the body's. -->
        <div
          data-slot="chart-legend-list"
          :dir="dir"
          class="flex max-h-80 w-72 flex-col gap-1 p-1.5"
        >
          <TextInput
            v-if="items.length > SEARCH_AFTER"
            v-model="query"
            size="sm"
            placeholder="Search series"
            aria-label="Search series"
          >
            <template #prefix>
              <span
                aria-hidden="true"
                class="lucide-search size-4 text-ink-gray-5"
              />
            </template>
          </TextInput>
          <div class="min-h-0 overflow-y-auto">
            <Button
              v-for="item in matches"
              :key="item.name"
              variant="ghost"
              size="sm"
              class="w-full"
              :aria-pressed="!item.hidden"
              :label="toggleLabel(item)"
              @click="emit('change', item.name)"
              @mouseenter="emit('highlight', item.name)"
              @mouseleave="emit('highlight', null)"
              @focus="emit('highlight', item.name)"
              @blur="emit('highlight', null)"
            >
              <template #prefix>
                <span
                  class="size-2 shrink-0 rounded-full"
                  :class="{ 'opacity-30': item.hidden }"
                  :style="{ backgroundColor: item.color }"
                />
              </template>
              <span
                :class="item.hidden ? 'text-ink-gray-4' : 'text-ink-gray-7'"
              >
                {{ item.label }}
              </span>
              <!-- The auto margin takes the slack, so the label holds the
                   start and the value the end. -->
              <template #suffix>
                <span
                  v-if="item.formattedValue"
                  class="ms-auto tabular-nums text-ink-gray-5"
                >
                  {{ item.formattedValue }}
                </span>
              </template>
            </Button>
            <p
              v-if="!matches.length"
              class="px-2 py-1.5 text-p-sm text-ink-gray-5"
            >
              No series match
            </p>
          </div>
        </div>
      </Popover>
    </div>

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
        <Button variant="ghost" size="xs">
          <span class="text-ink-gray-6">{{ moreText(items.length) }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import Button from '#components/Button/Button.vue'
import Popover from '#components/Popover/Popover.vue'
import TextInput from '#components/TextInput/TextInput.vue'
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
  const more = widths.pop() ?? 0
  const gap = parseFloat(getComputedStyle(ruler).columnGap) || 0
  fit.value = legendFit(widths, row.getBoundingClientRect().width, more, gap)
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

const matches = computed(() => {
  const text = query.value.trim().toLowerCase()
  return text
    ? ranked.value.filter((item) => item.label.toLowerCase().includes(text))
    : ranked.value
})

watch(open, (value) => {
  if (value) {
    dir.value = rowEl.value
      ? getComputedStyle(rowEl.value).direction
      : undefined
    return
  }
  query.value = ''
  // The rows unmount with the panel, so the one under the pointer or with
  // focus never reports leaving.
  emit('highlight', null)
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
