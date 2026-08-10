# SankeyChart

A flow from one set of nodes to another, a band per row.

## Flow between two columns

`source`, `target` and `value` name the three columns a flow needs, so the data
is one row per band. The nodes are the de-duplicated union of the source and
target columns: a node that a row sends flow to and another row sends flow from
sits between the two, which is how a multi-stage flow is drawn. `select`
carries the row behind the band.

<ComponentPreview name="Charts-SankeySignups" csr="true" self-layout />

## Vertical flow

`orient="vertical"` turns the flow downwards, which suits a tall card or a graph
with few stages. `format` prints every value the chart shows, on the node labels
and in the tooltip alike. `nodeAlign` decides where a node with nothing leaving
it sits: `justify` pushes it to the far end, `left` and `right` pin it to the
end they name.

<ComponentPreview name="Charts-SankeySpend" csr="true" self-layout />

## Flow runs one way

A sankey lays its nodes out in columns, which only exists if the flow never
comes back on itself. A row whose target already flows into its source — a node
linked to itself included — has no column to go in, so it is dropped with a
warning in development. Aggregate the data into stages before plotting it.

<!-- @include: ./SankeyChart.api.md -->
