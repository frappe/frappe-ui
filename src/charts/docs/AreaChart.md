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

## A single series

Unstacked, the fill fades out towards the axis. `fillOpacity` sets the
chart-level alpha; a `seriesConfig` entry overrides it per series.

<ComponentPreview name="Charts-AreaLatency" csr="true" self-layout />

<!-- @include: ./AreaChart.api.md -->
