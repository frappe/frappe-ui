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

## Gaps

Null readings break the line, because a gap in the data should read as a gap.
`connectNulls` bridges them instead.

<ComponentPreview name="Charts-LineGaps" csr="true" self-layout />

<!-- @include: ./LineChart.api.md -->
