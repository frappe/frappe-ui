# DonutChart

A ring that shows each category's share of a total.

## Share of a total

`category` and `value` name the two columns the ring needs. The center shows
the total, with `centerLabel` as its caption. Hovering a slice shows that
slice's value, name and share in the center instead.

`format` formats the numbers in the center and in the tooltip. The slice labels
show shares, not values, so `format` does not apply to them.

<ComponentPreview name="Charts-DonutShare" csr="true" self-layout />

## Grouping the tail

`maxSlices` limits how many slices the ring draws, and "Others" counts as one
of them. So `maxSlices` of 4 draws three named slices plus "Others", as in this
example. If there are no more categories than the limit, the ring draws them all
with no "Others" slice. `select` reports the data rows behind the slice, and for
"Others" that is every grouped row.

<ComponentPreview name="Charts-DonutOthers" csr="true" self-layout />

## Half ring

`variant="half"` draws the ring as a semicircle, which fits a short card.
Ordered categories read better on the `sequential` ramp than on separate hues.

`showDataLabels` prints each slice's name and share next to the ring and
removes the center total, since the labels already show the shares.
`centerLabel` has no effect while it is on, and neither does `format` in the
center. The legend still shows below the plot, with each slice's share.

<ComponentPreview name="Charts-DonutHalf" csr="true" self-layout />

## Hiding slices

`v-model:hiddenSlices` works like `v-model:hiddenSeries` on an axis chart.
Bind it to hide slices from your own code, or to keep hidden slices after a
reload. When it is not bound, the legend manages the list. A donut draws slices,
not series, so it is the only chart with this name for the model.

<!-- @include: ./DonutChart.api.md -->
