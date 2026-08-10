# ChartContainer

Everything around the plot: the title block, the value-axis titles, the three
states and the legend row. Every built-in chart is a plot inside this container,
so a plot you draw yourself reads the same way on the same dashboard.

```js
import { ChartContainer } from 'frappe-ui/charts'
```

The default slot is the plot. The container gives it the space the chrome does
not take, and lays the rest out around it.

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

## The title block

`title` names the chart and `subtitle` captions it. The row is only drawn when
one of them is set, or when something fills `#actions`.

`#actions` sits at the end of that row, opposite the title — for a period
picker, a menu, or a link to the records behind the chart. It keeps its width
and the title truncates, because a control that shrinks stops being pressable
while a name that shortens still reads.

## Value-axis titles

`plotLabel` titles the primary value axis and `plotLabelSecondary` the second
one. They are drawn as a row over the plot rather than as echarts axis names: an
axis name inside the plot has to be rotated to fit, and a rotated name is read
last.

Each title sits over the edge its axis is drawn on, so the row mirrors with the
plot in RTL. `plotLabelPlacement` moves the row: `'top'` by default, `'bottom'`
for a chart whose value axis runs along the bottom. A horizontal `BarChart` sets
`'bottom'` for that reason, and pins the titles to the far end — the near end of
a row chart is the category-label column, where a title would read as a heading
for it.

The titles are hidden in every state but `ready`. A title heading a plot that is
not drawn names nothing.

## States

`loading`, `error` and `empty` switch the container between four states, in that
order of precedence: a non-empty `error` wins over `loading`, and `loading` wins
over `empty`.

The plot stays mounted through all four. Unmounting it would dispose the echarts
instance and pay to build it again on the way back, so it is hidden instead.

Each state has a slot that replaces what it draws — `#loading`, `#error` and
`#empty`. `#error` carries the message as a slot prop, so a retry button can sit
beside it. The loading placeholder gets the whole plot box rather than a row in
the middle of it: a dashboard fills in a card at a time, and a block holding the
grid's shape reads as one card arriving. See [States](/docs/charts/states).

## The legend

`#legend` is a row under the plot. Put [`ChartLegend`](/docs/charts/chartlegend)
in it. When nothing fills it, the plot keeps the space the row would have taken,
so a one-series chart sits in its card the way a multi-series one does.

## Direction

`dir` forces the layout direction to `'ltr'` or `'rtl'`. It defaults to
`document.documentElement.dir`.

<!-- @include: ./ChartContainer.api.md -->
