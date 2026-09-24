# FunnelChart

Shows drop-off from one stage to the next. Drawn as plain SVG.

## Stages

One row per stage, drawn in row order. Each stage shows its count and its share
of the first stage. The first stage shows no share, because there is no stage
before it. `format` formats the counts.

When the share of the previous stage is a different number, the tooltip shows it
too, so you can see the drop-off at each step without doing the math. Both rates
reach the `tooltip` slot as `'context'` items, named `ofFirst` and `ofPrevious`.

<ComponentPreview name="Charts-FunnelStages" csr="true" self-layout />

## Clicks

`select` reports the stage, its value and its row. `name` is the category value and `label` is the printed text.

<ComponentPreview name="Charts-FunnelDeals" csr="true" self-layout />

<!-- @include: ./FunnelChart.api.md -->
