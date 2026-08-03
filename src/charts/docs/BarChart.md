# BarChart

Wide data — one `y` column per series. `xAxis.type` is inferred: a column of
dates reads as a time axis, anything else as categories. Axis and tooltip
formatting is a function, not a format code.

<ComponentPreview name="Charts-BarGrouped" csr="true" self-layout />

Long data is the other shape: one row per point, with `series` naming the column
that splits rows apart. `stacked` sums the series into one column per category.

<ComponentPreview name="Charts-BarStackedLong" csr="true" self-layout />

`horizontal` moves the category axis to Y, which is how long labels stay
readable. Per-series looks live in `seriesConfig`, keyed by series identity —
here to print the value on each bar.

<ComponentPreview name="Charts-BarHorizontal" csr="true" self-layout />

`palette` takes a named ramp or an explicit list of colors; a `seriesConfig`
entry pins one series to a color of its own. `datapointClick` reports the
series, the value and the row behind it.

<ComponentPreview name="Charts-BarPaletteClick" csr="true" self-layout />

<!-- @include: ./BarChart.api.md -->
