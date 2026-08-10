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

## Shares instead of totals

`stacked="normalized"` is the 100% stacked reading: each value is drawn as its
share of the column it sits in, and that value axis is pinned to 0-100 so every
column fills the plot. `maxSeries` caps how many series the grouping column
produces — the tail is summed into a single "Others" series, the way `maxSlices`
groups the tail of a donut. The cap keeps the series that carry the chart,
measured over every x, and the survivors stay in the order the data put them in.

<ComponentPreview name="Charts-BarShares" csr="true" self-layout />

The rows are never rewritten, so the plot shows the share and the tooltip shows
both it and the number that was measured. A `yAxis.format` prints that number in
the tooltip; the ticks read as percentages whatever it says.

The share is taken per stack, so two stacks under different `stackName`s each
reach 100 on their own, and a bar stack and an area stack are two wholes. A
series that stacks with nothing — a line always, a lone bar or band otherwise —
keeps its own numbers, with a dev-mode warning if the axis under it is pinned;
put it on `axis: "y2"` to give it its own scale. A `min` or `max` set on a
pinned axis is overruled, also with a warning: a column that stops short of the
top no longer reads as a whole.

`maxSeries` applies to the `series` column only. A `y` list names its columns
one by one, so nothing there is dropped; asking for a cap warns instead. The
collapsed series has the reserved identity `__others__`, so a group whose name
really is "Others" cannot collide with it, and a `seriesConfig.__others__` entry
renames or recolors it like any other series.

## Horizontal bars

`horizontal` moves the category axis to Y, which is how long labels stay
readable. Per-series looks live in `seriesConfig`, keyed by series identity —
here to print the value on each bar.

<ComponentPreview name="Charts-BarHorizontal" csr="true" self-layout />

## Labels that do not fit

The category axis measures its own labels against the room the chart was drawn
at, and shows as much of each one as that room allows. While every label fits
its slot nothing happens. Once one does not, the axis takes whichever layout
carries more text: flat and middle-truncated to the slot, or tilted to 45°,
which trades the slot for the depth below the axis. Wide slots stay flat —
reading across beats reading up a diagonal — and crowded ones tilt, where a flat
label would be down to a syllable. The whole axis takes one layout, because
labels leaning two ways read as two axes.

There is no angle prop, and no truncation length. An angle is a number the
caller would have to guess again at every width, on every dashboard; the chart
knows the width and has measured the text. `horizontal` never tilts: those
labels are already stacked one per line down the side, so they are shortened to
their column instead. A time axis never tilts either — it picks its own ticks,
and drops to a coarser interval rather than crowd them.

## A line among the bars

`seriesConfig[key].type` sets the mark a single series draws as: `'bar'`,
`'line'` or `'area'`. The chart component sets the default for the rest, so a
`BarChart` with one `'line'` series is a combo chart. A rate belongs on its own
scale, which `axis: 'y2'` in the same entry gives it.

<ComponentPreview name="Charts-BarCombo" csr="true" self-layout />

Marks stack among their own: bars stack with bars and areas with areas, and a
line never stacks. `horizontal` draws bars only — a series that asks for another
mark there is drawn as a bar, with a dev-mode warning.

## Targets and thresholds

`referenceLines` draws a rule over the plot at a fixed position — a quota, a
break-even point, the date something shipped. Each line takes a `value`, an
optional `label`, `color` and `dashed`. They are annotations, not series: no
legend entry, and no way to switch one off.

<ComponentPreview name="Charts-BarTarget" csr="true" self-layout />

`axis` says what `value` is read against: `'y'` (the default) or `'y2'` for a
rule across the plot at a measured value, `'x'` for one down it at a category or
a date. `horizontal` swaps the two axes and the lines follow. A line outside the
range the plot covers is not drawn — the scale follows the data, not the
annotation — so pin `yAxis.min` / `max` to bring a distant target into frame.

## Hiding a series

A chart with more than one series draws a legend under the plot. Press an entry
to take that series out of the chart, and the value axis rescales to what is
left.

`v-model:hiddenSeries` binds that list, so the app can start with a series
hidden, or drive the same toggles from a control of its own. It holds series
identities: a `y` column name on wide data, a value of the `series` column on
long data, or `__others__` for a capped tail. `LineChart`, `AreaChart` and
`ScatterChart` take the same model.

## Selecting a bar

`select` reports the series, the value and the row behind the bar, so a chart
can open the records it summarizes. It fires on a click and on Enter or Space
over the keyboard cursor.

<ComponentPreview name="Charts-BarSelect" csr="true" self-layout />

<!-- @include: ./BarChart.api.md -->
