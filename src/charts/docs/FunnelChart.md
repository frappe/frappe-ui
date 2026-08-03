# FunnelChart

One row per stage, drawn in row order. Plain SVG, no echarts. Percentages are
each stage's share of the first, which is what a funnel is read for.

<ComponentPreview name="Charts-FunnelStages" csr="true" self-layout />

Turn them off with `showPercentages: false` when the absolute counts are the
point. `stageClick` reports the stage and its row.

<ComponentPreview name="Charts-FunnelDeals" csr="true" self-layout />

<!-- @include: ./FunnelChart.api.md -->
