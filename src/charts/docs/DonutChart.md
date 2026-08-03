# DonutChart

`category` and `value` name the two columns a ring needs. The middle prints the
total, captioned by `centerLabel`, and `format` runs on every value the chart
prints.

<ComponentPreview name="Charts-DonutShare" csr="true" self-layout />

Slices past `maxSlices` are summed into a single "Others" slice. `sliceClick`
carries the rows behind the slice — every grouped row, for "Others".

<ComponentPreview name="Charts-DonutOthers" csr="true" self-layout />

`variant="half"` draws the ring as a semicircle; only the geometry changes.
`showInlineLabels` prints each slice's share next to the ring instead of leaving
it to the legend.

<ComponentPreview name="Charts-DonutHalf" csr="true" self-layout />

<!-- @include: ./DonutChart.api.md -->
