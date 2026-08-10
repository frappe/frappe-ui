# DonutChart

A ring that reads as share of a total.

## Share of a total

`category` and `value` name the two columns a ring needs. The middle prints the
total, captioned by `centerLabel`. Hovering a slice swaps the readout to that
slice's value, name and share.

`format` runs on the numbers the readout and the tooltip print. The inline slice
labels are shares, not values, so `format` does not reach them.

<ComponentPreview name="Charts-DonutShare" csr="true" self-layout />

## Grouping the tail

`maxSlices` caps how many arcs the ring draws, and "Others" takes one of those
slots. So `maxSlices` of 4 draws three named slices plus "Others", as this
example does. A ring with no more categories than the cap draws them all and no
"Others" slice. `select` carries the rows behind the slice — every grouped
row, for "Others".

<ComponentPreview name="Charts-DonutOthers" csr="true" self-layout />

## Half ring

`variant="half"` draws the ring as a semicircle, which fits a short card.
Ordered categories read better on the `sequential` ramp than on separate hues.

`showInlineLabels` prints each slice's name and share next to the ring, and it
takes the center readout away — the labels are already on the arcs, and a total
in the hole would repeat what they add up to. `centerLabel` and `format` have
nothing to caption while it is on. The legend still draws below the plot, and
each entry still carries its slice's share.

<ComponentPreview name="Charts-DonutHalf" csr="true" self-layout />

<!-- @include: ./DonutChart.api.md -->
