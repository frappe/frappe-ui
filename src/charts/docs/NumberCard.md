# NumberCard

Shows one number and how it changed since a comparison period.

## A number and its change

`negativeIsBetter` swaps the change colors for metrics like churn, where down is
good. `format` formats the value and the target. A `null` value shows the empty
state, because a missing number is not zero. The card shows the period it
compares against, but your app chooses that period, so put the control for it in
the `#caption` slot.

<ComponentPreview name="Charts-NumberKpis" csr="true" self-layout />

## Sparklines

`sparkline` adds a small trend line across the bottom of the card, with no
axes. `type` sets how it draws, as on other charts. `area` (the default) suits a
continuous value, `line` draws the line with no fill, and `bar` suits a value
counted per period.

<ComponentPreview name="Charts-NumberSparklines" csr="true" self-layout />

`color` sets the color of the number. Use it when the card stands for a series
drawn in that color elsewhere on the page. The storage card above uses the color
of its trend line. It works like `seriesConfig[key].color` for a series. It does
not change the rest of the card, and the change keeps the color that shows
whether the number went up or down.

## The title row

`#actions` goes at the end of the row and `#title-suffix` right after the title
text. Neither makes the row taller: both are centered on the title, so the
number does not move. The card's title is smaller than a chart's, and
`#title-suffix` uses the title's font size, so an icon sized in `em` is smaller
here than on a `ChartContainer`.

<!-- @include: ./NumberCard.api.md -->
