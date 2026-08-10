# HeatmapChart

Magnitude across two dimensions, a cell per pair.

## Values in cells

`x`, `y` and `value` name a cell's column, row and magnitude, so the data is one
row per cell. `showValues` prints values inside the cells, dropping any label
that would collide with its neighbour.

<ComponentPreview name="Charts-HeatmapTickets" csr="true" self-layout />

## Signed data

Signed data reads on the `diverging` ramp, centered on zero. `min` and `max` pin
the scale so the colors mean the same thing across reloads.

<ComponentPreview name="Charts-HeatmapDemand" csr="true" self-layout />

<!-- @include: ./HeatmapChart.api.md -->
