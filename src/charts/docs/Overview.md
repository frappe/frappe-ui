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

Each component registers only the echarts modules it can draw. A donut costs a
donut; the three axis charts share the bar and line modules, because any of them
draws any mark.

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

## Custom charts

A chart has two layers. The plot is echarts inside a box. The chrome is
everything around it: the card surface, the title block, the legend, the
tooltip, and the three states. The library owns the chrome and exports it, so a
plot you draw yourself reads like a built-in chart on the same dashboard.

Draw the plot with `useChart`. It creates the echarts instance once the
container has a size and the fonts settle, follows resizes, and disposes the
instance on unmount. Call `registerChartModules` with the echarts modules your
plot needs — nothing is registered for you.

Wrap the plot in `ChartContainer` for the title, the value-axis labels and the
states. Put `ChartLegend` in its `legend` slot, and `ChartTooltip` beside the
plot for the same HTML tooltip the built-in charts draw. `ChartCard` draws the
card surface. Read the colors off `useChartTheme`, so the plot follows a theme
switch with the rest of the page.

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
  registerChartModules,
  useChart,
} from 'frappe-ui/charts'

registerChartModules([RadarChart, RadarComponent])

const plotEl = ref<HTMLElement>()
const hidden = ref<string[]>([])

// Your own option builder and your own legend rows.
const option = computed(() => radarOption(plans, hidden.value))
const legendItems = computed(() => legendRows(plans, hidden.value))

useChart({ container: plotEl, option: () => option.value })
</script>

<template>
  <ChartCard class="h-96">
    <ChartContainer title="Plan satisfaction" :loading="loading" :error="error">
      <div ref="plotEl" class="h-full w-full" />
      <template #legend>
        <ChartLegend :items="legendItems" @toggle="toggleSeries" />
      </template>
    </ChartContainer>
  </ChartCard>
</template>
```

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

`ChartCard` takes `card`, and so does `NumberCard`. Set it to `false` for a
chart the app has already placed inside a card of its own: the content renders
with no border, background, radius or padding, and one bordered box stops
nesting in another.
