# ProportionBar

One bar split into the parts that make up a total.

A single 100% stacked bar, also called a segmented bar. It is a ring unrolled,
and it fits where a ring does not: a strip a few pixels tall under a number,
splitting up the total above it. Use `DonutChart` when the breakdown fills the
card, and this when the breakdown sits under something else. It is drawn as
plain divs, with no echarts.

Three or four parts read at a glance. Past that the bar is still accurate, but
the legend is doing the work, and `DonutChart` or `BarChart` gives each part a
label of its own.

## Parts of a whole

`category` and `value` name the two columns the bar needs, the same pair
`DonutChart` takes. One row is one segment, and each segment is as wide as its
share of the total. `format` formats the numbers in the tooltip.

Rows draw in the order you pass them. They are not sorted by size, because a
breakdown is usually written in the order it is read, and sorting would break
that order.

<ComponentPreview name="Charts-ProportionTickets" csr="true" self-layout />

## Grouping the tail

`maxSegments` limits how many segments the bar draws, and "Others" counts as
one of them. So `maxSegments` of 4 draws three named segments plus "Others", as
in this example. It defaults to 6. If there are no more categories than the
limit, the bar draws them all with no "Others" segment. `select` reports the
data rows behind the segment, and for "Others" that is every grouped row.

A share too small to see is widened to a readable width, and the difference
comes off the wider segments. Without that, a part would show in the legend and
be missing from the bar, which reads as a bug. The `percent` in the tooltip and
on the `select` event is still the true share — only the drawn width changes.

<ComponentPreview name="Charts-ProportionStorage" csr="true" self-layout />

## Thickness

`size` is `sm`, 8px and the default, or `md`, 12px. Use `sm` for a bar under a
number or inside a table row, and `md` where the breakdown is what the card is
about.

The corner rounds with the thickness: `md` uses the same corner as a donut
slice, and `sm` uses a smaller one. A corner half the height would round each
segment into a capsule, and a row of capsules reads as separate objects instead
of one bar cut into parts.

Hovering a segment grows it and fades the others, the same pair `DonutChart`
uses on a slice. The legend does it too, so hovering a name finds its segment in
the bar.

<ComponentPreview name="Charts-ProportionSizes" csr="true" self-layout />

## Hiding a part

The legend switches parts off, and the remaining segments re-share the bar over
the visible total. Bind `v-model:hiddenSegments` to control that from your app,
or to keep what a reader hid across a reload. The last visible segment cannot be
hidden, because an empty bar reads as a failure to load.

```vue
<ProportionBar
  v-model:hiddenSegments="hidden"
  :data="ticketsByState"
  category="state"
  value="tickets"
/>
```

Each segment is a button. It takes focus, shows its tooltip there, and answers
Enter with `select`. Its accessible name carries the share as well as the value,
because the width is what a reader who can see the bar reads first.

<!-- @include: ./ProportionBar.api.md -->
