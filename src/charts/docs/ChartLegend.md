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

A hidden entry keeps its place in the row and dims: the swatch fades and the
label turns gray. If the entry left the row, there would be no way to show the
series again.

The row wraps and never scrolls. It takes as many lines as it needs and the plot
gets shorter, which the chart's resize observer picks up. A scrolling legend
would hide series names that most users never scroll to.

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
