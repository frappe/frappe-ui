# ScatterChart

Plots two measures against each other, with one point for each row.

## Two measured axes

`x` and `y` name the two value columns. Both axes are numeric scales. A scatter
has no category axis and cannot be given one. Each scale follows the data
instead of starting at zero, so the points fill the plot. `label` names the
column that titles a point in the tooltip, and `select` reports the data row of
the point.

The `xAxis` title is drawn on its axis and the `yAxis` title above the plot, as
on the other axis charts.

<ComponentPreview name="Charts-ScatterSpend" csr="true" self-layout />

## A third measure as size

`size` names a numeric column. Each point's diameter scales linearly with that
value, within a readable range. The scale covers the whole plot, not each group,
so a bubble size means the same thing everywhere. If every row has the same
value, all bubbles are drawn at the middle size, because there is no difference
to show and the smallest size would suggest they are the smallest values.

`splitBy` splits the rows into one group per distinct value, each with its own
color and legend entry. Press a legend entry to hide a group, or bind
`v-model:hiddenSeries` to control that list yourself.

<ComponentPreview name="Charts-ScatterMarkets" csr="true" self-layout />

## Quadrants and other reference lines

`referenceLines` draws a line across the plot at a fixed value, such as a
target, a threshold or a median. Each line takes a `value` and an optional
`label`, `color` and `dashed`. Reference lines are not series: they have no
legend entry or tooltip entry and cannot be hidden, so they stay visible when you
hide a group.

`labelPlacement` moves the label when it covers something. See
[BarChart](/docs/charts/barchart#targets-and-thresholds).

`axis` sets which scale `value` belongs to. Both scales are numeric here, so
`'x'` and `'y'` both take a number. On an axis chart, `'x'` takes a category or
a date instead, unless `xAxis.type` is `'value'`. `'y'` (the default) draws a
horizontal line and `'x'` a vertical one. A scatter has no second value axis, so
`'y2'` is treated as `'y'`, with a warning in dev mode.

To split a scatter into quadrants, add one reference line per axis. There is no
`quadrants` prop, because a quadrant divider is a reference line, and the axis
charts already use `referenceLines` for that.

<ComponentPreview name="Charts-ScatterQuadrants" csr="true" self-layout />

A line outside the plotted range is not drawn, because each scale follows the
data, not the lines. Set `xAxis.min` / `max` or `yAxis.min` / `max` to bring a
distant line into view.

## Naming the points

`showDataLabels` prints each point's name beside it, as in the chart above, so
you can see which quadrant each product is in without hovering. It prints the
`label` column. If no `label` is set, nothing prints and you get a warning in
dev mode. It does not print the x or y value, because the axes already show
them.

Points often overlap, and so would their names. A name that overlaps a
neighbor is hidden, so a dense plot shows only a few names.

## Formatting

`format` formats every number the chart shows. `xAxis.format` and
`yAxis.format` override it for their own axis, for a chart whose two measures
are in different units. The size measure has no axis, so `format` formats it in
the tooltip.

<!-- @include: ./ScatterChart.api.md -->
