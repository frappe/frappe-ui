# DonutChart

A ring that reads as share of a total.

## Share of a total

`category` and `value` name the two columns a ring needs. The middle prints the
total, captioned by `centerLabel`, and `format` runs on every value the chart
prints — slices, tooltip and the total alike.

<ComponentPreview name="Charts-DonutShare" csr="true" self-layout />

## Grouping the tail

Slices past `maxSlices` are summed into a single "Others" slice. `sliceClick`
carries the rows behind the slice — every grouped row, for "Others".

<ComponentPreview name="Charts-DonutOthers" csr="true" self-layout />

## Half ring

`variant="half"` draws the ring as a semicircle, which fits a short card.
`showInlineLabels` prints each slice's share next to the ring instead of leaving
it to the legend. Ordered categories read better on the `sequential` ramp than
on separate hues.

<ComponentPreview name="Charts-DonutHalf" csr="true" self-layout />

<!-- @include: ./DonutChart.api.md -->
