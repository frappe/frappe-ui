# HeatmapChart

Magnitude across two dimensions, a cell per pair.

## Values in cells

`x`, `y` and `value` name a cell's column, row and magnitude, so the data is one
row per cell. `showValues` prints values inside the cells, dropping any label
that would collide with its neighbour.

<ComponentPreview name="Charts-HeatmapTickets" csr="true" self-layout />

## Printing the categories

`xAxis.format` and `yAxis.format` print one cut each, on the axis and in the
tooltip. Each is given the value the row carried rather than the string the
category reads as, so a date column can read as `Mar`.

They change how a category prints, not what it is: two categories that print
alike stay two cells, and `select` still names the raw value.

<ComponentPreview name="Charts-HeatmapSignups" csr="true" self-layout />

## Signed data

Signed data reads on the `diverging` ramp, centered on zero. `min` and `max` pin
the scale so the colors mean the same thing across reloads.

<ComponentPreview name="Charts-HeatmapDemand" csr="true" self-layout />

<!-- @include: ./HeatmapChart.api.md -->
