# ScatterChart

Two measures read against each other, a point per row.

## Two measured axes

`x` and `y` name the two value columns. Both axes are measured — this is the one
chart in the family with no category axis — so each scale follows the data
instead of anchoring to zero, and the cloud fills the plot. `label` names the
column that titles a point in the tooltip, and `pointClick` carries the row
behind it.

The `xAxis` title is drawn on its axis, the `yAxis` title above the plot, the
same way every cartesian chart in v2 places them.

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

## Quadrants

A scatter is often read in quadrants: a vertical and a horizontal line dividing
the plot into four, with each corner meaning something to the business. There is
no `quadrants` prop and there will not be one: a quadrant divider is a reference
line, the axis charts already spell that `referenceLines`, and one concept gets
one spelling. `ScatterChart` takes the same prop. Until it does, draw a divider
through the `echartOptions` escape hatch.

## Formatting

`format` prints every number the chart shows. `xAxis.format` and `yAxis.format`
override it for their own axis, which is what a chart whose two measures are in
different units needs. The size measure has no axis of its own, so `format` is
what prints it in the tooltip.

<!-- @include: ./ScatterChart.api.md -->
