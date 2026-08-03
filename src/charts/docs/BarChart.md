# BarChart

Bars for comparing categories, or a measure over time.

## Wide data

One `y` column per series. `xAxis.type` is inferred: a column of dates reads as
a time axis, anything else as categories. Axis and tooltip formatting is a
function you supply. A saved chart is one typed object you spread with `v-bind`,
as this one is.

<ComponentPreview name="Charts-BarGrouped" csr="true" self-layout />

## Long data and stacking

Long data is the other shape: one row per point, with `series` naming the column
that splits the rows apart. `stacked` sums those series into one column per
category.

<ComponentPreview name="Charts-BarStackedLong" csr="true" self-layout />

## Horizontal bars

`horizontal` moves the category axis to Y, which is how long labels stay
readable. Per-series looks live in `seriesConfig`, keyed by series identity —
here to print the value on each bar.

<ComponentPreview name="Charts-BarHorizontal" csr="true" self-layout />

## Clicking a bar

`datapointClick` reports the series, the value and the row behind the bar, so a
chart can open the records it summarizes.

<ComponentPreview name="Charts-BarClick" csr="true" self-layout />

<!-- @include: ./BarChart.api.md -->
