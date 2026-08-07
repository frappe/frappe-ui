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

## Mixing shapes: combo charts

A series is drawn as its chart's own shape until `seriesConfig` gives it a
`type` of its own. That is what a combo chart is — bars for the amounts, a line
for the rate they imply — and the recast series takes the style keys of the
shape it names, `lineType` and `showDataPoints` here rather than `stackName`.

Two units belong on two axes, so `y2` puts the rate on the second value axis
with a format of its own. Combo and `y2` are the same chart: the rate is the
reason the second axis exists.

<ComponentPreview name="Charts-BarCombo" csr="true" self-layout />

The tag names the shape the rest of the series take, so the same chart can be
written from any of the three: `<LineChart>` with `revenue` and `expenses`
recast to `type: 'bar'` draws exactly this plot. Lines are drawn over bars and
bands whatever order the series were declared in, and `stacked` sums each shape
into a stack of its own — a line never joins one.

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
