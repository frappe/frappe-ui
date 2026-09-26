# ProportionBar

A breakdown as one bar: parts of a whole, side by side.

A single 100% stacked bar — a segmented bar, in the other common name. It is the
ring unrolled, and it is what fits where a ring does not: a strip a few pixels
tall at the foot of a card that is mostly a number, beside the total it breaks
down. Reach for `DonutChart` when the breakdown is the card; reach for this when
the breakdown is a footnote to a reading.

Three or four parts read at a glance. Past that the bar is still honest but the
legend is doing the work, and a `DonutChart` or a `BarChart` gives each part a
label of its own.

## Parts of a whole

One row per part, drawn in row order — a breakdown is usually written in the
order it is read, and sorting it by size would break a sequence the caller built
on purpose. Each segment is sized by its share of the total, and `format` runs
on the values.

<ComponentPreview name="Charts-ProportionTickets" csr="true" self-layout />

## Capping the tail

`maxSegments` keeps the largest parts and sums the rest into "Others", named
`OTHERS_KEY`. It defaults to 6: a track a few hundred pixels wide runs out of
readable width long before the palette runs out of hues. `select` reports the
segment and every row behind it, so the tail can be drilled into as well.

A share too small to see is widened to a floor, and the difference comes off the
segments above it — a part that is in the legend but nowhere in the bar reads as
a bug. `percent` on the event and in the tooltip is the true share; only the
drawn width moves.

<ComponentPreview name="Charts-ProportionStorage" csr="true" self-layout />

## Thickness

Two sizes, because the bar is read two ways. `sm`, the default, is 8px — a
strip under the number it breaks down. `md` is 12px, for a card whose subject
is the breakdown itself.

The corner follows the thickness: `md` carries the donut's own, and `sm` steps
it back. One corner across both would round the thinner one into capsules, and
a row of capsules reads as separate objects rather than as one track cut into
parts.

Segments are separated by 3px, whatever the size — the ring's gap is an angle
rather than a distance, and 3px is what it comes to on a normally sized ring.

Pointing at a segment grows it and steps the others back, the same pair the ring
uses to emphasise a slice. The legend does it too, so hovering a name finds its
block in the bar.

<ComponentPreview name="Charts-ProportionSizes" csr="true" self-layout />

## Hiding a part

The legend switches parts off, and the rest re-percentage over the visible
total. Bind `v-model:hiddenSegments` to drive that from the app, or to keep what
a reader hid across a reload. The last visible segment cannot be hidden — an
empty bar reads as a failure to load.

```vue
<ProportionBar
  v-model:hiddenSegments="hidden"
  :data="thisCycle"
  category="part"
  value="amount"
/>
```

Each segment is a button: it takes focus, opens its tooltip there, and answers
Enter with `select`. Its accessible name carries the share as well as the value,
because the width is the whole point of the bar.

<!-- @include: ./ProportionBar.api.md -->
