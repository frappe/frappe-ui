# LineChart

Lines for a measure that moves over time.

## Trends

Two series on a time axis, one dashed as the comparison. `smooth`, `lineType`,
`lineWidth` and `showDataPoints` are per-series settings in `seriesConfig`.

<ComponentPreview name="Charts-LineTrend" csr="true" self-layout />

## A second value axis

`y2` measures a column against a second value axis, drawn opposite the primary —
for a series in another unit, like a rate against dollars. `y2Axis.min` / `max`
pin the scale so the line reads as over or under plan rather than as its own
trend.

<ComponentPreview name="Charts-LineDualAxis" csr="true" self-layout />

## Filling one series

`seriesConfig[key].type` sets the mark a single series draws as, so one line of
a `LineChart` carries a fill on `type: 'area'` while the rest stay bare. There is
no separate fill flag: an area *is* a filled line. `fillOpacity` sets the alpha,
chart-wide or per series. The same key takes `'bar'`, which is what makes a
combo chart.

<ComponentPreview name="Charts-LineFilledSeries" csr="true" self-layout />

## Targets and thresholds

`referenceLines` draws a rule over the plot at a fixed position. `axis` says what
`value` is read against: `'y'` (the default) or `'y2'` for a rule across the plot
at a measured value, `'x'` for one down it at a category or a date. Each line
also takes an optional `label`, `color` and `dashed`.

<ComponentPreview name="Charts-LineThresholds" csr="true" self-layout />

A reference line is an annotation, not a series: it has no legend entry, it is
never in the tooltip, and it cannot be switched off — which is what a threshold
has to be to stay comparable. A line outside the range the plot covers is not
drawn, because stretching the scale to fit a distant target would flatten the
data it is meant to be read against; pin `yAxis.min` / `max` instead.

## Gaps

Null readings break the line, because a gap in the data should read as a gap.
`connectNulls` bridges them instead.

<ComponentPreview name="Charts-LineGaps" csr="true" self-layout />

<!-- @include: ./LineChart.api.md -->
