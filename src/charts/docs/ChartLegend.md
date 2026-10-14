# ChartLegend

The row of series names under a plot. Each entry shows a series name and its
color, and hides or shows the series when pressed.

```js
import { ChartLegend } from 'frappe-ui/charts'
```

It holds no state. `items` is its only input, and its two events report what
the user did. The chart that owns the series decides what to do. Put it in the
`#legend` slot of `ChartContainer`.

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

## Entries

One `ChartLegendItem` per series, in the order the series are drawn:

| Field | What it is |
| --- | --- |
| `name` | Series identity, i.e. what `change` and `highlight` report. |
| `label` | The name as it should read. |
| `color` | The color the series is drawn in. |
| `hidden` | Whether the series is hidden. |
| `hint` | A muted note after the label, e.g. a donut slice's share. |
| `value` | What the series adds up to. Ranks the entries that do not fit. |
| `formattedValue` | `value` as the series formats it, printed in the "+N more" list. |

A hidden entry keeps its place in the row and dims: the swatch fades and the
label turns gray. If the entry left the row, there would be no way to show the
series again.

## Many series

The legend takes one row at most. When every entry fits, the row shows them in
the order the series are drawn. When they do not, the row shows the entries
with the largest `value`, as many as fit, and then a "+N more" button. A legend
that wrapped would take the plot's height, and one that scrolled would hide
series names that most users never scroll to.

"+N more" opens a list of every entry, largest `value` first, each with its
`formattedValue`. Its rows toggle and highlight a series the way the entries on
the row do. Past 15 entries, the list has a search field.

Ranking is by size, so a large negative total ranks as high as a large positive
one. An entry with no `value` keeps its given place after the ranked ones, and
so does "Others". The built-in charts pass each series' total across the
chart, formatted the way the tooltip formats a value. `ScatterChart` passes
none, so its groups keep their order.

<ComponentPreview name="Charts-LineManySeries" csr="true" self-layout />

## Toggling

`change` emits the `name` of the pressed entry. Toggle that series in your own
hidden list and pass the new `items` back.

Every entry is a button. The visible text is the series label, but the
accessible name says what pressing it does ("Hide Signups" or "Show Signups").
`aria-pressed` holds the current state.

## Highlighting

`highlight` emits the `name` of the entry under the pointer or with focus, and
`null` when it leaves. Use it to emphasize that series in the plot and dim the
rest. It fires on both hover and focus, so keyboard users get the same effect as
mouse users.

<!-- @include: ./ChartLegend.api.md -->
