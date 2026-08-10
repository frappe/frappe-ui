# ScatterChart

Two measures read against each other, a point per row.

## Two measured axes

`x` and `y` name the two value columns. Both axes are measured — a scatter has
no category axis, and unlike an axis chart it cannot be asked for one — so each
scale follows the data instead of anchoring to zero, and the cloud fills the
plot. `label` names the column that titles a point in the tooltip, and
`select` carries the row behind it.

The `xAxis` title is drawn on its axis, the `yAxis` title above the plot, the
same way every cartesian chart in the family places them.

<ComponentPreview name="Charts-ScatterSpend" csr="true" self-layout />

## A third measure as size

`size` names a column of magnitudes, and each point is drawn at a diameter that
maps that magnitude linearly into a readable range. The scale runs over the
whole plot rather than within a group, so a bubble means the same thing wherever
it sits. Data with one distinct magnitude draws every bubble at the middle of
the range: it has no relative size to show, and drawing them all at the floor
would claim they were the smallest there is.

`series` splits the rows into one group per distinct value, colored from the
palette and named in the legend. Press a legend entry to take a group out of the
plot, or bind `v-model:hiddenSeries` to own that list yourself.

<ComponentPreview name="Charts-ScatterMarkets" csr="true" self-layout />

## Quadrants and other reference lines

`referenceLines` draws a rule over the plot at a fixed position — a target, a
threshold, or a median. Each line takes a `value`, an optional `label`, `color`
and `dashed`. They are annotations, not series: no legend entry, no tooltip
entry, and no way to switch one off, so a rule stays put while a legend toggle
takes a group out of the plot.

`axis` says which scale `value` is read against. Both scales are measured here,
so `'x'` and `'y'` are the same kind of thing: a number. An axis chart reads
`'x'` as a category or a date instead, unless `xAxis.type` is `'value'`. `'y'`
(the default) draws a rule across the
plot, `'x'` draws one down it. A scatter has no second value axis, so `'y2'`
reads as `'y'` with a dev-mode warning.

A scatter is often read in quadrants, with each corner meaning something to the
business. That is one line per axis. There is no `quadrants` prop and there will
not be one: a quadrant divider is a reference line, the axis charts already
spell that `referenceLines`, and one concept gets one spelling.

<ComponentPreview name="Charts-ScatterQuadrants" csr="true" self-layout />

A line outside the range the plot covers is not drawn — each scale follows the
data, not the annotation — so pin `xAxis.min` / `max` or `yAxis.min` / `max` to
bring a distant one into frame.

## Naming the points

`showDataLabels` prints each point's own name beside it, as the chart above
does. That is what a quadrant reading is for: it names the corner every product
sits in without hovering over one. What it prints is the `label` column, so a
chart that names none has nothing to show and says so in a dev-mode warning.
The two measures are already on the axes, and printing one of them beside the
symbol would say nothing the plot did not.

Points overlap by nature and so would their names. Names that collide with a
neighbour are dropped, the way a crowded axis drops labels, so a dense cloud
carries few.

## Formatting

`format` prints every number the chart shows. `xAxis.format` and `yAxis.format`
override it for their own axis, which is what a chart whose two measures are in
different units needs. The size measure has no axis of its own, so `format` is
what prints it in the tooltip.

<!-- @include: ./ScatterChart.api.md -->
