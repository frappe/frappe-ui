---
# The preview on this page is `wide`, which needs the OnThisPage aside gone.
outline: false
---

# States

Every chart has the same loading, error and empty states. Set `loading` while
the query runs. Set `error` to a message when it fails. Pass no rows and the
chart shows that it has nothing to draw. Charts have no `empty` prop: the empty
state comes from the data. Rows that draw nothing also count as empty: a
column key that no row has, a column with no numeric values, or every series
hidden in the legend.

The states are drawn by the chart card, so a loading donut and a loading
heatmap look the same. A loading chart shows a placeholder the size of its plot,
not a spinner. While a dashboard loads, each card keeps its shape in the grid,
instead of showing many spinners. `NumberCard` has no plot and shows a
placeholder for its number the same way. `dir` sets the layout direction. It
defaults to `document.documentElement.dir`.

<ComponentPreview name="Charts-States" csr="true" wide self-layout />

## Replacing a state

Each state is a slot on every chart: `#loading`, `#error` and `#empty`. When
you replace one, the card, title and legend stay in place. So you can add a
retry button next to an error message without building your own card. `#error`
gets the message as a slot prop.

<ComponentPreview name="Charts-StatesRecovery" csr="true" wide self-layout />

`#loading` replaces the whole placeholder, so you can draw a placeholder that
matches your card's shape. Use it only when the default placeholder does not
fit the card. The default keeps all cards on a dashboard loading the same way.
