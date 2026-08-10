# AreaChart

The line family with a fill, for volume over time. It is a `LineChart` whose
unmarked series carry a fill, so the two take the same props;
`seriesConfig[key].type` overrides the mark of any one series to `'line'`,
`'bar'` or `'area'`.

## Stacked bands

`stacked` turns the washes into opaque bands that sum to the total, so the top
edge is the whole and each band is a part of it. Only a band that stacks onto
another reads as solid: an area with nothing under it keeps its wash, so a fill
never hides the marks behind it.

<ComponentPreview name="Charts-AreaStacked" csr="true" self-layout />

`stacked="normalized"` draws each band as its share of the total at that x
instead of its own magnitude, which flattens the top edge and pins the value
axis to 0-100. The rows are untouched, so the tooltip still carries the number
that was measured alongside the share. `maxSeries` caps how many series a
`series` column produces and sums the tail into one "Others" band; the cap runs
before the shares are taken, so they still add up. Both are described under
[BarChart](/docs/charts/barchart).

## A single series

Unstacked, the fill fades out towards the axis. `fillOpacity` sets the
chart-level alpha; a `seriesConfig` entry overrides it per series.

<ComponentPreview name="Charts-AreaLatency" csr="true" self-layout />

## Hiding a series

A chart with more than one series draws a legend under the plot. Press an entry
to take that band out of the chart. The stack closes over it, and a normalized
stack re-takes its shares over the bands that are left. Bind
`v-model:hiddenSeries` to own that list yourself;
it is described under [BarChart](/docs/charts/barchart#hiding-a-series).

<!-- @include: ./AreaChart.api.md -->
