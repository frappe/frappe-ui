# BarChart

Bars for comparing categories, or a measure over time.

## Wide data

One `y` column per series. `xAxis.type` is inferred: a column of dates becomes
a time axis, anything else becomes categories. You pass functions to format the
axes and the tooltip. This example stores the chart as one typed object and
passes it with `v-bind`.

<ComponentPreview name="Charts-BarGrouped" csr="true" self-layout />

## Long data and stacking

Long data has one row per point, and `splitBy` names the column that splits
the rows into series. `stacked` sums those series into one column per
category.

<ComponentPreview name="Charts-BarStackedLong" csr="true" self-layout />

## Shares instead of totals

`stacked="normalized"` draws a 100% stacked chart. Each value is drawn as its
share of its column, and the value axis is fixed at 0-100 so every column fills
the plot. `maxSeries` limits how many series `splitBy` creates. The rest are
added into one "Others" series, the same way `maxSlices` groups the smallest
slices of a donut. The chart keeps the largest series, measured over every x,
and keeps them in the order they appear in the data.

<ComponentPreview name="Charts-BarShares" csr="true" self-layout />

The data rows do not change, so the plot shows the share and the tooltip shows
both the share and the measured number. `yAxis.format` formats that number in
the tooltip. The axis ticks always show percentages, even if you set
`yAxis.format` or an `axisLabel.formatter` in that axis's `echartOptions`.

Shares are computed per stack. Two stacks with different `stackName`s each
reach 100, and a bar stack and an area stack are separate totals. A series that
stacks with nothing (a line, or a bar or area on its own) keeps its own values.
If its axis is fixed at 0-100, you get a warning in dev mode. Move it to `y2` to
give it its own scale. A `min` or `max` on a fixed axis is ignored, also with a
warning, because a column that stops short of the top no longer shows a whole.

`maxSeries` applies to `splitBy` only. A `y` list names each column, so no
column is dropped, and setting `maxSeries` gives a warning instead. The
"Others" series has the reserved key `__others__`, so a group that is really
named "Others" does not clash with it. A `seriesConfig.__others__` entry renames
or recolors it like any other series.

## Horizontal bars

`horizontal` moves the category axis to Y, so long labels stay readable.
`seriesConfig` sets the look of each series, keyed by series name. Here it
prints the value on each bar. `showDataLabels` on the chart prints them
on every series at once, and a `seriesConfig` entry overrides it for one.

<ComponentPreview name="Charts-BarHorizontal" csr="true" self-layout />

## Labels that do not fit

The category axis measures its labels against the space available and shows
as much of each one as fits. If every label fits, nothing changes. If one does
not, the axis picks the layout that shows more text: flat and truncated in the
middle, or tilted to 45°, which uses the space below the axis. Wide slots stay
flat, because flat text is easier to read. Crowded slots tilt, where a flat
label would shrink to a few letters. All labels on the axis use the same layout,
because labels at two angles look like two axes.

There is no angle prop and no truncation length. The right angle changes with
the chart width, and the chart already knows the width and has measured the
text. A `horizontal` chart never tilts its labels: they are already one per line
down the side, so they are truncated to fit that column. A time axis never tilts
either. It picks its own ticks, and uses a larger interval instead of crowding
them.

## A line among the bars

`seriesConfig[key].type` sets how one series draws: `'bar'`, `'line'` or
`'area'`. The other series use the component's default, so a `BarChart` with
one `'line'` series is a combo chart. Put a rate in `y2` instead of `y` to give
it its own scale.

<ComponentPreview name="Charts-BarCombo" csr="true" self-layout />

The sequential ramp assigns colors by mark type, not by series order: lines
get the dark end and bars get the light colors. A bar is large enough to see in
a light color, but a 2px line in the same color disappears. The other palettes
keep series order, because the order of a custom list, a diverging ramp or a
categorical set has meaning.

Bars stack with bars and areas with areas. A line never stacks. `horizontal`
draws bars only. A series set to another type is drawn as a bar, with a warning
in dev mode.

## Targets and thresholds

`referenceLines` draws a line across the plot at a fixed value, such as a
quota, a break-even point or a release date. Each line takes a `value` and an
optional `label`, `color` and `dashed`. Reference lines are not series: they
have no legend entry and cannot be hidden.

`labelPlacement` moves the label when it covers something. It names an end of
the line and a side of it: `'end-top'` (the default), `'end-bottom'`,
`'start-top'` or `'start-bottom'`. The ends follow the direction of the axis the
line runs along, so an RTL chart swaps them. A vertical line has a rotated
label, and its two sides are left and right.

<ComponentPreview name="Charts-BarTarget" csr="true" self-layout />

`axis` sets which axis `value` belongs to: `'y'` (the default) or `'y2'` for a
horizontal line at a value, `'x'` for a vertical line at a category or date.
`horizontal` swaps the two axes and the lines follow. A line outside the plotted
range is not drawn, because the scale follows the data, not the lines. Set
`yAxis.min` or `max` to bring a distant target into view.

## Context in the tooltip

`tooltipColumns` names columns that show only in the tooltip. They get no
mark, no legend entry, no color and no place on the value axis. See
[LineChart](/docs/charts/linechart#context-in-the-tooltip).

## Hiding a series

A chart with more than one series draws a legend under the plot. Press an entry
to hide that series, and the value axis rescales to the series that are left.

Bind `v-model:hiddenSeries` to start with a series hidden, or to hide series
from your own control. It holds series keys: a `y` column name for wide data, a
value of the `splitBy` column for long data, or `__others__` for the "Others"
series. `LineChart`, `AreaChart` and
`ScatterChart` take the same model.

## Selecting a bar

`select` reports the series, the value and the data row of the bar, so you can
open the records behind it. It fires on click, and on Enter or Space when the
keyboard cursor is on the bar.

<ComponentPreview name="Charts-BarSelect" csr="true" self-layout />

<!-- @include: ./BarChart.api.md -->
