# NumberCard

One reading, with the change against a comparison period.

## A reading and its change

`negativeIsBetter` flips the delta colors for metrics like churn, `compact`
shortens the value, and a `null` value renders the empty state — a KPI with no
number is not a zero. The card states the period it compares against; choosing
it is the app's business, so that control goes in the `#caption` slot.

<ComponentPreview name="Charts-NumberKpis" csr="true" self-layout />

## Sparklines

`sparkline` adds a trend across the bottom of the card: shape only, with no axes
to read against. `line` suits a continuous reading, `bar` one the reader counts
in periods.

<ComponentPreview name="Charts-NumberSparklines" csr="true" self-layout />

`color` prints the reading in an ink you name, for a card standing for a series
that is drawn in that color elsewhere on the page — the storage card above is
printed in the color of the trend under it. It is one color for one mark, the
way `seriesConfig[key].color` names a series' own. It does not restyle the card,
and the delta keeps the tone that says which way the number moved.

<!-- @include: ./NumberCard.api.md -->
