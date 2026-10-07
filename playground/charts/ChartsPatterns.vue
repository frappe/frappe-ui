<script setup lang="ts">
// Figma: espresso-2.0 › Patterns › Desktop - 20 (35795:203360) — the
// Charts page. In the stage: the 20px semibold title 33 in from the left
// and 43 down, then 24 under it a two-column grid of cards 17 apart
// across and 18 down. The file draws the grid 911 wide because its frame
// is; here it takes the width the rail leaves it, two equal columns of it,
// one below the rail's breakpoint — a card never carries a width of its
// own, so every card the page grows from here falls into the same columns.
// Down the right, 48 past the cards and 66 from the top, the "Charts type"
// rail: a 14px semibold heading, then 19 under it
// a hairline list of 14px rows 26 apart, the one in hand carrying a 24px
// ink-gray-7 segment of the line. 41 under the list, "Theme", and 18
// under that the file's padded radio group: Ocean, Qualitative,
// Diverging, Mist, Earthy.
//
// The cards are the Frappe Charts file's (Figma 1GDS12ys41lxeG3wQpNq41,
// "Charts - ocean blue" and its theme frames): each row of the rail is
// one of its sections, drawn by the library's charts in the theme the
// radio group has picked. The theme is a set of the file's colour
// variables (chartThemes.ts) resolved off the page (useChartTokens.ts),
// so the dark mode is the file's dark column of the same variables.
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import { Radio, RadioGroup } from '../../src'
import { CHART_THEMES, type ChartTheme } from './chartThemes'
import { useChartTheme } from './useChartTheme'
import BarSection from './sections/BarSection.vue'
import SparklineSection from './sections/SparklineSection.vue'
import AreaSection from './sections/AreaSection.vue'
import ScatterSection from './sections/ScatterSection.vue'
import HeatmapSection from './sections/HeatmapSection.vue'
import LineSection from './sections/LineSection.vue'
import FunnelSection from './sections/FunnelSection.vue'
import AnnotationSection from './sections/AnnotationSection.vue'
import PieSection from './sections/PieSection.vue'

type ChartType =
  | 'bar'
  | 'sparkline'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'line'
  | 'funnel'
  | 'annotation'
  | 'pie'

/** the rail's rows, in the file's order and words */
const CHART_TYPES: Array<{
  id: ChartType
  label: string
  section: Component
  props?: Record<string, unknown>
  /** the section draws its cards at the file's own 580×360 */
  figmaSize?: boolean
  /**
   * The section is a row of the file's small 223 cards (the sparklines). The
   * section lays itself on their columns, so the row stands in the middle of
   * the stage and its title starts over the first card.
   */
  smallCards?: boolean
}> = [
  { id: 'bar', label: 'Bar charts', section: BarSection, figmaSize: true },
  {
    id: 'sparkline',
    label: 'Spark line charts',
    section: SparklineSection,
    smallCards: true,
  },
  { id: 'area', label: 'Area Charts', section: AreaSection },
  { id: 'scatter', label: 'Scatter plot', section: ScatterSection },
  {
    id: 'bubble',
    label: 'Bubble chart',
    section: ScatterSection,
    props: { bubbles: true },
  },
  { id: 'heatmap', label: 'Heat map', section: HeatmapSection },
  { id: 'line', label: 'Line chart', section: LineSection },
  { id: 'funnel', label: 'Funnel chart', section: FunnelSection },
  { id: 'annotation', label: 'Annotation', section: AnnotationSection },
  { id: 'pie', label: 'Pie charts', section: PieSection },
]

/** the section in view, which the rail marks */
const type = ref<ChartType>('bar')
const themeId = ref<ChartTheme>('ocean')
const theme = useChartTheme(themeId)

/**
 * One page of every kind, in the rail's order, rather than one kind at a time:
 * the reader scrolls from the bar charts into the sparklines and on down, and
 * the rail follows — the row marked is the section whose heading has passed
 * the top of the page — and takes them back to any of them.
 *
 * The page scrolls inside the playground's stage rather than the window, so
 * the scroller is found from the page itself.
 */
const stage = ref<HTMLElement>()
const sectionEls = new Map<ChartType, HTMLElement>()
const setSection = (id: ChartType) => (el: unknown) => {
  if (el instanceof HTMLElement) sectionEls.set(id, el)
  else sectionEls.delete(id)
}
let scroller: HTMLElement | null = null
/** a section is the one being read once its heading is this far up the view */
const READING_LINE = 120
/** while a click carries the page to a section, the rail keeps that one */
let arriving: ChartType | null = null
let arriveTimer: ReturnType<typeof setTimeout> | undefined

function scrollerOf(el: HTMLElement | null): HTMLElement | null {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const { overflowY } = getComputedStyle(n)
    // asked of the box, not of what it holds yet: at mount the charts may
    // not have drawn, and the page's scroller is not yet taller than its view
    if (/(auto|scroll)/.test(overflowY)) return n
  }
  return null
}

function follow() {
  if (!scroller) return
  if (arriving) {
    type.value = arriving
    return
  }
  const top = scroller.getBoundingClientRect().top
  const atFoot =
    scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
  let inView: ChartType = CHART_TYPES[0].id
  for (const t of CHART_TYPES) {
    const el = sectionEls.get(t.id)
    if (el && el.getBoundingClientRect().top - top <= READING_LINE)
      inView = t.id
  }
  // the last sections are shorter than the view, so their headings may never
  // reach the line: at the foot of the page, the last one is the one in view
  type.value = atFoot ? CHART_TYPES[CHART_TYPES.length - 1].id : inView
}

let frame = 0
const onScroll = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(follow)
}

function go(id: ChartType) {
  const el = sectionEls.get(id)
  if (!el) return
  type.value = id
  arriving = id
  clearTimeout(arriveTimer)
  // `scrollend` closes the trip where it is supported; the timer covers the
  // rest, and a trip that ends early (the page's foot) still lets go
  arriveTimer = setTimeout(() => (arriving = null), 900)
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const onScrollEnd = () => {
  if (!arriving) return
  arriving = null
  clearTimeout(arriveTimer)
  follow()
}

onMounted(() => {
  scroller = scrollerOf(stage.value ?? null)
  scroller?.addEventListener('scroll', onScroll, { passive: true })
  scroller?.addEventListener('scrollend', onScrollEnd)
  follow()
})
onBeforeUnmount(() => {
  scroller?.removeEventListener('scroll', onScroll)
  scroller?.removeEventListener('scrollend', onScrollEnd)
  cancelAnimationFrame(frame)
  clearTimeout(arriveTimer)
})
</script>

<template>
  <div class="flex min-h-full bg-surface-base">
    <!-- the page: title, then the grid. Beside the rail it pads both sides
         alike, 81 between them as before, so the cards stand in the middle
         of it at the same width they had. -->
    <div
      ref="stage"
      class="chart-stage flex min-w-0 flex-1 flex-col pb-12 pl-[33px] pr-[33px] pt-[43px] lg:px-[40.5px]"
    >
      <h1 class="sr-only">Charts</h1>
      <!-- every kind, one after another, each under its own name — the file's
           title, 20 semibold with its grid 24 under it — and 48 between one
           section's last card and the next one's name. A section stops 43
           short of the top when the rail takes the page to it, where the page
           opens its first. -->
      <section
        v-for="(t, i) in CHART_TYPES"
        :id="`charts-${t.id}`"
        :key="t.id"
        :ref="setSection(t.id)"
        class="scroll-mt-[43px]"
        :class="[
          i > 0 && 'mt-12',
          t.figmaSize && 'self-center',
          t.smallCards && 'small-cards',
        ]"
        :aria-labelledby="`charts-${t.id}-title`"
      >
        <h2
          :id="`charts-${t.id}-title`"
          class="text-3xl-semibold leading-tighter text-ink-gray-9"
        >
          {{ t.label }}
        </h2>
        <div
          :key="themeId"
          :data-chart-theme="themeId"
          class="chart-grid mt-6"
          :class="{ 'chart-grid--figma': t.figmaSize }"
        >
          <component
            :is="t.section"
            :theme="theme"
            :theme-id="themeId"
            v-bind="t.props"
          />
        </div>
      </section>
    </div>

    <!-- the rail: the kinds of chart, then the palette. It stays put while
         the cards scroll under it, as the other pages' outline does — that
         one stands outside the stage's scroller; this one is inside it, so
         it sticks to the top instead. It holds 16 off the window's edge, or a
         hovered row's background runs into it; the width stays 180, so the
         stage, and every card, keeps its size. -->
    <aside
      class="sticky top-0 hidden h-fit w-[180px] shrink-0 self-start pr-4 pt-[66px] lg:block"
    >
      <h2
        id="chart-types"
        class="text-base-semibold leading-tighter text-ink-gray-9"
      >
        Charts type
      </h2>
      <!-- the page's contents: each row takes the page to its section, and the
           one being read carries the line's segment -->
      <nav aria-labelledby="chart-types">
        <ul
          class="mt-[19px] flex flex-col gap-0.5 border-l border-outline-gray-1 py-1"
        >
          <li v-for="t in CHART_TYPES" :key="t.id" class="-ml-px">
            <a
              :href="`#charts-${t.id}`"
              class="block w-full border-l py-1 pl-4 text-start text-base leading-tighter transition-colors"
              :class="
                type === t.id
                  ? 'border-[color:var(--ink-gray-7)] text-ink-gray-9'
                  : 'border-transparent text-ink-gray-8 hover:text-ink-gray-9'
              "
              :aria-current="type === t.id ? 'location' : undefined"
              @click.prevent="go(t.id)"
            >
              {{ t.label }}
            </a>
          </li>
        </ul>
      </nav>

      <h2 class="mt-[45px] text-base-semibold leading-tighter text-ink-gray-9">
        Theme
      </h2>
      <RadioGroup
        v-model="themeId"
        class="theme-radios mt-[18px]"
        size="sm"
        padded
        orientation="vertical"
        aria-label="Theme"
      >
        <Radio
          v-for="t in CHART_THEMES"
          :key="t.id"
          :value="t.id"
          :label="t.label"
        />
      </RadioGroup>
    </aside>
  </div>
</template>

<style scoped>
/* The stage measures itself, so the grid folds on the width it actually has.
   The window's width is the wrong question here: the playground's own nav
   takes 300 of it before the page starts, and the rail another 228. */
.chart-stage {
  container-type: inline-size;
  container-name: chart-stage;
}

/* Every card sits in this grid and carries no width of its own: two equal
   columns the file's 17 apart, rows 18 apart, and one column when the stage
   is too narrow to hold two cards worth reading. A card that wants the whole
   row asks for it with `col-span-full`, which follows the count. */
.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: 17px;
  row-gap: 18px;
}
@container chart-stage (min-width: 700px) {
  .chart-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* A section drawn at the file's own card size: 580 wide, and 360 tall by the
   card's 580/360 ratio, so it reads 1:1 against the frame. Two of them and the
   file's 17 between need 1177 of stage; under that the grid holds one, and
   under 580 the card gives way rather than overflow. Written after the rules
   above so it wins over the fluid columns. The grid stands in the middle of
   the stage, and its section shrinks to it (`self-center`), so the title
   still starts over the first card. */
.chart-grid--figma {
  grid-template-columns: minmax(0, 580px);
  justify-content: center;
}
@container chart-stage (min-width: 1177px) {
  .chart-grid--figma {
    grid-template-columns: repeat(2, 580px);
  }
}

/* A section of the file's 223 cards takes their columns itself, as many as
   the stage holds and in its middle, and its title and grid span them all: the
   cards' own grid (SparklineSection) then gets exactly that many columns' width
   and the title starts over the first card. */
.small-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 223px));
  justify-content: center;
  column-gap: 17px;
}
.small-cards > * {
  grid-column: 1 / -1;
}

/* the file's radio rows are 2px apart; the group lays its padded rows flush */
.theme-radios :deep([role='radiogroup']) {
  gap: 2px;
}
</style>

<style>
/* The library's chart tooltip, as the file draws it: an 8px corner under
   the file's three shadows, 12px type. Global, since the tooltip is
   teleported to the body. */
[data-slot='chart-tooltip'] {
  border-radius: 8px;
  box-shadow:
    0 6px 12px -2px rgba(0, 0, 0, 0.12),
    0 0 6px 2px rgba(0, 0, 0, 0.03),
    0 0 1.5px rgba(0, 0, 0, 0.15);
}
/* And a tone above the card it floats over. The library paints its tooltip
   in the card's own surface (elevation-2), which in dark mode is the same
   grey as the card and leaves the box to its shadow alone; elevation-3 is
   that surface one step up, and in light both are white. The map's tooltip
   took this step first. `body` outranks the library's utility class. */
body [data-slot='chart-tooltip'] {
  background-color: var(--surface-elevation-3);
}
/* The file's own tooltip box, where a card draws the file's tooltip body
   (ChartTip): 135 wide on one row with the padding tight to the left of the
   dot, 8 around once the rows carry swatches. The shell is the library's —
   it is teleported to the body, so these are not scoped. */
[data-slot='chart-tooltip']:has([data-tip='figma']) {
  min-width: 135px;
  padding: 5px 8px 5px 3px;
}
[data-slot='chart-tooltip']:has([data-tip='figma'][data-rows='many']) {
  padding: 8px 8px 8px 4px;
}
/* The same box around rows that carry no mark — the scatter cards' two
   measures — which the file draws 160 wide with an even 8 all round
   (1356:67734, 1356:67835). */
[data-slot='chart-tooltip']:has([data-tip='measures']) {
  min-width: 160px;
  padding: 8px;
}
/* And the four-step line card's, which the file draws wider still and names
   no month on: 180 across, an even 8 all round, its four rows 4 apart
   (1356:68437 is 180×92 against the two-line card's 135×62). */
[data-slot='chart-tooltip']:has([data-tip='steps']) {
  min-width: 180px;
  padding: 8px;
}
</style>
