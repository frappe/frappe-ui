# NumberCard

One reading with the change against a comparison period. `negativeIsBetter`
flips the delta colors for metrics like churn, `compact` shortens the value, and
a `null` value renders the empty state — a KPI with no number is not a zero. The
card states the period it compares against; choosing it is the app's business,
so that control goes in the `#caption` slot.

<ComponentPreview name="Charts-NumberKpis" csr="true" self-layout />

`sparkline` adds a trend across the bottom of the card: shape only, with no axes
to read against. `line` suits a continuous reading, `bar` one the reader counts
in periods.

<ComponentPreview name="Charts-NumberSparklines" csr="true" self-layout />

<!-- @include: ./NumberCard.api.md -->
