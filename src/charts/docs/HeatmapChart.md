# HeatmapChart

Shows a value across two dimensions, with one cell for each pair.

## Values in cells

`x`, `y` and `value` name a cell's column, row and value, so the data has one
row per cell. `showDataLabels` prints values inside the cells and hides any label
that would overlap its neighbor.

<ComponentPreview name="Charts-HeatmapTickets" csr="true" self-layout />

## Printing the categories

`xAxis.format` and `yAxis.format` format the categories of their axis, on the
axis and in the tooltip. Each gets the raw value from the row, not the category
string, so a date column can print as `Mar`.

They change how a category prints, not what it is. Two categories that print the
same stay two cells, and `select` still reports the raw value.

<ComponentPreview name="Charts-HeatmapSignups" csr="true" self-layout />

## Signed data

Use the `diverging` ramp for data with positive and negative values. It is
centered on zero. Set `min` and `max` to fix the scale, so the colors mean the
same thing across reloads.

<ComponentPreview name="Charts-HeatmapDemand" csr="true" self-layout />

<!-- @include: ./HeatmapChart.api.md -->
