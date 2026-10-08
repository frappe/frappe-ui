<script setup lang="ts">
// The second dashboard (Figma 1GDS12ys41lxeG3wQpNq41, 1555:35858, "sales agent
// dashboard"): a CRM's home page for one agent, without the app's side menu.
// A 900 column: the greeting with "My reports" and "New" beside it, then a
// 560 column and a 320 one, 20 apart, each a stack of 12px-cornered cards
// 20 apart — tasks, follow-ups, the funnel and the forecast on the left;
// meetings, new leads, deals by stage, top open deals and the month's
// expected closure on the right. Every card is 16 in, its title 16 semibold
// over a 14 ink-gray-5 line. The charts take the theme the rail has picked
// (chartThemes' `crm*` roles, the file's Ocean steps, falling back to the
// rows above), so the page answers the Theme radios like every other one.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Avatar, Badge, Button, Dropdown, TabButtons } from '../../../src'
import { LineChart } from '../../../src/charts'
import ChartTip from '../components/ChartTip.vue'
import {
  CRM_FUNNEL_HEIGHTS,
  crmClosure,
  crmFollowUps,
  crmForecast,
  crmFunnel,
  crmMeetings,
  crmNewLeads,
  crmStages,
  crmTasks,
  crmTopDeals,
  type ForecastRange,
} from '../crmDashboard'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const money = (v: number) => `$${v.toLocaleString('en-IN')}`

// ---- the header's "New" menu
const newOptions = [
  { label: 'Lead', icon: 'lucide-users', onClick: () => {} },
  { label: 'Deal', icon: 'lucide-zap', onClick: () => {} },
  { label: 'Contact', icon: 'lucide-square-user', onClick: () => {} },
  { label: 'Task', icon: 'lucide-circle-check', onClick: () => {} },
]

/** the meetings' edges: the file's brown, blue, pink and teal */
const TONE: Record<string, string> = {
  orange: 'bg-amber-800',
  blue: 'bg-blue-600',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
}

// ---- deals by stage and the top deals
const stageColors = computed(() => props.theme.colors('crmStages', 4))
const stageTotal = crmStages.reduce((sum, s) => sum + s.share, 0)
const wash = computed(() => props.theme.one('crmWash'))
/**
 * The wash is the deep blue laid thin rather than a pale blue laid solid: on
 * white the two are the file's #dceef9, and in dark mode a pale fill would
 * light up behind white figures where a thin one stays a tint.
 */
const WASH_OPACITY = 0.17
const topValue = Math.max(...crmTopDeals.map((d) => d.value))
/**
 * The wash behind a value, as wide as its share of the largest: the file's
 * $1,25,000 runs 97 back from the card's edge, and the rest by their values.
 */
const washWidth = (value: number) => `${Math.round((value / topValue) * 97)}px`

// ---- the funnel: five steps, the file's own heights, one outline over them
const funnelColors = computed(() => props.theme.colors('crmFunnel', 5))
const edge = computed(() => funnelColors.value[funnelColors.value.length - 1])
const FUNNEL_PLOT = 158
const STEP_RADIUS = 6
const funnelEl = ref<HTMLElement>()
const funnelWidth = ref(528)
let funnelObserver: ResizeObserver | undefined
onMounted(() => {
  funnelObserver = new ResizeObserver(([entry]) => {
    funnelWidth.value = entry.contentRect.width
  })
  if (funnelEl.value) funnelObserver.observe(funnelEl.value)
})
onBeforeUnmount(() => funnelObserver?.disconnect())
const steps = computed(() => {
  const w = funnelWidth.value / crmFunnel.length
  return crmFunnel.map((s, i) => ({
    ...s,
    x: i * w,
    w,
    top: FUNNEL_PLOT * (1 - CRM_FUNNEL_HEIGHTS[i]),
  }))
})
/**
 * The outline the file runs over the steps: along each top, down each drop on
 * a 6px curve at either end, and on along the next — drawn in pixels, since a
 * stretched viewBox would flatten the curves.
 */
const outline = computed(() => {
  const r = STEP_RADIUS
  const s = steps.value
  let d = `M 0 ${s[0].top + 0.5}`
  s.forEach((step, i) => {
    const next = s[i + 1]
    const x = step.x + step.w
    if (!next) {
      d += ` L ${x} ${step.top + 0.5}`
      return
    }
    d += ` L ${x - r} ${step.top + 0.5}`
    d += ` Q ${x - 0.5} ${step.top + 0.5} ${x - 0.5} ${step.top + r}`
    d += ` L ${x - 0.5} ${next.top - r}`
    d += ` Q ${x - 0.5} ${next.top + 0.5} ${x + r} ${next.top + 0.5}`
  })
  return d
})

// ---- the forecast
const range = ref<ForecastRange>('6M')
const RANGES = [
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
]
/**
 * The file's axis is not even: $0, $25k, $50k, $100k and $150k stand on five
 * equally spaced lines. A reading is placed on that axis by where it falls
 * between the two lines around it, and the tooltip turns the place back into
 * dollars, so the lines sit where the file draws them and still read true.
 */
const TICKS = [0, 25, 50, 100, 150]
const place = (k: number) => {
  for (let i = 1; i < TICKS.length; i++)
    if (k <= TICKS[i])
      return i - 1 + (k - TICKS[i - 1]) / (TICKS[i] - TICKS[i - 1])
  return TICKS.length - 1
}
const unplace = (p: number) => {
  const i = Math.min(TICKS.length - 2, Math.floor(p))
  return TICKS[i] + (p - i) * (TICKS[i + 1] - TICKS[i])
}
const dollars = (p: number) =>
  `$${Math.round(unplace(p) * 1000).toLocaleString('en-US')}`
const forecastRows = computed(() =>
  crmForecast[range.value].map((row) => ({
    at: row.at,
    forecast: place(row.forecast),
    actual: place(row.actual),
  })),
)
const lines = computed(() => props.theme.colors('crmLines', 2))
/** a 1.5px line with a dot at its last reading only, as the file ends them */
const ended = computed(() => {
  const last = forecastRows.value.length - 1
  return {
    format: dollars,
    echartOptions: {
      lineStyle: { width: 1.5 },
      symbol: 'circle',
      showSymbol: true,
      symbolSize: (_v: unknown, p: { dataIndex: number }) =>
        p.dataIndex === last ? 6 : 0,
    },
  }
})
const forecastConfig = computed(() => ({
  forecast: { label: 'Forecast', ...ended.value },
  actual: { label: 'Actual', ...ended.value },
}))
const forecastY = {
  min: 0,
  max: 4,
  format: (p: number) => (p === 0 ? '$0' : `$${TICKS[Math.round(p)] ?? ''}k`),
  echartOptions: { interval: 1 },
}
/** a month's name at its first reading, nothing between */
const forecastX = {
  type: 'category' as const,
  format: (at: string) => at.split(' ')[0],
  echartOptions: {
    axisLabel: {
      interval: 0,
      hideOverlap: false,
      formatter: (at: string) => (at.endsWith(' 1') ? at.split(' ')[0] : ''),
    },
  },
}
const forecastOptions = computed(() => ({
  grid: { top: 12, left: 4, right: 8 },
  tooltip: {
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: props.theme.t('outline-gray-2'),
        width: 1,
        type: 'solid',
      },
    },
  },
}))

// ---- the month's closure
const progress = computed(() => props.theme.one('crmProgress'))
const closed = crmClosure.won / crmClosure.target
</script>

<template>
  <div class="crm-dashboard col-span-full">
    <!-- the greeting, and what the agent can start from here -->
    <header class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-3xl-semibold leading-tighter text-ink-gray-9">
          Good morning, Jayaprakash.
        </h2>
        <p class="mt-1.5 text-base text-ink-gray-7">
          Today you have
          <span class="font-semibold text-ink-gray-8">4 new leads</span>,
          <span class="font-semibold text-ink-gray-8">2 follow-ups</span> due
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          icon-left="lucide-chart-no-axes-column"
          label="My reports"
        />
        <Dropdown :options="newOptions" align="end">
          <template #trigger="{ open }">
            <Button
              variant="solid"
              icon-left="lucide-plus"
              :icon-right="open ? 'lucide-chevron-up' : 'lucide-chevron-down'"
              label="New"
            />
          </template>
        </Dropdown>
      </div>
    </header>

    <div class="crm-columns mt-[30px]">
      <!-- the left column -->
      <div class="crm-stack">
        <section class="crm-card">
          <h3 class="crm-title">Tasks</h3>
          <table class="crm-table mt-4">
            <thead>
              <tr>
                <th>Task</th>
                <th class="w-[88px]">Due</th>
                <th class="w-[124px]">Contact</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in crmTasks" :key="t.title" class="h-10">
                <td>
                  <span class="flex items-center gap-2.5">
                    <span
                      class="size-3.5 shrink-0 rounded-full border border-outline-gray-4"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-ink-gray-8">{{
                      t.title
                    }}</span>
                  </span>
                </td>
                <td :class="t.overdue ? 'text-ink-red-5' : 'text-ink-gray-8'">
                  {{ t.due }}
                </td>
                <td>
                  <span class="flex min-w-0 items-center gap-2">
                    <Avatar :image="t.avatar" :label="t.contact" size="sm" />
                    <span class="min-w-0 truncate text-ink-gray-7">{{
                      t.contact
                    }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="crm-card">
          <h3 class="crm-title">Follow up</h3>
          <p class="crm-sub">Prioritized follow-ups to act on.</p>
          <table class="crm-table mt-4">
            <thead>
              <tr>
                <th>Followup</th>
                <th class="w-[136px]">Organization</th>
                <th class="w-[80px] text-center">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in crmFollowUps" :key="f.title" class="h-[58px]">
                <td>
                  <div class="truncate text-ink-gray-8">{{ f.title }}</div>
                  <div class="mt-1 text-ink-gray-6">
                    Last updated : {{ f.updated }}
                  </div>
                </td>
                <td>
                  <span class="flex items-center gap-2">
                    <Avatar
                      :image="f.logo"
                      :label="f.org"
                      shape="square"
                      size="sm"
                    />
                    <span class="min-w-0 truncate text-ink-gray-8">{{
                      f.org
                    }}</span>
                  </span>
                </td>
                <td class="text-center">
                  <Badge
                    :label="f.type"
                    :theme="f.type === 'Lead' ? 'violet' : 'green'"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="crm-card !pb-0">
          <h3 class="crm-title">Funnel Conversion</h3>
          <p class="crm-sub">Visualize lead-to-deal progress.</p>
          <!-- the steps run 14 short of the card's right edge, not 16 -->
          <div ref="funnelEl" class="relative -mr-0.5 mt-[18px] h-[209px]">
            <!-- the stage names over their own steps, each ruled off from the
                 last on the line its step drops at, down to the plot -->
            <div class="absolute inset-0">
              <div
                v-for="(s, i) in steps"
                :key="s.stage"
                class="absolute inset-y-0 min-w-0"
                :class="i > 0 && 'border-l border-outline-gray-1 pl-3'"
                :style="{ left: `${s.x}px`, width: `${s.w}px` }"
              >
                <div class="truncate text-sm leading-tighter text-ink-gray-5">
                  {{ s.stage }}
                </div>
                <div class="mt-1 text-lg leading-tighter text-ink-gray-9">
                  {{ s.count }}
                </div>
              </div>
            </div>
            <svg
              class="absolute inset-x-0 bottom-0 overflow-visible"
              :width="funnelWidth"
              :height="FUNNEL_PLOT"
              role="img"
              aria-label="Funnel conversion"
            >
              <rect
                v-for="(s, i) in steps"
                :key="s.stage"
                :x="s.x"
                :y="s.top"
                :width="Math.max(0, s.w - (i < steps.length - 1 ? 1 : 0))"
                :height="FUNNEL_PLOT - s.top"
                :fill="funnelColors[i]"
              >
                <title>{{ s.stage }}: {{ s.count }}</title>
              </rect>
              <path :d="outline" fill="none" :stroke="edge" stroke-width="1" />
            </svg>
          </div>
        </section>

        <section class="crm-card">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="crm-title">Forecast vs Actual</h3>
              <p class="crm-sub">Compare projected vs actual sales.</p>
            </div>
            <TabButtons
              :model-value="range"
              :options="RANGES"
              @update:model-value="(v) => (range = v as ForecastRange)"
            />
          </div>
          <div class="crm-forecast mt-3 h-[238px]">
            <LineChart
              :data="forecastRows"
              x="at"
              :y="['forecast', 'actual']"
              :series-config="forecastConfig"
              :x-axis="forecastX"
              :y-axis="forecastY"
              :palette="lines"
              :echart-options="forecastOptions"
            >
              <template #tooltip="tip">
                <ChartTip
                  :label="tip.label"
                  :items="tip.items"
                  :rows="tip.rows"
                />
              </template>
            </LineChart>
          </div>
        </section>
      </div>

      <!-- the right column -->
      <div class="crm-stack">
        <section class="crm-card">
          <h3 class="crm-title">Today’s Meetings</h3>
          <p class="crm-sub">
            You have <span class="text-ink-gray-8">4</span> meetings today
          </p>
          <ul class="mt-4 flex flex-col gap-6">
            <li
              v-for="(m, i) in crmMeetings"
              :key="i"
              class="flex items-center gap-[7px]"
            >
              <span
                class="h-8 w-0.5 shrink-0 rounded-full"
                :class="TONE[m.tone]"
                aria-hidden="true"
              />
              <div class="min-w-0 flex-1">
                <div class="text-xs leading-tighter text-ink-gray-5">
                  {{ m.time }}
                </div>
                <div class="mt-0.5 truncate text-base text-ink-gray-8">
                  {{ m.title }}
                </div>
              </div>
              <span class="flex shrink-0 items-center">
                <Avatar
                  v-for="(p, j) in m.people"
                  :key="j"
                  :image="p"
                  size="sm"
                  class="ring-2 ring-surface-elevation-2"
                  :class="j > 0 && '-ml-1.5'"
                />
                <span
                  v-if="'count' in m && m.count"
                  class="-ml-1 flex size-5 items-center justify-center rounded-full bg-surface-gray-2 text-xs text-ink-gray-7"
                  >{{ m.count }}</span
                >
              </span>
            </li>
          </ul>
          <Button
            class="mt-4"
            variant="ghost"
            label="See Calendar"
            icon-right="lucide-arrow-right"
          />
        </section>

        <section class="crm-card">
          <h3 class="crm-title">New leads assigned</h3>
          <p class="crm-sub">
            You have <span class="text-ink-gray-8">4</span> new leads
          </p>
          <!-- each lead a row to open, lit on hover across the card's width
               less 8 a side, as a list row is -->
          <ul class="-mx-2 mt-2">
            <li v-for="l in crmNewLeads" :key="l.org">
              <button
                type="button"
                class="flex h-[52px] w-full items-center gap-2 rounded-[8px] px-2 text-start transition-colors hover:bg-surface-gray-2 focus-visible:focus-ring active:bg-surface-gray-3"
                :aria-label="`Open ${l.org}, ${l.person}`"
              >
                <Avatar
                  :image="l.logo"
                  :label="l.org"
                  shape="square"
                  size="md"
                />
                <div class="min-w-0 flex-1">
                  <div class="truncate text-base text-ink-gray-8">
                    {{ l.org }}
                  </div>
                  <div class="truncate text-base text-ink-gray-6">
                    {{ l.person }}
                  </div>
                </div>
                <span
                  class="lucide-chevron-right mr-1.5 size-4 shrink-0 text-ink-gray-8"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </section>

        <section class="crm-card">
          <h3 class="crm-title">Deals by stage</h3>
          <p class="crm-sub">See deal value by pipeline stage.</p>
          <div
            class="mt-4 flex h-2.5 gap-1"
            role="img"
            aria-label="Deals by stage"
          >
            <span
              v-for="(s, i) in crmStages"
              :key="s.stage"
              class="h-full rounded-full"
              :style="{
                flexGrow: s.share / stageTotal,
                flexBasis: 0,
                background: stageColors[i],
              }"
            />
          </div>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li
              v-for="(s, i) in crmStages"
              :key="s.stage"
              class="flex items-center gap-2"
            >
              <span
                class="size-1.5 shrink-0 rounded-full"
                :style="{ background: stageColors[i] }"
                aria-hidden="true"
              />
              <span class="text-base text-ink-gray-8">{{ s.stage }}</span>
              <span
                class="lucide-arrow-up-right size-3.5 text-ink-gray-6"
                aria-hidden="true"
              />
              <span class="ml-auto text-base text-ink-gray-8">{{
                money(s.value)
              }}</span>
            </li>
          </ul>
        </section>

        <section class="crm-card">
          <h3 class="crm-title">Top open deals</h3>
          <p class="crm-sub">See your biggest active deals by value.</p>
          <ul class="mt-4 flex flex-col gap-5">
            <li
              v-for="d in crmTopDeals"
              :key="d.org"
              class="flex items-center gap-2"
            >
              <Avatar :image="d.logo" :label="d.org" shape="square" size="sm" />
              <span class="text-base text-ink-gray-8">{{ d.org }}</span>
              <span
                class="lucide-arrow-up-right size-3.5 text-ink-gray-6"
                aria-hidden="true"
              />
              <span class="relative ml-auto flex h-5 items-center">
                <span
                  class="absolute inset-y-0 right-0"
                  :style="{
                    width: washWidth(d.value),
                    background: wash,
                    opacity: WASH_OPACITY,
                  }"
                  aria-hidden="true"
                />
                <span class="relative text-base text-ink-gray-9">{{
                  money(d.value)
                }}</span>
              </span>
            </li>
          </ul>
        </section>

        <section class="crm-card">
          <h3 class="crm-title">Expected closure this month</h3>
          <p class="crm-sub">Compare actual vs projected sales.</p>
          <div class="relative mt-[18px]">
            <div class="text-lg-semibold leading-tighter text-ink-gray-9">
              {{ money(crmClosure.won) }} / {{ money(crmClosure.target) }}
            </div>
            <div
              class="mt-3 h-4 overflow-hidden rounded-[4px] bg-surface-gray-2"
              role="progressbar"
              :aria-valuenow="crmClosure.won"
              :aria-valuemax="crmClosure.target"
            >
              <div
                class="h-full"
                :style="{ width: `${closed * 100}%`, background: progress }"
              />
            </div>
            <!-- where the month stands, through the amount and the bar -->
            <span
              class="crm-marker absolute -bottom-2 -top-2 w-px"
              :style="{ left: `${closed * 100}%` }"
              aria-hidden="true"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* the file's 900: a 560 column and a 320 one, 20 apart, centred; one column
   under that */
.crm-dashboard {
  width: 100%;
  max-width: 900px;
  justify-self: center;
}
.crm-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}
@container chart-stage (min-width: 900px) {
  .crm-columns {
    grid-template-columns: minmax(0, 560fr) minmax(0, 320fr);
  }
}
.crm-stack {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 20px;
}
.crm-card {
  @apply min-w-0 overflow-hidden rounded-[12px] border border-outline-gray-1 bg-surface-elevation-2 p-4;
}
.crm-title {
  @apply text-lg-semibold leading-tighter text-ink-gray-9;
}
.crm-sub {
  @apply mt-1.5 text-base text-ink-gray-5;
}

/* the tables: 13 ink-gray-5 heads, 14 rows on hairlines that run 6 past the
   card's padding on either side, as the file rules them */
.crm-table {
  width: calc(100% + 12px);
  margin-inline: -6px;
  table-layout: fixed;
  border-collapse: collapse;
  @apply text-base;
}
.crm-table th {
  @apply h-8 px-1.5 text-left text-sm font-normal text-ink-gray-5;
}
.crm-table td {
  @apply overflow-hidden border-t border-outline-gray-1 px-1.5;
}
/* the month's mark, in the ink the amount over it is set in */
.crm-marker {
  background: var(--ink-gray-8);
}

/* the forecast's legend: the file's round swatches, 14 ink-gray-7 names */
.crm-forecast :deep([data-slot='chart-legend'] button) {
  @apply text-base;
}
</style>
