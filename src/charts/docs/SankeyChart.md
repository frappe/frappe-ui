# SankeyChart

Shows flow from one set of nodes to another, with one band for each row.

## Flow between two columns

`source`, `target` and `value` name the three columns a flow needs, so the data
has one row per band. The nodes are all distinct values from the source and
target columns. A node that is the target of one row and the source of another
sits between them, which is how you draw a flow with several stages. `select`
reports the data row of the band.

<ComponentPreview name="Charts-SankeySignups" csr="true" self-layout />

## Vertical flow

`vertical` makes the flow run downwards, which suits a tall card or a graph
with few stages. `format` formats every value the chart shows, on the node
labels and in the tooltip. `nodeAlign` sets where a node with no outgoing flow
sits: `justify` puts it at the far end, and `left` and `right` put it at that
end.

<ComponentPreview name="Charts-SankeySpend" csr="true" self-layout />

## Flow runs one way

A sankey places its nodes in columns, which only works if the flow never loops
back. A row whose target already flows into its source (including a node linked
to itself) has no column to go in, so it is dropped, with a warning in
development. Group the data into stages before you plot it.

<!-- @include: ./SankeyChart.api.md -->
