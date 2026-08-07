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

## A line among the bars

`seriesConfig[key].type` sets the mark a single series draws as: `'bar'`,
`'line'` or `'area'`. The chart component sets the default for the rest, so a
`BarChart` with one `'line'` series is a combo chart. A rate belongs on its own
scale, which `y2` gives it.

<ComponentPreview name="Charts-BarCombo" csr="true" self-layout />

Marks stack among their own: bars stack with bars and areas with areas, and a
line never stacks. `horizontal` draws bars only — a series that asks for another
mark there is drawn as a bar, with a dev-mode warning.

## Clicking a bar

`datapointClick` reports the series, the value and the row behind the bar, so a
chart can open the records it summarizes.

<ComponentPreview name="Charts-BarClick" csr="true" self-layout />

<!-- @include: ./BarChart.api.md -->
