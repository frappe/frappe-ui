# AreaChart

The line family with a fill, for volume over time.

## Stacked bands

`stacked` turns the washes into opaque bands that sum to the total, so the top
edge is the whole and each band is a part of it.

<ComponentPreview name="Charts-AreaStacked" csr="true" self-layout />

## A single series

Unstacked, the fill fades out towards the axis. `fillOpacity` sets the
chart-level alpha; a `seriesConfig` entry overrides it per series.

<ComponentPreview name="Charts-AreaLatency" csr="true" self-layout />

## Mixing shapes

A `seriesConfig` entry can name a `type` of its own, drawing that series as a
bar or a plain line instead of a band. Each shape stacks into a stack of its
own, so `stacked` never sums a band on top of a column. See
[combo charts](/docs/charts/bar-chart#mixing-shapes-combo-charts).

<!-- @include: ./AreaChart.api.md -->
