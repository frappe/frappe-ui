# Charts v2 public API

**Status:** implemented as of 2026-08-03, combo series added 2026-08-07. The
charts in `src/charts` take the flat props below, and the barrel exports the
surface listed here. This is the API reference.

Alternatives considered and rejected: composition (one child component per
series, Recharts-style), grammar-of-graphics channel bindings (Plot,
Vega-Lite), and a single config object (v1, ECharts-style). A chart here must
be one tag whose props are plain data — column names as strings, spreadable
from a saved object — which is the evidence.dev flavor.

## Conventions

- Props are flat. There is no `config` object. A saved or serialized config is
  spread with `v-bind="savedProps"`. Each chart exports its props type
  (`BarChartProps`, `DonutChartProps`, ...) as the single source of truth.
- Column props are plain strings, evidence.dev style: `x`, `y`, `series`,
  `category`, `value` name columns of `data`. Axis options live in the
  `xAxis` / `yAxis` / `y2Axis` objects. Per-series styling lives in
  `seriesConfig`.
- One vocabulary everywhere. The v1 `xColumn` / `categoryColumn` /
  `valueColumn` names are gone.
- Wide and long data both work. `y` with a list of columns reads wide data
  (one column per series). `series` names a column whose values split rows
  into series (long data). Components pivot long data to wide internally, so
  the option builders do not change.
- `seriesConfig` maps a series key — a `y` column name, or a value of the
  `series` column — to `{ label, color, ... }`, after shadcn's `ChartConfig`.
  It replaces the v1 `series[]` array and ends the name-doubles-as-key flaw:
  the map key is the identity, `label` is the display name.
- A series is drawn as its chart's own shape unless its `seriesConfig` entry
  names a `type`. `BarChart`, `LineChart` and `AreaChart` differ only in that
  default, so a combo chart is one tag whose series disagree — see below.
- Formatting is a function, not a format code: axis objects and part-to-whole
  charts take `format: (value: number) => string`.
- `palette` is the only color input: `'sequential' | 'categorical' |
  'diverging' | string[]`. The v1 `colors` alias is dropped.
- `echartOptions` stays as the deep-merge escape hatch, at the same four
  levels as v1: chart, x-axis, y-axis, series. Survey data shows all four
  levels are load-bearing in pilot, builder, helpdesk, central and press.

## Shared props

Every chart takes:

| Prop | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Card heading, rendered as Vue chrome |
| `subtitle` | `string` | |
| `dir` | `'ltr' \| 'rtl'` | Defaults to `document.documentElement.dir` |
| `loading` | `boolean` | |
| `error` | `string \| null` | |

Every echarts-backed chart (all except FunnelChart and NumberCard) also takes
`echartOptions` and exposes `{ chart }` (the echarts instance, typed).

## Axis charts: BarChart, LineChart, AreaChart

Wide data — one column per series:

```vue
<BarChart
  :data="rows"
  x="month"
  :y="['revenue', 'costs']"
  :series-config="{ costs: { label: 'Operating costs' } }"
  stacked
  title="Revenue vs costs"
/>
```

Long data — one row per point, a column splits rows into series:

```vue
<LineChart :data="tidyRows" x="month" y="amount" series="region" />
```

Combo — bars for the amounts, a line for the rate they imply, on the second
axis because the units differ:

```vue
<BarChart
  :data="rows"
  x="month"
  :y="['revenue', 'expenses']"
  y2="margin"
  :series-config="{ margin: { type: 'line', label: 'Gross margin' } }"
  :y2-axis="{ title: 'Margin', format: (v) => `${v}%` }"
/>
```

| Prop | Type | Charts | Notes |
| --- | --- | --- | --- |
| `data` | `Record<string, any>[]` | all | |
| `x` | `string` | all | Category or time column |
| `y` | `string \| string[]` | all | Value column(s). A list means wide data |
| `y2` | `string \| string[]` | all | Column(s) on the second value axis. Replaces v1's per-series `axis: 'y2'`. Ignored when `horizontal` |
| `series` | `string` | all | Grouping column (long data). Use with a single `y` |
| `seriesConfig` | `Record<string, SeriesStyle>` | all | Per-series label, color, style. See below |
| `xAxis` | `{ title?, type?, timeGrain?, format?, echartOptions? }` | all | `type` and `timeGrain` keep their v1 auto-detection |
| `yAxis`, `y2Axis` | `{ title?, min?, max?, format?, echartOptions? }` | all | |
| `palette` | `ChartPalette` | all | Default `'sequential'` |
| `stacked` | `boolean` | bar, area | |
| `horizontal` | `boolean` | bar | Category axis moves to Y |
| `connectNulls` | `boolean` | line, area | |
| `fillOpacity` | `number` | area | Chart-level default, `seriesConfig` can override |

`SeriesStyle` (all values optional — every series renders with defaults):

- Base: `{ type, label, color, showDataLabels, echartOptions }`
- Bar adds `stackName`
- Line adds `lineType`, `lineWidth`, `showDataPoints`, `smooth`
- Area adds `stackName`, `fillOpacity`

`type` is `'bar' | 'line' | 'area'` and decides which of those key sets the
entry carries, defaulting to the chart's own shape. The three per-chart unions
(`BarChartSeriesStyle`, `LineChartSeriesStyle`, `AreaChartSeriesStyle`) are what
the props take; the shape-specific styles above are their branches, and both
are exported.

What the mix decides, it decides over every series rather than the visible
ones, so a legend click never reflows the plot:

- any bar in the chart → the axis pointer is a shaded band and the category
  axis takes the half-slot inset; otherwise a rule, running edge to edge
- the data-label gutter is the widest any labelled series needs
- `stacked` sums each shape into a stack of its own — a band never lands on top
  of a column — and a line never stacks, since a stacked line reads as an area
- a line is drawn over the bars and bands it is read against, whatever order
  the series were declared in

Chart-level props stay on the chart that owns them: `stacked` and `horizontal`
on `BarChart`, `connectNulls` on the line family, `fillOpacity` on `AreaChart`.
A recast series reads the host chart's value and overrides it through its own
style keys or `echartOptions`.

Model, emits, slots:

- `v-model:hiddenSeries` — `string[]` of series keys (`y` columns, or values
  of the `series` column). Optional. When absent
  the legend manages visibility internally (uncontrolled), same pattern as
  list's `v-model:selection`.
- Emits `datapointClick` with `ChartDatapointEvent`.
- Slots: `#actions` (card header right), `#tooltip` (scoped, replaces tooltip
  body).
- Exposes `{ chart }`.

## DonutChart

```vue
<DonutChart :data="rows" category="status" value="count" variant="half" />
```

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `Record<string, any>[]` | |
| `category` | `string` | Row key for the slice name |
| `value` | `string` | Row key for the slice size |
| `maxSlices` | `number` | Default 9, rest sum into "Others" |
| `showInlineLabels` | `boolean` | |
| `centerLabel` | `string` | Defaults to the value key |
| `variant` | `'full' \| 'half'` | |
| `format` | `(value: number) => string` | Formats slice values in tooltip and center readout |
| `palette` | `ChartPalette` | Default `'categorical'` |

Emits `sliceClick` with `DonutSliceEvent`. Slots: `#actions`, `#tooltip`,
`#center` (scoped with the total readout). Exposes `{ chart }`.

## FunnelChart

Pure SVG, no echarts, no `echartOptions`.

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `Record<string, any>[]` | One row per stage, drawn in row order |
| `category` | `string` | Row key for the stage name |
| `value` | `string` | Row key for the stage count |
| `showPercentages` | `boolean` | Default on |
| `format` | `(value: number) => string` | Formats stage values |
| `palette` | `ChartPalette` | Default `'sequential'` reversed |

Emits `stageClick` with `FunnelStageEvent`. Slots: `#actions`, `#tooltip`
(scoped, also carries the hovered `FunnelStage`). Exposes nothing.

## HeatmapChart

```vue
<HeatmapChart :data="rows" x="hour" y="weekday" value="orders" />
```

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `Record<string, any>[]` | One row per cell |
| `x` | `string` | Row key for the column category |
| `y` | `string` | Row key for the row category |
| `value` | `string` | Row key for the magnitude |
| `min`, `max` | `number` | Color scale bounds, default from data |
| `showValues` | `boolean` | |
| `format` | `(value: number) => string` | Formats cell values and the ramp scale |
| `palette` | `'sequential' \| 'diverging' \| string[]` | No categorical: one measure, one ramp |

Emits `cellClick` with `HeatmapCellEvent`. Slots: `#actions`, `#tooltip`.
Exposes `{ chart }`.

## NumberCard

No echarts. The v1 `NumberChart` equivalent.

| Prop | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Required |
| `value` | `number \| string \| null` | Null renders the empty state. A string renders as given, formatting props do not apply |
| `prefix`, `suffix` | `string` | |
| `delta` | `number \| null` | Sign drives the arrow |
| `deltaSuffix` | `string` | e.g. `'%'` |
| `deltaCaption` | `string` | e.g. `'vs last month'` |
| `negativeIsBetter` | `boolean` | Flips delta colors |
| `precision` | `number` | Default: as the value carries, up to 2 |
| `compact` | `boolean` | `12300` -> `12.3K` |
| `sparkline` | `{ data, type?, color? }` | Stays one object: one cohesive sub-config, not chart identity |
| `loading` | `boolean` | |

Slots: `#actions`, `#caption` (under the delta, for period dropdowns).
Exposes nothing.

## Public barrel (`frappe-ui/charts`)

- Components: `BarChart`, `LineChart`, `AreaChart`, `DonutChart`,
  `FunnelChart`, `HeatmapChart`, `NumberCard`
- Props and event types: `*ChartProps`, `NumberCardProps`, `SeriesStyle` and
  the per-shape and per-chart series styles, `AxisSeriesType`, axis option
  types, `ChartDatapointEvent`, `DonutSliceEvent`, `FunnelStageEvent`,
  `HeatmapCellEvent`, `ChartPalette`
- Composables: `useChart`, `registerChartModules`
- Theme: `useChartTheme`, `resolveChartTheme`, `paletteColors`,
  `currentColorScheme`
- Format: `formatValue`, `formatAxisValue`, `formatDate`, `formatLabel`,
  `formatPercent`, `TimeGrain`

Everything else stops being exported: option builders, geometry helpers,
internal contexts, `ChartContainer` / `ChartLegend` / `ChartTooltip`,
sparkline and color math internals. Press-style "drive your own echarts
instance" use cases wait for the raw `ECharts` wrapper on the roadmap.

## Decisions

Settled 2026-08-03:

1. **Expose surface.** Trimmed to `{ chart }` on echarts-backed charts.
   FunnelChart and NumberCard expose nothing. Derived data (slices, stages,
   matrix) reaches userland through events and scoped slots only. This is the
   recorded decision [`imperative-api.md`](./imperative-api.md) §2.4 asks for
   before a component hands back a third-party object.
2. **`v-model:hiddenSeries`.** Axis charts only. Donut gets
   `v-model:hiddenSlices` later if asked.
3. **`series` with multiple `y`.** Long data expects one value column. When
   `series` and a `y` list both appear, dev-warn and read the first `y`
   column.
4. **NumberCard.** `value: number | string | null` — a string renders as
   given, formatting props do not apply. NumberCard also gains `error` for
   symmetry with the other charts.
5. **Heatmap duplicate cells.** Last-write-wins stays, with a dev-mode
   warning that names the colliding cell.
6. **Emit naming.** Per-shape names stay: `datapointClick`, `sliceClick`,
   `stageClick`, `cellClick`. The payloads differ for good reason.

Settled 2026-08-07 ([#941](https://github.com/frappe/frappe-ui/issues/941)):

7. **Combo lives in `seriesConfig`, not in a new component or prop.** `type`
   travels with the rest of a series' look, so a saved combo config is still
   one object spread into one tag — which is what a dashboard builder stores.
   A fourth `ComboChart` component would have had to re-declare every axis
   prop, and a parallel `seriesTypes` prop would have split one series'
   settings across two props keyed the same way.
8. **The tag keeps naming the chart.** Recasting is per series, so the
   component names the shape the rest of the series take rather than becoming
   a neutral `AxisChart` — v1's shape, rejected when v2 was designed. Any of
   the three can host the same combo; converting a saved v1 config picks the
   tag from the majority series and recasts the rest.
9. **Bars and lines are registered by all three axis charts.** A component can
   no longer register only what its own name draws, since `seriesConfig`
   decides that at runtime. The area shape adds nothing — it is the line
   module with a fill.
10. **Horizontal combo draws, `y2` still does not.** A recast line or band on a
    horizontal bar chart runs along the value axis and labels past its end.
    The second value axis stays out, unchanged: two value axes along the top
    and bottom of a plot are unreadable, whatever shape is drawn between them.
