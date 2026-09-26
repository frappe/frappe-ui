# Charts

Ten chart components in the `frappe-ui/charts` subpath, most of them drawn with
[echarts](https://echarts.apache.org). Props are flat and name the columns of
your data (`x`, `y`, `y2`, `splitBy`, `category`, `value`), so you can save a
chart as one typed object and render it with `v-bind="savedChart"`.

```js
import { BarChart, LineChart } from 'frappe-ui/charts'
```

Importing the subpath also loads the `--chart-*` color tokens. See
[Chart colors](/docs/charts/colors) for the three ramps and how to change them.
The `palette` prop picks a ramp by name (`categorical`, `sequential` or
`diverging`) or takes a list of colors.

Each echarts chart registers only the echarts modules it needs, so importing
`DonutChart` loads only the pie module. The three axis charts share the bar and
line modules, because each of them can draw bars and lines. `FunnelChart`,
`NumberCard` and `ProportionBar` do not use echarts. The first two draw their
own SVG; the bar is a row of divs.

## Data shapes

The axis charts read either shape of the same data. Wide data keeps one column
per series, so `y` lists the columns to draw. Long data keeps one row per point,
so `y` names the single value column and `splitBy` names the column that splits
the rows apart. Pick whichever shape your query already returns.

## Marks

`BarChart`, `LineChart` and `AreaChart` are one chart with three defaults.
`seriesConfig[key].type` sets how one series draws (`'bar'`, `'line'` or
`'area'`), and the other series use the default of the component you picked. Use
it for a combo chart, or to fill one line of a `LineChart`.

## The charts

| Chart                                       | Use it for                            |
| ------------------------------------------- | ------------------------------------- |
| [BarChart](/docs/charts/barchart)           | Grouped, stacked and horizontal bars  |
| [LineChart](/docs/charts/linechart)         | Trends, a second value axis, gaps     |
| [AreaChart](/docs/charts/areachart)         | Lines with a fill                     |
| [DonutChart](/docs/charts/donutchart)       | Share of a total                      |
| [FunnelChart](/docs/charts/funnelchart)     | Drop-off from stage to stage          |
| [HeatmapChart](/docs/charts/heatmapchart)   | Size of a value across two dimensions |
| [ScatterChart](/docs/charts/scatterchart)   | Two measures against each other       |
| [SankeyChart](/docs/charts/sankeychart)     | Flow from a source to a target        |
| [NumberCard](/docs/charts/numbercard)       | One number and its change             |
| [ProportionBar](/docs/charts/proportionbar) | A breakdown as one bar                |

Every chart has the same [loading, error and empty states](/docs/charts/states).
Charts sit together in a [dashboard](/docs/charts/dashboard) with no extra
wrappers.

## Card, container, legend and tooltip

Every chart is built from these parts. Use them yourself to draw a chart the
library does not have. See [Custom charts](#custom-charts).

| Component                                     | What it draws                            |
| --------------------------------------------- | ---------------------------------------- |
| [ChartCard](/docs/charts/chartcard)           | The card: border, background and padding |
| [ChartContainer](/docs/charts/chartcontainer) | Title, axis titles and the three states  |
| [ChartLegend](/docs/charts/chartlegend)       | The row of series names                  |
| [ChartTooltip](/docs/charts/charttooltip)     | The values beside the pointer            |

## Custom charts

A chart has two layers. The plot is echarts inside a box. Around it are the
card, the title, the legend, the tooltip and the three states. The library
exports these parts, so a plot you draw yourself looks like a built-in chart on
the same dashboard.

Draw the plot with `useChart`. It creates the echarts instance once the
container has a size and the fonts have loaded, resizes it with the container,
and disposes it on unmount. Call `registerChartModules` with the echarts modules
your plot needs. `useChart` registers none for you.

Wrap the plot in [`ChartContainer`](/docs/charts/chartcontainer) for the title,
the value-axis labels and the states. Put
[`ChartLegend`](/docs/charts/chartlegend) in its `legend` slot, and
[`ChartTooltip`](/docs/charts/charttooltip) beside the plot for the same HTML
tooltip the built-in charts draw. [`ChartCard`](/docs/charts/chartcard) draws
the card.

Get the plot colors from `useChartTokens`. Pass it the element the plot draws
into. It returns `tokens`, which update when the theme changes, so the axes and
series switch theme with the rest of the page.

The three states are slots (`#loading`, `#error` and `#empty`) on the container
and on every built-in chart. To add a retry button to a failed query, fill the
`#error` slot; you do not need a custom chart. See
[States](/docs/charts/states).

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { RadarChart } from 'echarts/charts'
import { RadarComponent } from 'echarts/components'
import {
  ChartCard,
  ChartContainer,
  ChartLegend,
  paletteColors,
  registerChartModules,
  useChart,
  useChartTokens,
} from 'frappe-ui/charts'

registerChartModules([RadarChart, RadarComponent])

const plotEl = ref<HTMLElement>()
// The plot element, so the colors resolve against the theme it is drawn under.
const { tokens } = useChartTokens(plotEl)

const hidden = ref<string[]>([])
const colors = computed(() =>
  paletteColors('categorical', tokens.value, plans.length),
)

// Your own option builder and your own legend rows. `tokens` carries the axis,
// grid and label colors; `colors` carries one per series.
const option = computed(() => radarOption(plans, colors.value, tokens.value))
const legendItems = computed(() =>
  plans.map((plan, index) => ({
    name: plan.name,
    label: plan.name,
    color: colors.value[index],
    hidden: hidden.value.includes(plan.name),
  })),
)

useChart({ container: plotEl, option: () => option.value })

function toggleSeries(name: string) {
  hidden.value = hidden.value.includes(name)
    ? hidden.value.filter((plan) => plan !== name)
    : [...hidden.value, name]
}
</script>

<template>
  <ChartCard class="h-96">
    <ChartContainer title="Plan satisfaction" :loading="loading" :error="error">
      <div ref="plotEl" class="h-full w-full" />
      <template #legend>
        <ChartLegend :items="legendItems" @change="toggleSeries" />
      </template>
    </ChartContainer>
  </ChartCard>
</template>
```

`plans`, `radarOption`, `loading` and `error` are your own: the rows to draw,
the option builder over them, and the state of the query that fetched them.

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

`ChartCard` and `NumberCard` both take a `card` prop. Set it to `false` when the
chart is already inside a card of your own. The content then renders with no
border, background, radius or padding, so you do not get a box inside a box.

## Passing raw echarts options

`echartOptions` is deep-merged into the option the props build. Objects merge
key by key, and arrays replace. So `series: [...]` at chart level replaces all
generated series, including their data and colors. To change one series on an
axis chart, use `echartOptions` inside `seriesConfig` for that series.

An `animationDuration` set here applies to the first draw only. Every later draw
is instant.

## The echarts instance

Every echarts-backed chart hands back its instance as `chart` on a template ref.
`FunnelChart`, `NumberCard` and `ProportionBar` draw no echarts plot and hand
back nothing.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BarChart, type ChartExposed } from 'frappe-ui/charts'

const plot = ref<ChartExposed>()

function downloadPng() {
  const url = plot.value?.chart?.getDataURL({ type: 'png', pixelRatio: 2 })
  if (url) window.open(url)
}
</script>

<template>
  <BarChart ref="plot" :data="rows" x="month" y="sales">
    <template #actions>
      <Button label="Download" @click="downloadPng" />
    </template>
  </BarChart>
</template>
```

Use it when you need an echarts method that no option can express, such as an
image for a download button or chart coordinates for your own overlay.

It has three limits:

- The instance is `undefined` until the plot has a size and the fonts have
  loaded. Watch it instead of reading it once in `onMounted`.
- Changes made through the instance do not last. On every reactive change the
  component rebuilds the whole option and calls `setOption` with
  `notMerge: true`. The next prop, data or theme change drops any highlight or
  selection you dispatched, and any `setOption` you called. Use the instance for
  one-time reads and actions, and keep state in props.
- `ECharts` is the echarts type, not a frappe-ui type. A major echarts upgrade
  can change it in a frappe-ui minor release. frappe-ui only promises that
  `chart` exists and holds the live instance.

## Utilities

The subpath also exports three helpers. Built-in charts use them internally.
Call them yourself when you draw your own plot.

### `useChartTokens`

```ts
function useChartTokens(el: Ref<HTMLElement | undefined>): {
  tokens: ComputedRef<ChartTokens>
}
```

Returns the plot colors, read from the `--chart-*` tokens on the element you
pass. Pass the element the plot draws into. Because the tokens come from that
element and not the document, a plot inside a dark panel on a light page gets
the panel's colors.

`tokens` updates when the page theme changes, so a `computed` option built from
it rebuilds and `setOption` runs again with the new colors. It holds the three
ramps (`categorical`, `sequential` and `diverging`) and the colors for axes,
grid and labels: `axisLabel`, `axisTitle`, `axisLine`, `gridline`, `dataLabel`,
`insideLabel` and `backdrop`.

To color the series of a built-in chart, use the `palette` prop instead.
`useChartTokens` is for a plot you draw yourself.

### `paletteColors`

```ts
function paletteColors(
  palette: ChartPalette | undefined,
  tokens: ChartTokens,
  count: number,
  fallback?: ChartPaletteName,
): string[]
```

Returns `count` colors from a palette. Built-in charts use it to pick their
series colors. `palette` takes the same values as the `palette` prop: a ramp
name, a list of colors, or `undefined`. When it is `undefined`, `fallback` names
the ramp to use (`'sequential'` by default).

A list is used in order and repeats from the start when it runs out.
`'categorical'` also repeats, so an eleventh series reuses the first color.
`'sequential'` and `'diverging'` spread the colors evenly over the ramp instead,
because a step on these ramps only has meaning next to the steps around it.
Three series get three evenly spaced colors, not the first three.

### `OTHERS_KEY`

The key of the series that collects the extra series when you set a limit:
`maxSeries` on an axis chart, `maxSlices` on a donut. It is a reserved key, so a
group that is really named "Others" does not clash with it. Use
`seriesConfig[OTHERS_KEY]` to rename or recolor it like any other series. Its
label is "Others" unless you set a `label`.
