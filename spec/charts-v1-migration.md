# Migrating charts v1 to v2 — instructions for an agent

frappe-ui will remove the v1 chart exports. They still ship today, so an app can move on
its own schedule. This guide converts an app from v1 to v2.

Work through the steps in order. Do not skip step 1. Stop and ask a human whenever a
**STOP** rule applies.

## STOP rules

A **STOP** means the conversion needs a decision this guide cannot make. Report the file
and the rule. Do not guess past it.

Each rule below says what removes it. A rule marked **permanent** never goes away. Do not
try to solve a permanent rule inside frappe-ui.

| Rule | Step | Removed by |
| --- | --- | --- |
| The config comes from stored data | 2 | **Permanent.** The v1 shape is a schema in the consumer app's database. Only that app can patch its rows. |
| `series[].type` values are mixed | 3 | A combo chart in v2. |
| `NumberChart` uses `deltaPrefix` | 6 | A `deltaPrefix` prop on `NumberCard`. |
| The call site fills a v1 `NumberChart` slot | 6 | v2 slots that cover `body`, `title`, `subtitle`, and `delta`. |
| `FunnelChart` passes `echartOptions` | 7 | Nothing planned. v2 draws the funnel as SVG and carries no echarts. |

Only the first rule is known to apply to any app inside the frappe organization. The rest
guard against call sites this guide has not seen.

An `ECharts` option that draws a type v2 does not ship is not a **STOP**. Move it to
`useChart` as step 7 shows, then flag it in the report.

## What changed at the top level

1. The import path moved. v1 came from `frappe-ui`. v2 comes from `frappe-ui/charts`.
2. v2 needs a stylesheet. Import `frappe-ui/charts-style.css` once, in the app entry.
3. v1 took one `config` object. v2 takes flat props.
4. v1 forced a minimum size of 300x300 pixels. v2 fills its parent. A v2 chart in a
   parent with no height renders at zero height and shows no error.
5. v1 drew the title and subtitle inside the canvas. v2 renders them as HTML above the
   plot. The prop names did not change.

## Step 1 — find every call site

Run this from the app root. Match on the import, not on the tag name, because apps define
local components with the same names.

```bash
grep -rIl --include='*.vue' --include='*.ts' --include='*.js' --exclude-dir=node_modules -E "AxisChart|DonutChart|NumberChart|FunnelChart|ECharts|useAxisChartOptions" . | xargs grep -l "frappe-ui"
```

Read each file that the command returns. Confirm the symbol arrives in an
`import ... from 'frappe-ui'` clause. Imports span several lines. Discard any file where
the name is a local component.

## Step 2 — check for a stored config

**STOP** if the `config` value comes from an API response, a database record, or a prop
that a parent fills from stored data.

A stored config means the v1 shape is a persisted schema. The rows in the database need a
patch, and this guide cannot see them. Report the file and ask a human.

Signs of a stored config: `:config="item.data"`, `:config="props.chartConfig"`, or a
component registered by name for a page builder.

## Step 3 — pick the v2 component

Read `config.series` and read the `type` of every entry.

| `series[].type` values | v2 component |
| --- | --- |
| all `'bar'` | `BarChart` |
| all `'line'` | `LineChart` |
| all `'area'` | `AreaChart` |
| mixed | **STOP** |

`swapXY: true` on a bar chart maps to `horizontal` on `BarChart`.

Map the other components directly.

| v1 | v2 |
| --- | --- |
| `DonutChart` | `DonutChart` |
| `NumberChart` | `NumberCard` |
| `FunnelChart` | `FunnelChart` |
| `ECharts` | see step 7 |
| `useAxisChartOptions` | see step 7 |

## Step 4 — convert an axis chart

The `series` array becomes the `y` prop plus a `seriesConfig` record. Each entry's `name`
is a data key, so it moves into `y`. Everything else about that entry moves into
`seriesConfig` under the same key.

Before:

```vue
<AxisChart
  :config="{
    data: rows,
    title: 'Signups',
    subtitle: 'Last 30 days',
    colors: ['#2490ef'],
    xAxis: { key: 'date', type: 'time', timeGrain: 'day', title: 'Day' },
    yAxis: { title: 'Count', yMin: 0 },
    stacked: true,
    series: [
      { name: 'paid', type: 'bar', color: '#2490ef' },
      { name: 'free', type: 'bar', showDataLabels: true },
    ],
  }"
/>
```

After:

```vue
<BarChart
  :data="rows"
  title="Signups"
  subtitle="Last 30 days"
  x="date"
  :y="['paid', 'free']"
  :x-axis="{ type: 'time', timeGrain: 'day', title: 'Day' }"
  :y-axis="{ title: 'Count', min: 0 }"
  stacked
  :series-config="{
    paid: { color: '#2490ef' },
    free: { showDataLabels: true },
  }"
/>
```

Key by key:

| v1 | v2 |
| --- | --- |
| `data` | `data` |
| `title`, `subtitle`, `dir` | unchanged |
| `colors: string[]` | `palette` |
| `xAxis.key` | `x` |
| `xAxis.type`, `xAxis.timeGrain`, `xAxis.title` | `xAxis.*`, unchanged |
| `yAxis.yMin` / `yAxis.yMax` | `yAxis.min` / `yAxis.max` |
| `y2Axis.yMin` / `y2Axis.yMax` | `y2Axis.min` / `y2Axis.max` |
| `swapXY` | `horizontal`, on `BarChart` only |
| `stacked` | `stacked`, on `BarChart` and `AreaChart` |
| `series[].name` | an entry in `y` |
| `series[].name` where `axis: 'y2'` | an entry in `y2`, not `y` |
| `series[].color` | `seriesConfig[name].color` |
| `series[].showDataLabels` | `seriesConfig[name].showDataLabels` |
| `series[].lineType`, `lineWidth`, `showDataPoints` | `seriesConfig[name].*`, unchanged |
| `series[].stackName` | `seriesConfig[name].stackName` |
| `series[].fillOpacity` | `seriesConfig[name].fillOpacity` |
| `series[].echartOptions` | `seriesConfig[name].echartOptions` |
| `xAxis.echartOptions`, `yAxis.echartOptions`, `echartOptions` | unchanged |

Three behavior changes to apply by hand:

1. `showDataLabels` no longer turns on visible line points. Add
   `seriesConfig[name].showDataPoints` if the chart had points before.
2. `LineChart` and `AreaChart` default `connectNulls` to `false`. v1 always joined across
   gaps. Add `connectNulls` to keep the old line.
3. `yAxis.title` is HTML now. An `echartOptions.name` override on an axis does nothing.

## Step 5 — convert a donut chart

| v1 | v2 |
| --- | --- |
| `categoryColumn` | `category` |
| `valueColumn` | `value` |
| `maxSliceCount` | `maxSlices` |
| `colors` | `palette` |
| `showInlineLabels`, `echartOptions` | unchanged |

## Step 6 — convert a number chart

| v1 | v2 (`NumberCard`) |
| --- | --- |
| `title`, `value`, `prefix`, `suffix` | unchanged |
| `delta`, `deltaSuffix`, `negativeIsBetter` | unchanged |
| `deltaPrefix` | **STOP** — no equivalent |

Two behavior changes to apply by hand:

1. v1 always shortened the value. v2 prints full precision. Add `compact` to keep the old
   reading. Use `precision` to set decimal places.
2. v1 had `body`, `title`, `subtitle`, and `delta` slots. v2 has `actions`, `empty`, and
   `caption`. **STOP** if the call site fills a v1 slot.

v2 ships its own card chrome. v1 was an unstyled block. Remove any border, padding, or
background the call site added around a `NumberChart`.

## Step 7 — convert an escape hatch

### `<ECharts :options>`

Read the options object. If it draws a bar, line, area, pie, or funnel, rewrite it as the
matching v2 component. Move cosmetic keys such as `barWidth`, `itemStyle`, `label`, and
`emphasis` into `seriesConfig[name].echartOptions`. v2 deep-merges them.

If it draws a type v2 does not ship, use `useChart`.

### `useAxisChartOptions`

v2 does not export an option builder. Rewrite the call site as a v2 component. Reach for
`useChart` only when the code needs the echarts instance.

### `useChart`

`useChart` gives a raw echarts instance with v2 theming, sizing, and resize handling.

```ts
import { useChart, registerChartModules } from 'frappe-ui/charts'
import { BarChart } from 'echarts/charts'
import { GridComponent, DataZoomComponent } from 'echarts/components'

registerChartModules([BarChart, GridComponent, DataZoomComponent])

const container = ref<HTMLElement>()
const { chart, dispatch, width } = useChart({
  container,
  option: () => buildOption(props.data),
  events: { datazoom: onZoom },
  onZrEvents: { mousemove: onMove },
})
```

v2 does not register every echarts module. Call `registerChartModules` with the pieces the
option needs, or echarts draws nothing.

### The instance from a v2 component

Every chart component exposes its echarts instance. Use a template ref when the call site
needs the instance but the chart is otherwise a plain v2 chart.

```vue
<BarChart ref="chartRef" :data="rows" x="date" y="count" />
```

```ts
const chartRef = ref<{ chart: ECharts | undefined }>()
```

**STOP** if the call site uses `FunnelChart` with `echartOptions`. v2 draws the funnel as
SVG. It carries no echarts and takes no override.

## Step 8 — convert events

v1 had no `events` prop. It passed the attribute through to the inner `ECharts` component.
v2 emits a typed event. The name and the payload differ per component.

| Component | Event | Payload |
| --- | --- | --- |
| `BarChart`, `LineChart`, `AreaChart` | `@datapoint-click` | `ChartDatapointEvent` |
| `DonutChart` | `@slice-click` | `DonutSliceEvent` |
| `FunnelChart` | `@stage-click` | `FunnelStageEvent` |
| `HeatmapChart` | `@cell-click` | `HeatmapCellEvent` |

```vue
<BarChart @datapoint-click="onClick" />
```

The payload is typed, not a raw echarts click payload. Read the fields the handler uses
and remap them.

## Step 9 — fix the size

v2 charts have no intrinsic size. Give every chart a parent with a height.

```vue
<div class="h-64 w-full">
  <BarChart ... />
</div>
```

Check each converted call site. A chart inside a flex or grid child with no explicit
height is the common failure. It renders empty and logs nothing.

## Step 10 — verify

1. Run the app build. A missed v1 import still compiles while the v1 exports ship, so
   search the app again with the step 1 command instead of trusting the build.
2. Open each page that holds a converted chart. Confirm the chart draws and has a height.
3. Compare against the old chart for number formatting. Step 6 change 1 is the change
   most often missed.

## Report

List the files you changed. List every **STOP** you hit, with the file and the reason.
Do not guess past a **STOP**.

Also list every chart you moved to `useChart`. Each one is a candidate for a real v2
component.
