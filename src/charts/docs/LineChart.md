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

A `seriesConfig` entry can also name a `type` of its own, which draws that
series as a bar or an area instead — the amount as columns under the rate it
implies. See [combo charts](/docs/charts/bar-chart#mixing-shapes-combo-charts).

## Gaps

Null readings break the line, because a gap in the data should read as a gap.
`connectNulls` bridges them instead.

<ComponentPreview name="Charts-LineGaps" csr="true" self-layout />

<!-- @include: ./LineChart.api.md -->
