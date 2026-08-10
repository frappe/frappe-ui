# Charts

Nine chart components under the `frappe-ui/charts` subpath, drawn with
[echarts](https://echarts.apache.org). Props are flat and name the columns of
your data — `x`, `y`, `series`, `category`, `value` — so a saved or serialized
chart is one typed object spread with `v-bind="savedChart"`.

```js
import { BarChart, LineChart } from 'frappe-ui/charts'
```

The subpath carries the `--chart-*` color tokens with it. See
[Chart Colors](/docs/foundations/colors/charts) for the three ramps and how to
rebrand them. `palette` picks a ramp by name — `categorical`, `sequential` or
`diverging` — or takes an explicit list of colors.

An echarts-backed component registers only the modules it can draw. A donut
costs a donut; the three axis charts share the bar and line modules, because any
of them draws any mark. `FunnelChart` and `NumberCard` use no echarts at all —
both draw their own SVG — so they add nothing to the bundle.

## Data shapes

The axis charts read either shape of the same data. Wide data keeps one column
per series, so `y` lists the columns to draw. Long data keeps one row per point,
so `y` names the single value column and `series` names the column that splits
the rows apart. Pick whichever shape your query already returns.

## Marks

`BarChart`, `LineChart` and `AreaChart` are one chart with three defaults.
`seriesConfig[key].type` sets what a single series draws as — `'bar'`, `'line'`
or `'area'` — and the rest follow the component you picked. That is what a combo
chart is, and it is also how one line of a `LineChart` gets a fill.

## The charts

- [BarChart](/docs/charts/barchart) — grouped, stacked and horizontal bars
- [LineChart](/docs/charts/linechart) — trends, a second value axis, gaps
- [AreaChart](/docs/charts/areachart) — the line family with a fill
- [DonutChart](/docs/charts/donutchart) — share of a total
- [FunnelChart](/docs/charts/funnelchart) — stage-to-stage drop-off
- [HeatmapChart](/docs/charts/heatmapchart) — magnitude across two dimensions
- [ScatterChart](/docs/charts/scatterchart) — two measures against each other
- [SankeyChart](/docs/charts/sankeychart) — flow from a source to a target
- [NumberCard](/docs/charts/numbercard) — one reading, with its change

Every chart shares the same
[loading, error and empty states](/docs/charts/states), and they compose into a
[dashboard](/docs/charts/dashboard) without extra chrome.

## The chrome

The pieces every chart is built from. Compose them yourself for a plot the
library does not draw — see [Custom charts](#custom-charts).

- [ChartCard](/docs/charts/chartcard) — the card surface
- [ChartContainer](/docs/charts/chartcontainer) — title block, axis titles, states
- [ChartLegend](/docs/charts/chartlegend) — the row of series names
- [ChartTooltip](/docs/charts/charttooltip) — the reading beside the pointer

## Custom charts

A chart has two layers. The plot is echarts inside a box. The chrome is
everything around it: the card surface, the title block, the legend, the
tooltip, and the three states. The library owns the chrome and exports it, so a
plot you draw yourself reads like a built-in chart on the same dashboard.

Draw the plot with `useChart`. It creates the echarts instance once the
container has a size and the fonts settle, follows resizes, and disposes the
instance on unmount. Call `registerChartModules` with the echarts modules your
plot needs — nothing is registered for you.

Wrap the plot in [`ChartContainer`](/docs/charts/chartcontainer) for the title,
the value-axis labels and the states. Put
[`ChartLegend`](/docs/charts/chartlegend) in its `legend` slot, and
[`ChartTooltip`](/docs/charts/charttooltip) beside the plot for the same HTML
tooltip the built-in charts draw. [`ChartCard`](/docs/charts/chartcard) draws
the card surface.

Take the plot-area colors from `useChartTokens`. It takes the element the plot
draws into and hands back `tokens` that re-resolve when the theme flips, so
the axes and the series follow a theme switch with the rest of the page.

The three states are slots — `#loading`, `#error` and `#empty` — on the
container and on every built-in chart alike, so a retry button beside a failed
query costs a slot rather than a chart of your own. See
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

`ChartCard` takes `card`, and so does `NumberCard`. Set it to `false` for a
chart the app has already placed inside a card of its own: the content renders
with no border, background, radius or padding, and one bordered box stops
nesting in another.

## Utilities

The subpath exports three helpers beside the components. A built-in chart calls
all three for you; a plot you draw yourself calls them itself.

### `useChartTokens`

```ts
function useChartTokens(el: Ref<HTMLElement | undefined>): {
  tokens: ComputedRef<ChartTokens>
}
```

The plot-area colors, resolved against the element you pass. Read the `--chart-*`
tokens off that element rather than the document, so a plot inside a dark panel
on a light page takes the panel's colors. Pass the element the plot draws into.

`tokens` re-resolve when the page theme flips, so a `computed` option built from
it rebuilds and `setOption` runs again with the new values. It carries the three
ramps — `categorical`, `sequential` and `diverging` — and the inks the chrome
draws in: `axisLabel`, `axisTitle`, `axisLine`, `splitLine`, `dataLabel`,
`insideLabel` and `cellGap`.

Color a chart's own series through the `palette` prop instead. `useChartTokens`
is for a plot the library does not draw.

### `paletteColors`

```ts
function paletteColors(
  name: ChartPaletteName,
  tokens: ChartTokens,
  count: number,
): string[]
```

`count` colors off one named ramp, the same way a built-in chart picks its
series colors. `'categorical'` cycles the ramp, so eleven series reuse the first
hue. `'sequential'` and `'diverging'` spread the count over the ramp instead,
because a stop only means something against the stops beside it — three series
take three spaced stops, not the first three.

### `OTHERS_KEY`

The series identity a cap collapses its tail into: `maxSeries` on an axis chart,
`maxSlices` on a donut. It is reserved, so a group whose name really is "Others"
cannot collide with it, and stable, so `seriesConfig[OTHERS_KEY]` renames or
recolors the bucket like any other series. `OTHERS_LABEL` is the name it reads
as until a `label` overrides it.
