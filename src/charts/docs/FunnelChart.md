# FunnelChart

Stage-to-stage drop-off, drawn as plain SVG.

## Stages

One row per stage, drawn in row order. Percentages are each stage's share of the
first, which is what a funnel is read for. `format` runs on the counts.

<ComponentPreview name="Charts-FunnelStages" csr="true" self-layout />

## Counts and clicks

Turn the percentages off with `showPercentages: false` when the absolute counts
are the point. `select` reports the stage and its row.

<ComponentPreview name="Charts-FunnelDeals" csr="true" self-layout />

<!-- @include: ./FunnelChart.api.md -->
