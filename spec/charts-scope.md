# Charts v2 — what belongs in the library

Charts v2 is the standard chart library for every Frappe app. A chart in one app must look
and read like a chart in the next one. That only holds if the library keeps one coherent
model instead of collecting the union of what its consumers asked for.

This document states the rule that decides what enters v2. It then applies the rule to the
gap list from the Insights audit of 2026-08-05, which compared `src/charts` against
`insights/frontend/src2/charts` (`helpers.ts`, `chart.ts`, `types/chart.types.ts`).

Insights is the first large consumer of v2. It is not the specification. The audit supplies
the cases. The rule below decides them.

This document replaces the v1 frame in [charts-parity.md](charts-parity.md). Insights never
imported v1 charts, and v1 does not meet these requirements either. Delete v1 on its own
schedule.

## The conventions v2 is built on

1. **A prop says what the data means. It does not say what the renderer should do.**
   `x`, `y`, `series`, `stacked`, and `horizontal` describe a reading of the data.
   `barGap: '-100%'` is an instruction to echarts. Instructions go through `echartOptions`.
2. **The library owns the look. The caller owns the meaning.** Dotted gridlines, xs legends,
   one legend placement, and no hover dimming are decided once, for every app. A prop that
   hands such a decision back to the caller breaks the family.
3. **Legibility is the library's job, not a knob.** v2 measures text, truncates, and waits
   for the font to settle. A prop that asks the caller to fix a readability problem is v2
   admitting it failed.
4. **One mechanism per concept.** No parallel path and no branch per case. A second spelling
   of an idea v2 already has is a defect, not a feature.
5. **v2 draws data. It does not model a domain or compute a caller's numbers.** Rows and
   keys go in, a plot comes out. No `Dimension` or `Measure` objects, and no deriving a
   value the caller should pass.
6. **Plot and chrome separate cleanly.** The library owns the chrome. A plot an app draws
   itself still wears it.

## The rule

A feature enters v2 when it follows from these conventions. A feature stays out when it
contradicts one, whatever the demand.

Demand decides **order**, never **membership**. One app asking is enough for a feature the
model already implies. Every app asking is not enough for a feature that breaks it.

Insights stores every chart config in the database, one row per workbook chart. A rename in
v2 becomes a data patch in Insights. Settle the names below before Insights migrates.

## Enters v2

| Feature | Shape in v2 | Follows from |
| --- | --- | --- |
| Combo series | `seriesConfig[key].type: 'bar' \| 'line' \| 'area'` | Convention 4. One mechanism covers combo charts, per-series `show_area`, and the `LineChart` / `AreaChart` split. |
| Reference lines | `referenceLines` on axis charts | Convention 1. A target or a threshold is a statement about the data. v2 defines its own shape. Read `getReferenceLineSeries` in Insights first: it hosts each line on its own empty series, one per axis, so a legend toggle cannot remove the line and a dual-axis chart puts each line on the right scale. That rule is internal, not API. |
| 100% stacked | `stacked: boolean \| 'normalized'` | Conventions 1 and 4. Reading a share instead of a total is a meaning. It extends `stacked` rather than adding a second boolean beside it. |
| Series cap | `maxSeries` | Conventions 3 and 4. A grouping column with 200 values produces an unreadable chart. `maxSlices` already solves the same problem for the donut. Decide once whether the remainder collapses into an "Other" series. |
| Scatter | `ScatterChart`, with an optional size measure | Convention 1. It is a way to read two measures against each other. With `referenceLines` it also covers Insights' quadrant lines, so no `show_quadrants` prop. |
| Sankey | `SankeyChart` | Convention 1. A flow between a source and a target is a reading of the data. Low priority by demand, which is a scheduling call, not a membership one. |

## Solved without a prop

Convention 3 turns two Insights options into library work.

- **X axis label angle.** Insights exposes `label_rotation`, clamped to 0–90 degrees. v2
  measures text through `measureText.ts`. Rotate or skip the labels automatically when they
  do not fit. Every app gets legible axes and nobody sets an angle.
- **Small funnel stages.** Insights scales stage width by the square root of the value so
  small stages stay visible. v2 enforces a minimum readable stage width instead. Same
  result, no scale menu, and the other stages keep their true proportion.

## Stays out

- **`overlap`** — bars sharing an x slot through `barGap: '-100%'`. Convention 1: a renderer
  instruction. It goes through the per-series `echartOptions` merge.
- **Donut `legend_position`** — convention 2. Where the legend sits is the library's
  decision.
- **`hide_from_chart`** — a series that stays in the data and the tooltip, draws at zero
  opacity, and keeps its legend entry. Convention 4: v2 already owns this concept as
  `v-model:hiddenSeries`. An app maps onto it or drops the behavior.
- **`comparison`** — Insights derives the delta from a date column. Convention 5. v2 takes a
  delta the caller computed.
- **Funnel measures mode** — Insights reads one row and treats each measure as a stage.
  Convention 5: a data shape, not a chart. v2 takes the grouped shape, a label column and a
  value column per row. The caller reshapes.
- **NumberCard multiple values** — `number_columns` is an array with per-column prefix,
  suffix, decimals, shorten, and color. Convention 2: that is a layout. The app lays out the
  values and puts one v2 `NumberCard` behind each. See the chrome section.
- **Table** — a pivot grid with row and column dimensions, totals, conditional formatting,
  sticky columns, column widths, and text wrap. `TableChartConfig` carries 12 keys. Nothing
  in it maps a value to a visual property, so it is not a plot. If frappe-ui ships it, it
  ships as a DataTable.
- **Map** — a choropleth over world or India GeoJSON, with Jenks natural-breaks
  classification into 5 buckets, a piecewise `visualMap`, and a region-name mapping table.
  A choropleth is a real chart. It stays out because it needs a geography layer v2 does not
  own: an external GeoJSON, name resolution for unmatched regions, and a classification
  step. That is data cleaning, not rendering. If v2 ever owns that layer, Map enters. The
  count of apps asking for it was never the reason.

## Chrome export

A v2 chart has two layers. The plot is echarts inside a box. The chrome is everything
around it, in Vue and semantic tokens: the card surface, the title and subtitle block, the
`actions` slot, the y axis title labels, the legend with its hover cue and hidden-series
toggling, the HTML tooltip, and the loading, error, and empty states.

The chrome lives in `components/ChartContainer.vue`, `components/ChartLegend.vue`, and
`components/ChartTooltip.vue`. `index.ts` exports none of them, so convention 6 does not
hold in practice yet. Two decisions above depend on it.

- An app-owned plot on `useChart` gets sizing, colors, and resize handling, then hand-rolls
  a card, a title, a legend, a tooltip, and three states. It will not match a v2 bar chart
  on the same dashboard. That mismatch is the pressure that pushes app features back into
  the library.
- The card surface has no single owner. `ChartContainer` draws none, so every axis, donut,
  funnel, and heatmap chart takes its card from the caller. `NumberCard` draws its own. One
  chart owning a surface six others delegate is convention 4 failing. It also means three
  `NumberCard`s inside an app's own card nest a bordered box in a bordered box.

Two changes fix both.

1. Export the chrome. The app owns the plot and the library owns the look.

   ```vue
   <ChartContainer title="Revenue by region" :loading="loading" :error="error">
     <div ref="plot" class="h-full w-full" />
     <template #legend><ChartLegend :items="buckets" /></template>
   </ChartContainer>
   ```

2. Give the surface one owner: a `ChartCard` piece that holds the card classes, and a single
   `card` prop that turns it off. The caller keeps supplying the card for plots, which is
   the established pattern. `NumberCard` keeps drawing one by default, because a reading
   with no plot is a card, but `:card="false"` lets an app lay out several readings inside
   its own card.

An app then lays out its own number grid, drops bare `NumberCard`s into it, and keeps v2
formatting, `compact`, `precision`, delta rendering, the sparkline, and the states.

## Order of work

Demand and dependency set this order. The rule above already settled what is on the list.

1. Chrome export and the shared card surface. Convention 6 fails until this lands, and both
   app-owned paths depend on it.
2. Combo series through `seriesConfig[key].type`.
3. Reference lines.
4. `stacked: 'normalized'` and `maxSeries`.
5. `ScatterChart`.
6. Automatic x axis label fitting.
7. `SankeyChart`.

## Undecided

**`show_scrollbar`** — a `dataZoom` slider. Insights reflows the grid and the legend to make
room, and the orientation follows the Row chart. Panning a wide series is a reading of the
data, so convention 1 admits it. Convention 2 is the open question: the reflow moves chrome
the library owns. Revisit after combo series and reference lines land.

## Adapter layer, not a gap

Insights configs reference columns through `Dimension` and `Measure` objects. v2 props take
plain row keys. Insights also pivots wide before it plots, and v2 reads long data through
the `series` prop. Insights needs a mapping layer whatever v2 does. Convention 5 says the
mapping belongs to the app. Do not shape v2 props around a stored config format.

## Already in v2 — do not rebuild

`horizontal` covers the Row chart. `stacked`, dual axis through `align`, `series` grouping,
`smooth`, `showDataPoints`, `showDataLabels`, `min`/`max`, `maxSlices`, `showInlineLabels`,
`sparkline`, `compact`, `precision`, and `timeGrain` all exist. v2 also ships a heatmap,
empty and loading and error states, theme-reactive palettes, HTML tooltips with slots, and
typed events. Insights has none of these.
