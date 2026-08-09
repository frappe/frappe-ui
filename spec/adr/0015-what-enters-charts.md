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

Reference lines have an internal rule that is not API: each line is hosted on
its own empty series, one per axis, so a legend toggle cannot remove the line
and a dual-axis chart puts each line on the right scale. Insights'
`getReferenceLineSeries` is the precedent.

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

Two decisions fell out of the work and answer questions this record raised.

- **A reference line does not stretch the value axis.** A target far outside the
  data would flatten the data it is read against, so a line beyond the range is
  clipped. `yAxis.min` and `max` bring one into frame.
- **`maxSeries` has no default.** A ring cannot show 20 arcs, so `maxSlices`
  defaults. An axis chart with 20 series is legible enough that a default would
  silently redraw every existing long-data chart.

One case is still open. **`show_scrollbar`** is a `dataZoom` slider. Insights
reflows the grid and the legend to make room, and the orientation follows the
Row chart. Panning a wide series is a reading of the data, so convention 1
admits it. Convention 2 is the open question, because the reflow moves chrome
the library owns.
