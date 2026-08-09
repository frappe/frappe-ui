# ADR-0015 — What enters the chart family

**Status:** Accepted
**Date:** 2026-08-05

## Context

Insights is the first large consumer of `frappe-ui/charts`. An audit on
2026-08-05 compared `src/charts` against `insights/frontend/src2/charts`
(`helpers.ts`, `chart.ts`, `types/chart.types.ts`) and produced a gap list.

A gap list is not a work list. Insights supplies the cases. The conventions and
the rule in [charts.md](../charts.md) decide them. This ADR records how each
case was decided, so a later request for the same feature is answered from the
record instead of re-argued.

Insights stores every chart config in the database, one row per workbook chart.
A rename here becomes a data patch there. The names below were settled before
Insights migrated.

Insights then moved every one of its chart types onto v2, on 2026-08-09. Running
the family behind a real consumer produced a second, shorter list of five. Two
of them are about a seam an audit of two prop lists could not see — what it
costs an app to reach the chrome — and those belong to the plot-and-chrome
contract in [charts.md](../charts.md) rather than here. The other three are
decided below, by the same rule, and are marked as second-pass entries.

## Decision

### Enters

| Feature | Shape | Follows from |
| --- | --- | --- |
| Combo series | `seriesConfig[key].type: 'bar' \| 'line' \| 'area'` | Convention 4. One mechanism covers combo charts, per-series `show_area`, and the `LineChart` / `AreaChart` split. |
| Reference lines | `referenceLines` on axis charts | Convention 1. A target or a threshold is a statement about the data. |
| 100% stacked | `stacked: boolean \| 'normalized'` | Conventions 1 and 4. Reading a share instead of a total is a meaning. It extends `stacked` rather than adding a second boolean beside it. |
| Series cap | `maxSeries` | Conventions 3 and 4. A grouping column with 200 values produces an unreadable chart, and `maxSlices` already solves the same problem for the donut. |
| Scatter | `ScatterChart`, with an optional size measure | Convention 1. It is a way to read two measures against each other. With `referenceLines` it also covers Insights' quadrant lines, so no `show_quadrants` prop. |
| Sankey | `SankeyChart` | Convention 1. A flow between a source and a target is a reading of the data. |
| Numeric x axis | `xAxis.type: 'value'` | Convention 1. Reading a measure against a quantity — conversion against discount, revenue against distance — is a statement about the data, the same one `'time'` already makes about a date. It is a third reading of the x column the axis is typed with, not a prop beside it, and the caller still says only what the column means. |
| Series axis (2nd pass) | `seriesConfig[key].axis: 'y' \| 'y2'` | Convention 4. Which scale a series is measured against is per-series meaning, and `seriesConfig` is the one place per-series meaning lives. It replaces `y2`, which said the same thing in a second place and said it by moving the series — see Leaves. |
| Scatter point labels (2nd pass) | `showDataLabels` on `ScatterChart` | Convention 4. A donut prints `showInlineLabels` and an axis series prints `showDataLabels`, so a scatter that cannot name its points is the odd one out. It prints the `label` column: both measures are already on the axes. |
| `NumberCard` value color (2nd pass) | `color` on `NumberCardProps` | Consistency, against convention 2. See below. |

Reference lines have an internal rule that is not API: each line is hosted on
its own empty series, one per axis, so a legend toggle cannot remove the line
and a dual-axis chart puts each line on the right scale. Insights'
`getReferenceLineSeries` is the precedent.

`NumberCard`'s `color` is the closest call on either list. Convention 2 owns the
look, and the ink a number is printed in is decoration with no reading attached.
What admits it is that v2 already takes a caller's color wherever a mark carries
identity — `SeriesStyle.color`, `palette`, an explicit slice list,
`NumberCardSparkline.color` — and a KPI value is a mark. The card accepted a
color for the sparkline drawn under the reading and refused one for the reading
itself. It is one color for one mark: it does not restyle the card, and the
delta keeps the tone that says which way the number moved. The
`number_columns` ruling further down assumes it, too — an app laying out one
card per column has to be able to color each one.

### Solved without a prop

Convention 3 turns two requested options into library work.

- **X axis label angle.** Insights exposes `label_rotation`, clamped to 0–90
  degrees. The library measures text through `measureText.ts` and rotates or
  skips the labels when they do not fit. Every app gets legible axes and nobody
  sets an angle.
- **Small funnel stages.** Insights scales stage width by the square root of the
  value so small stages stay visible. The library enforces a minimum readable
  stage width instead. Same result, no scale menu, and the other stages keep
  their true proportion.

### Stays out

- **`overlap`** — bars sharing an x slot through `barGap: '-100%'`. Convention
  1: a renderer instruction. It goes through the per-series `echartOptions`
  merge.
- **Donut `legend_position`** — convention 2. Where the legend sits is the
  library's decision.
- **`hide_from_chart`** — a series that stays in the data and the tooltip, draws
  at zero opacity, and keeps its legend entry. Convention 4: the family already
  owns this concept as `v-model:hiddenSeries`. An app maps onto it or drops the
  behavior.
- **`comparison`** — Insights derives the delta from a date column. Convention
  5: the library takes a delta the caller computed.
- **Funnel measures mode** — Insights reads one row and treats each measure as a
  stage. Convention 5: that is a data shape, not a chart. The library takes the
  grouped shape, a label column and a value column per row. The caller reshapes.
- **`NumberCard` multiple values** — `number_columns` is an array with
  per-column prefix, suffix, decimals, shorten, and color. Convention 2: that is
  a layout. The app lays out the values and puts one `NumberCard` behind each,
  with `:card="false"`.
- **Table** — a pivot grid with row and column dimensions, totals, conditional
  formatting, sticky columns, column widths, and text wrap.
  `TableChartConfig` carries 12 keys. Nothing in it maps a value to a visual
  property, so it is not a plot. If frappe-ui ships it, it ships as a DataTable.
- **Map** — a choropleth over world or India GeoJSON, with Jenks natural-breaks
  classification into 5 buckets, a piecewise `visualMap`, and a region-name
  mapping table. A choropleth is a real chart. It stays out because it needs a
  geography layer the library does not own: an external GeoJSON, name resolution
  for unmatched regions, and a classification step. That is data cleaning, not
  rendering. If the library ever owns that layer, Map enters. The count of apps
  asking for it was never the reason.

### Leaves

- **`y2`** (2nd pass) — the column list naming what the second value axis
  measures. Convention 4: beside `seriesConfig[key].axis` it is a second
  spelling of one idea. It is not sugar over the first either, because the two
  can disagree — `y2` naming a column whose entry says `axis: 'y'` needs a
  precedence rule, and a shorthand that needs one is a mechanism. It also
  carried a side effect the per-series key does not. The series list was
  `[...y, ...y2]` and series colors are handed out along it, so a caller moving
  a column from `y` to `y2` moved it down the list and changed its color. v2 is
  in beta, Insights is the only consumer and is updated in the same cycle, so
  `y2` goes rather than staying on as a second way in. `y2Axis` stays: it
  configures the axis, and one axis is one thing.

### Not a gap: the adapter layer

Insights configs reference columns through `Dimension` and `Measure` objects,
and Insights pivots wide before it plots. Library props take plain row keys and
read long data through the `series` prop. Insights needs a mapping layer
whatever the library does, and convention 5 puts that layer in the app. Library
props are not shaped around a stored config format.

### Not a gap: already present

`horizontal` covers the Row chart. `stacked`, dual axis through `align`,
`series` grouping, `smooth`, `showDataPoints`, `showDataLabels`, `min`/`max`,
`maxSlices`, `showInlineLabels`, `sparkline`, `compact`, `precision`, and
`timeGrain` all exist, as do the heatmap, the empty and loading and error
states, theme-reactive palettes, HTML tooltips with slots, and typed events.

## Consequences

Three decisions fell out of the work and answer questions this record raised.

- **A reference line does not stretch the value axis.** A target far outside the
  data would flatten the data it is read against, so a line beyond the range is
  clipped. `yAxis.min` and `max` bring one into frame.
- **`maxSeries` has no default.** A ring cannot show 20 arcs, so `maxSlices`
  defaults. An axis chart with 20 series is legible enough that a default would
  silently redraw every existing long-data chart.
- **A long-data series can reach the second axis.** `y2` named columns, and long
  data has none to name — the series come out of a grouping column — so a
  grouped chart had no way to put one group on its own scale. Keying the axis by
  series identity gives it one, and drops a branch instead of adding a prop.
- **A numeric x axis is asked for, never inferred.** `'time'` is inferred
  because a column of dates is a column of dates. A column of numbers is as
  often a list of categories — quarters, store numbers, shirt sizes — so
  inferring the scale would re-space charts nobody touched. `horizontal` ignores
  the setting and says so in a dev-mode warning: it gives the x column the
  vertical axis, where a bar is sized from the slot it stands in.

One case is still open. **`show_scrollbar`** is a `dataZoom` slider. Insights
reflows the grid and the legend to make room, and the orientation follows the
Row chart. Panning a wide series is a reading of the data, so convention 1
admits it. Convention 2 is the open question, because the reflow moves chrome
the library owns.
