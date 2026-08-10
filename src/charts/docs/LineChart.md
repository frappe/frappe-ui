# LineChart

Lines for a measure that moves over time.

## Trends

Two series on a time axis, one dashed as the comparison. `smooth`, `lineType`,
`lineWidth` and `showDataPoints` are per-series settings in `seriesConfig`.

<ComponentPreview name="Charts-LineTrend" csr="true" self-layout />

## A numeric x axis

`xAxis.type: 'value'` reads the x column as a quantity. A point sits at its own
number, so a row at 5 and a row at 60 stand as far apart as the numbers are, and
the rows draw in numeric order whatever order they arrive in.

The default reading is `'category'`, which gives every row an equal slot. A
column of dates becomes `'time'` on its own, but a column of numbers never
becomes a scale by itself — a category column often holds numbers, so the scale
is asked for. A horizontal `BarChart` ignores the setting, because a bar is
sized from the slot it stands in; `horizontal` is a `BarChart` prop, and a line
chart has none.

<ComponentPreview name="Charts-LineNumericAxis" csr="true" self-layout />

## A second value axis

`seriesConfig[key].axis` measures a series against a second value axis, drawn
opposite the primary — for a series in another unit, like a rate against
dollars. `y2Axis.min` / `max` pin that scale so the line reads as over or under
plan rather than as its own trend. The axis is only drawn when a series asks
for it.

<ComponentPreview name="Charts-LineDualAxis" csr="true" self-layout />

Which scale a series is read against is per-series meaning, so it sits in the
same entry as that series' label and mark. It is not a second column list: `y`
names every series once, in the order they are drawn and colored, and moving one
across to the second axis leaves it where it was. Long data reaches the axis the
same way, keyed by a value of the `series` column.

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
at a measured value, `'x'` for one down it at a category, a date, or a number on
a numeric x axis. Each line
also takes an optional `label`, `color` and `dashed`.

<ComponentPreview name="Charts-LineThresholds" csr="true" self-layout />

A reference line is an annotation, not a series: it has no legend entry, it is
never in the tooltip, and it cannot be switched off — which is what a threshold
has to be to stay comparable. A line outside the range the plot covers is not
drawn, because stretching the scale to fit a distant target would flatten the
data it is meant to be read against; pin `yAxis.min` / `max` instead.

## Hiding a series

A chart with more than one series draws a legend under the plot. Press an entry
to take that line out of the chart, or bind `v-model:hiddenSeries` to own that
list yourself. It is described under
[BarChart](/docs/charts/barchart#hiding-a-series).

## Gaps

Null readings break the line, because a gap in the data should read as a gap.
`connectNulls` bridges them instead.

<ComponentPreview name="Charts-LineGaps" csr="true" self-layout />

<!-- @include: ./LineChart.api.md -->
