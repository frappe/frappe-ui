# FunnelChart

Stage-to-stage drop-off, drawn as plain SVG.

## Stages

One row per stage, drawn in row order. Each stage prints its count and its share
of the first stage, which is what a funnel is read for. The first stage prints no
share: it has nothing to convert from. `format` runs on the counts.

The tooltip adds the share of the preceding stage wherever that is a different
number, so the drop-off at one step reads without arithmetic.

<ComponentPreview name="Charts-FunnelStages" csr="true" self-layout />

## Clicks

`select` reports the stage and its row.

<ComponentPreview name="Charts-FunnelDeals" csr="true" self-layout />

<!-- @include: ./FunnelChart.api.md -->
