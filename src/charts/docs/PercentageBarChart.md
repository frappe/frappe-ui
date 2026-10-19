# PercentageBarChart

A bar that shows each category's share of a total.

It is the ring of `DonutChart` unrolled, for a strip under a number. It draws plain divs, with no echarts, so a chart ref hands back nothing.

## Share of a total

`category` and `value` name the two columns the bar needs, the same two as `DonutChart`. Each slice is as wide as its share of the total, and the biggest slice comes first. Hovering a slice shows its value, name and share.

`format` formats the values in the tooltip and the legend. The shares are whole numbers that add up to 100.

<ComponentPreview name="Charts-PercentageTickets" csr="true" self-layout />

## Grouping the tail

`maxSlices` limits how many slices the bar draws, and "Others" counts as one of them. So `maxSlices` of 4 draws three named slices plus "Others", as in this example. It defaults to 9, as on `DonutChart`, so a breakdown is cut into the same slices on either chart. If there are no more categories than the limit, the bar draws them all with no "Others" slice. `select` reports the data rows behind the slice, and for "Others" that is every grouped row.

<ComponentPreview name="Charts-PercentageStorage" csr="true" self-layout />

## Pinning a color

`colors` pins a color to a category, so a slice keeps its meaning whatever its size. Key it by the category value, and by `OTHERS_KEY` for "Others". A category grouped into "Others" takes that slice's color. The other slices keep the palette colors they would have had. A color can be a CSS variable, such as `var(--ink-red-5)`.

```vue
<PercentageBarChart
  :data="invoices"
  category="status"
  value="count"
  :colors="{ Overdue: 'var(--ink-red-5)', Paid: 'var(--ink-green-5)' }"
/>
```

## Hiding slices

`v-model:hiddenSlices` works as on `DonutChart`. Bind it to hide slices from your own code, or to keep hidden slices after a reload. When it is not bound, the legend manages the list. The remaining slices share the whole bar.

<!-- @include: ./PercentageBarChart.api.md -->
