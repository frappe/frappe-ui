# LineChart

Two series on a time axis, one dashed as the comparison. `smooth`, `lineType`,
`lineWidth` and `showDataPoints` are per-series settings.

<ComponentPreview name="Charts-LineTrend" csr="true" self-layout />

`y2` measures a column against a second value axis, drawn opposite the primary —
for a series in another unit, like a rate against dollars. `y2Axis.min` / `max`
pin the scale so the line reads as over or under plan rather than as its own
trend.

<ComponentPreview name="Charts-LineDualAxis" csr="true" self-layout />

Null readings break the line, because a gap in the data should read as a gap.
`connectNulls` bridges them instead.

<ComponentPreview name="Charts-LineGaps" csr="true" self-layout />

<!-- @include: ./LineChart.api.md -->
