# Charts v2 public API

**Status:** implemented as of 2026-08-03. The charts in `src/charts` take the
flat props below, and the barrel exports the surface listed here. This is the
API reference.

Alternatives considered and rejected: composition (one child component per
series, Recharts-style), grammar-of-graphics channel bindings (Plot, Vega-Lite),
and a single config object (v1, ECharts-style). A chart here must be one tag
whose props are plain data — column names as strings, spreadable from a saved
object — which is the evidence.dev flavor.

## Conventions

- Props are flat. There is no `config` object. A saved or serialized config is
  spread with `v-bind="savedProps"`. Each chart exports its props type
  (`BarChartProps`, `DonutChartProps`, ...) as the single source of truth.
- Column props are plain strings, evidence.dev style: `x`, `y`, `series`,
  `category`, `value` name columns of `data`. Axis options live in the `xAxis` /
  `yAxis` / `y2Axis` objects. Per-series styling lives in `seriesConfig`.
- One vocabulary everywhere. The v1 `xColumn` / `categoryColumn` / `valueColumn`
  names are gone.
- Wide and long data both work. `y` with a list of columns reads wide data (one
  column per series). `series` names a column whose values split rows into
  series (long data). Components pivot long data to wide internally, so the
  option builders do not change.
- `seriesConfig` maps a series key — a `y` column name, or a value of the
  `series` column — to `{ label, color, ... }`, after shadcn's `ChartConfig`. It
  replaces the v1 `series[]` array and ends the name-doubles-as-key flaw: the
  map key is the identity, `label` is the display name. It also carries the
  mark: `type: 'bar' | 'line' | 'area'` per series, which is what makes a combo
  chart and a per-series area fill the same feature.
- Formatting is a function, not a format code: axis objects and part-to-whole
  charts take `format: (value: number) => string`.
- `palette` is the only color input:
  `'sequential' | 'categorical' | 'diverging' | string[]`. The v1 `colors` alias
  is dropped.
- `echartOptions` stays as the deep-merge escape hatch, at the same four levels
  as v1: chart, x-axis, y-axis, series. Survey data shows all four levels are
  load-bearing in pilot, builder, helpdesk, central and press.

## Shared props

Every chart takes:

| Prop       | Type             | Notes                                      |
| ---------- | ---------------- | ------------------------------------------ |
| `title`    | `string`         | Card heading, rendered as Vue chrome       |
| `subtitle` | `string`         |                                            |
| `dir`      | `'ltr' \| 'rtl'` | Defaults to `document.documentElement.dir` |
| `loading`  | `boolean`        |                                            |
| `error`    | `string \| null` |                                            |

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

| Prop              | Type                                                     | Charts | Notes                                                                                                |
| ----------------- | -------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `data`            | `Record<string, any>[]`                                  | all    |                                                                                                      |
| `x`               | `string`                                                 | all    | Category or time column                                                                              |
| `y`               | `string \| string[]`                                     | all    | Value column(s). A list means wide data                                                              |
| `y2`              | `string \| string[]`                                     | all    | Column(s) on the second value axis. Replaces v1's per-series `axis: 'y2'`. Ignored when `horizontal` |
| `series`          | `string`                                                 | all    | Grouping column (long data). Use with a single `y`                                                   |
| `maxSeries`       | `number`                                                 | all    | Caps the series a `series` column produces; the rest sum into "Others". Uncapped by default          |
| `seriesConfig`    | `Record<string, SeriesStyle>`                            | all    | Per-series label, color, style. See below                                                            |
| `xAxis`           | `{ title?, type?, timeGrain?, format?, echartOptions? }` | all    | `type` and `timeGrain` keep their v1 auto-detection                                                  |
| `yAxis`, `y2Axis` | `{ title?, min?, max?, format?, echartOptions? }`        | all    |                                                                                                      |
| `palette`         | `ChartPalette`                                           | all    | Default `'sequential'`                                                                               |
| `stacked`         | `boolean \| 'normalized'`                                | all    | Read by the marks that stack: bars and areas. `'normalized'` is the 100% stacked reading             |
| `connectNulls`    | `boolean`                                                | all    | Read by line and area series                                                                         |
| `fillOpacity`     | `number`                                                 | all    | Chart-level default, `seriesConfig` can override. Read by area series                                |
| `referenceLines`  | `ReferenceLine[]`                                        | all    | Targets and thresholds drawn over the plot. See below                                                |
| `horizontal`      | `boolean`                                                | bar    | Category axis moves to Y. Bars only                                                                  |

`SeriesStyle` is one type for every chart (all values optional — every series
renders with defaults):

`{ label, color, type, showDataLabels, stackName, lineType, lineWidth, showDataPoints, smooth, fillOpacity, echartOptions }`

`type: 'bar' | 'line' | 'area'` is the mark that series draws as. It defaults to
the mark of the component the caller picked, which is the only thing `BarChart`,
`LineChart` and `AreaChart` disagree about — a `BarChart` with one `'line'`
series is a combo chart, and a `LineChart` series set to `'area'` is a
per-series fill. Keys the mark does not read are ignored rather than dropped, so
a saved style survives a change of `type`.

Reading rules, all consequences of one mechanism rather than props of their own:

- A mark stacks only with its own: bars with bars, areas with areas. A line
  never stacks. Two marks under one `stackName` stay in separate stacks.
- An area reads as a solid band only when it stacks onto another area. Otherwise
  it keeps the wash that fades towards the axis, so a fill never hides the bars
  behind it.
- Lines paint over areas, areas over bars, whatever order the series arrive in.
- `horizontal` draws bars. A series asking for another mark there is drawn as a
  bar, with a dev-mode warning; so is a `type` the library does not know.

`stacked: 'normalized'` reads each value as its share of the stack it sits in,
which is the 100% stacked chart. Consequences of the same mechanism:

- The share is taken per stack, not per x slot. Two stacks under different
  `stackName`s each reach 100 on their own, and a bar stack and an area stack
  are two wholes — sharing one denominator would leave neither column reaching
  the top, which is the one thing a 100% stack is read for. With the single
  stack most normalized charts have, the two readings are the same.
- The denominator is the sum of the magnitudes in that stack, so a column that
  mixes signs still spans exactly 100 from its lowest segment to its highest. A
  stack that sums to nothing draws nothing there.
- Only the value axes that carry a share are pinned to 0-100, and the pin
  overrules a `min` or `max` the caller set, with a dev-mode warning: a column
  that stops short of the top no longer reads as a whole. The ticks read as
  percentages, so a `yAxis.format` written for the measure does not print on
  them — it still prints the measure in the tooltip, which is why that one is
  not warned about.
- A series that stacks with nothing keeps its own numbers — a line always, a
  lone bar or band otherwise. Normalizing it against itself would read 100% at
  every x, which says nothing. It warns when the axis under it is pinned, and
  `axis: 'y2'` is the way off that scale.
- The rows are never rewritten. The plot draws the share; the tooltip,
  `datapointClick` and the legend keep reading the numbers the caller passed,
  and the tooltip prints the share beside the value.

`maxSeries` caps how many series the `series` column produces, the way
`maxSlices` caps a donut. Series past the cap are summed into one "Others"
series at each x. The cap keeps the series with the largest total magnitude
across every x and collapses the rest, but the survivors keep the order the data
put them in — the caller's sort survives it the way it survives the pivot — with
"Others" last, where a remainder reads in a stack and in the legend. It applies
to `series` only: a `y` list names its columns one by one, so a cap there would
silently drop a column the caller chose, and asking for one warns instead. The
collapsed series takes the reserved identity `__others__` so a group actually
named "Others" cannot collide with it; `seriesConfig.__others__` renames and
recolors it. The collapse runs in the data layer, before `stacked: 'normalized'`
takes any share, so the shares still add up to 100.

The category axis fits its own labels. It measures them against the width the
chart was drawn at and shows as much of each label as that width allows: nothing
happens while every label fits its slot; once one does not, the axis takes
whichever layout carries more text — flat and middle-truncated to the slot, or
tilted to 45°, which trades the slot for the depth below the axis. Wide slots
stay flat, crowded ones tilt, and the whole axis takes one layout. Whatever
still collides after that is thinned out, as before. `horizontal` never tilts:
its labels are already stacked one per line, so they are shortened to their
column. A time axis never tilts: it picks its own ticks and coarsens the
interval rather than crowd them.

There is no angle prop and no truncation length — convention 3 in
[charts-scope.md](charts-scope.md). Insights' `label_rotation` asks the caller
for a number that is only right at one width, on one dashboard, for one set of
labels; v2 has the width and measures the text (after the webfont settles, so
the measurement is the one the browser will lay out). A caller who has to fix a
readability problem is v2 admitting it failed. `xAxis.echartOptions` remains the
escape hatch for a chart that wants something else.

`ReferenceLine` is a rule drawn over the plot at a fixed position — a target, a
threshold, or the date something changed:

`{ value, axis?, label?, color?, dashed? }`

`axis` is `'y'` (the default) or `'y2'` for a rule across the plot at a measured
value, `'x'` for one down it at a category or a date. `'y2'` reads against the
primary axis on a chart that draws only one, exactly as a series does, and
`horizontal` swaps which chart axis each kind of line is pinned to. On the
scatter, whose two axes both measure, `'x'` is a number on the horizontal scale
rather than a category, and `'y2'` names an axis that does not exist there — it
reads as `'y'` with a dev-mode warning. `color`
defaults to the ink data labels are printed in, so a rule does not read as
another measure.

A reference line is an annotation, not a series: it has no legend entry, is not
in the tooltip, and cannot be switched off. Internally each targeted value axis
gets one empty, silent series to host that axis' `markLine` — a `markLine`
inherits its host's axis and legend visibility, so hosting one on a plotted
series would put the line on that series' scale and let a legend toggle take it
away. The host is built from `referenceLines` rather than `series`, which is
what keeps it out of the legend, out of `hiddenSeries`, and out of the bar
count. It draws as a mark the chart already registered with echarts — a line on
the axis charts, a point on the scatter — because echarts drops a series whose
type was never imported, and the lines with it.

A line outside the range the plot covers is not drawn. The value-axis scale
follows the data: stretching it to fit a distant target would flatten the data
the target is meant to be read against. Pin `yAxis.min` / `max` to bring one
into frame.

Model, emits, slots:

- `v-model:hiddenSeries` — `string[]` of series keys (`y` columns, or values of
  the `series` column). Optional. When absent the legend manages visibility
  internally (uncontrolled), same pattern as list's `v-model:selection`.
- Emits `datapointClick` with `ChartDatapointEvent`.
- Slots: `#actions` (card header right), `#tooltip` (scoped, replaces tooltip
  body).
- Exposes `{ chart }`.

## DonutChart

```vue
<DonutChart :data="rows" category="status" value="count" variant="half" />
```

| Prop               | Type                        | Notes                                              |
| ------------------ | --------------------------- | -------------------------------------------------- |
| `data`             | `Record<string, any>[]`     |                                                    |
| `category`         | `string`                    | Row key for the slice name                         |
| `value`            | `string`                    | Row key for the slice size                         |
| `maxSlices`        | `number`                    | Default 9, rest sum into "Others"                  |
| `showInlineLabels` | `boolean`                   |                                                    |
| `centerLabel`      | `string`                    | Defaults to the value key                          |
| `variant`          | `'full' \| 'half'`          |                                                    |
| `format`           | `(value: number) => string` | Formats slice values in tooltip and center readout |
| `palette`          | `ChartPalette`              | Default `'categorical'`                            |

Emits `sliceClick` with `DonutSliceEvent`. Slots: `#actions`, `#tooltip`,
`#center` (scoped with the total readout). Exposes `{ chart }`.

## FunnelChart

Pure SVG, no echarts, no `echartOptions`.

| Prop              | Type                        | Notes                                 |
| ----------------- | --------------------------- | ------------------------------------- |
| `data`            | `Record<string, any>[]`     | One row per stage, drawn in row order |
| `category`        | `string`                    | Row key for the stage name            |
| `value`           | `string`                    | Row key for the stage count           |
| `showPercentages` | `boolean`                   | Default on                            |
| `format`          | `(value: number) => string` | Formats stage values                  |
| `palette`         | `ChartPalette`              | Default `'sequential'` reversed       |

Emits `stageClick` with `FunnelStageEvent`. Slots: `#actions`, `#tooltip`
(scoped, also carries the hovered `FunnelStage`). Exposes nothing.

## HeatmapChart

```vue
<HeatmapChart :data="rows" x="hour" y="weekday" value="orders" />
```

| Prop         | Type                                      | Notes                                  |
| ------------ | ----------------------------------------- | -------------------------------------- |
| `data`       | `Record<string, any>[]`                   | One row per cell                       |
| `x`          | `string`                                  | Row key for the column category        |
| `y`          | `string`                                  | Row key for the row category           |
| `value`      | `string`                                  | Row key for the magnitude              |
| `min`, `max` | `number`                                  | Color scale bounds, default from data  |
| `showValues` | `boolean`                                 |                                        |
| `format`     | `(value: number) => string`               | Formats cell values and the ramp scale |
| `palette`    | `'sequential' \| 'diverging' \| string[]` | No categorical: one measure, one ramp  |

Emits `cellClick` with `HeatmapCellEvent`. Slots: `#actions`, `#tooltip`.
Exposes `{ chart }`.

## ScatterChart

```vue
<ScatterChart :data="rows" x="spend" y="revenue" size="seats" series="region" />
```

| Prop             | Type                                              | Notes                                                                                                                       |
| ---------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `data`           | `Record<string, any>[]`                           | One row per point                                                                                                           |
| `x`              | `string`                                          | Row key for the horizontal measure                                                                                          |
| `y`              | `string`                                          | Row key for the vertical measure                                                                                            |
| `size`           | `string`                                          | Row key for the magnitude each point is sized by                                                                            |
| `series`         | `string`                                          | Grouping column: one series per distinct value                                                                              |
| `label`          | `string`                                          | Row key for the point's own name, which heads its tooltip                                                                   |
| `xAxis`, `yAxis` | `{ title?, min?, max?, format?, echartOptions? }` | Both are value axes: a scatter has no category axis                                                                         |
| `palette`        | `ChartPalette`                                    | Default `'categorical'`                                                                                                     |
| `referenceLines` | `ReferenceLine[]`                                 | Targets, thresholds and quadrant dividers. Both axes measure, so `axis: 'x'` takes a number too. See above                  |
| `format`         | `(value: number) => string`                       | Prints every number the chart shows. The axis objects override it per axis; the size measure has no axis, so this prints it |

Both scales follow the data rather than anchoring to zero. A row whose `x` or
`y` does not read as a number has nowhere to sit, so it is dropped with a
dev-mode warning naming how many went. `size` maps linearly onto a 10–35px
diameter, over the whole plot rather than within a group; one distinct magnitude
draws every bubble at the middle of that range, because drawing them all at the
floor would claim they were the smallest there is.

Quadrant lines are `referenceLines`, not a prop of their own: one line per axis
divides the plot into four. Neither axis carries categories, so `axis: 'x'` is a
number on the horizontal scale, and `'y2'` — an axis a scatter does not draw —
reads as `'y'` with a dev-mode warning.

`v-model:hiddenSeries` — `string[]` of grouping values, same as the axis charts.
Emits `pointClick` with `ScatterPointEvent`. Slots: `#actions`, `#tooltip`.
Exposes `{ chart }`.

## SankeyChart

```vue
<SankeyChart :data="rows" source="from" target="to" value="users" />
```

| Prop        | Type                             | Notes                                                         |
| ----------- | -------------------------------- | ------------------------------------------------------------- |
| `data`      | `Record<string, any>[]`          | One row per link                                              |
| `source`    | `string`                         | Row key for the node a flow leaves                            |
| `target`    | `string`                         | Row key for the node a flow arrives at                        |
| `value`     | `string`                         | Row key for the size of the flow                              |
| `orient`    | `'horizontal' \| 'vertical'`     | Default `'horizontal'`                                        |
| `nodeAlign` | `'left' \| 'right' \| 'justify'` | Default `'justify'`                                           |
| `format`    | `(value: number) => string`      | Formats node labels and the tooltip                           |
| `palette`   | `ChartPalette`                   | Default `'categorical'`; a link takes its source node's color |

Nodes are the de-duplicated union of the `source` and `target` columns, in first
appearance order. A row whose target already flows into its source — a node
linked to itself included — has no column in the layout, so it is dropped with a
dev-mode warning.

Emits `linkClick` with `SankeyLinkEvent`. Slots: `#actions`, `#tooltip`. Exposes
`{ chart }`.

## NumberCard

No echarts. The v1 `NumberChart` equivalent.

| Prop               | Type                       | Notes                                                                                  |
| ------------------ | -------------------------- | -------------------------------------------------------------------------------------- |
| `title`            | `string`                   | Required                                                                               |
| `value`            | `number \| string \| null` | Null renders the empty state. A string renders as given, formatting props do not apply |
| `prefix`, `suffix` | `string`                   |                                                                                        |
| `delta`            | `number \| null`           | Sign drives the arrow                                                                  |
| `deltaSuffix`      | `string`                   | e.g. `'%'`                                                                             |
| `deltaCaption`     | `string`                   | e.g. `'vs last month'`                                                                 |
| `negativeIsBetter` | `boolean`                  | Flips delta colors                                                                     |
| `precision`        | `number`                   | Default: as the value carries, up to 2                                                 |
| `compact`          | `boolean`                  | `12300` -> `12.3K`                                                                     |
| `sparkline`        | `{ data, type?, color? }`  | Stays one object: one cohesive sub-config, not chart identity                          |
| `loading`          | `boolean`                  |                                                                                        |

Slots: `#actions`, `#caption` (under the delta, for period dropdowns). Exposes
nothing.

## Public barrel (`frappe-ui/charts`)

- Components: `BarChart`, `LineChart`, `AreaChart`, `DonutChart`, `FunnelChart`,
  `HeatmapChart`, `ScatterChart`, `SankeyChart`, `NumberCard`
- Props and event types: `*ChartProps`, `NumberCardProps`, `SeriesStyle`,
  `ChartMark`, axis option types, `ChartDatapointEvent`, `DonutSliceEvent`,
  `FunnelStageEvent`, `HeatmapCellEvent`, `ScatterPointEvent`,
  `SankeyLinkEvent`, `SankeyOrient`, `SankeyNodeAlign`, `ChartPalette`
- Composables: `useChart`, `registerChartModules`
- Theme: `useChartTheme`, `resolveChartTheme`, `paletteColors`,
  `currentColorScheme`
- Format: `formatValue`, `formatAxisValue`, `formatDate`, `formatLabel`,
  `formatPercent`, `TimeGrain`

Everything else stops being exported: option builders, geometry helpers,
internal contexts, `ChartContainer` / `ChartLegend` / `ChartTooltip`, sparkline
and color math internals. Press-style "drive your own echarts instance" use
cases wait for the raw `ECharts` wrapper on the roadmap.

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
   `series` and a `y` list both appear, dev-warn and read the first `y` column.
4. **NumberCard.** `value: number | string | null` — a string renders as given,
   formatting props do not apply. NumberCard also gains `error` for symmetry
   with the other charts.
5. **Heatmap duplicate cells.** Last-write-wins stays, with a dev-mode warning
   that names the colliding cell.
6. **Emit naming.** Per-shape names stay: `datapointClick`, `sliceClick`,
   `stageClick`, `cellClick`. The payloads differ for good reason.

Settled 2026-08-07:

7. **Combo series.** `seriesConfig[key].type` names the mark. One `SeriesStyle`
   carries the keys of all three marks rather than a type per chart: a series
   that can draw as anything needs the union anyway, and a bar chart is exactly
   a line chart with a different default. The three components and their props
   types stay, as does one option builder behind them — `BarChartProps` differs
   from `LineChartProps` by `horizontal` alone.
8. **No second fill flag.** A per-series area fill is `type: 'area'`, not a
   `showArea` boolean beside it. Convention 4: v2 already has the concept.
