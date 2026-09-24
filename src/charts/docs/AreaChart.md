# AreaChart

Lines with a fill, for volume over time. It is a `LineChart` that fills its
series by default, so the two take the same props. `seriesConfig[key].type`
changes how one series draws: `'line'`, `'bar'` or `'area'`.

## Stacked bands

`stacked` turns the light fills into solid bands that add up to the total, so
the top edge is the total and each band is a part of it. Only a band that stacks
onto another is solid. An area with nothing under it keeps its light fill, so it
never hides the marks behind it.

<ComponentPreview name="Charts-AreaStacked" csr="true" self-layout />

`stacked="normalized"` draws each band as its share of the total at that x
instead of its own value. The top edge becomes flat and the value axis is fixed
at 0-100. The data rows do not change, so the tooltip shows the measured number
next to the share. `maxSeries` limits how many series `splitBy` creates and adds
the rest into one "Others" band. The limit applies before the shares are
computed, so they still add up to 100. See [BarChart](/docs/charts/barchart)
for both.

## A single series

When not stacked, the fill fades out towards the axis, so lines stay readable
where they cross. Areas that stack into a band get a solid fill instead.

<ComponentPreview name="Charts-AreaLatency" csr="true" self-layout />

## Context in the tooltip

`tooltipColumns` names columns that show only in the tooltip. They get no
mark, no legend entry, no color and no place on the value axis. See
[LineChart](/docs/charts/linechart#context-in-the-tooltip).

## Hiding a series

A chart with more than one series draws a legend under the plot. Press an entry
to hide that band. The stack closes the gap, and a normalized stack recomputes
the shares over the bands that are left. Bind `v-model:hiddenSeries` to control
that list yourself. See [BarChart](/docs/charts/barchart#hiding-a-series).

<!-- @include: ./AreaChart.api.md -->
