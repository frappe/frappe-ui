# ChartLegend

The row of series names under a plot. Each entry names one mark, shows the color
it is drawn in, and switches it out of the chart when pressed.

```js
import { ChartLegend } from 'frappe-ui/charts'
```

It holds no state. `items` is the whole input, and the two emits report what the
reader did — the chart that owns the series decides what happens next. Put it in
`ChartContainer`'s `#legend` slot.

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

## Entries

One `ChartLegendItem` per series, in the order the series are drawn:

| Field | What it is |
| --- | --- |
| `name` | Series identity, i.e. what `change` and `highlight` report. |
| `label` | The name as it should read. |
| `color` | The color the series is drawn in. |
| `hidden` | Whether the series is out of the chart right now. |
| `hint` | A muted note after the label, e.g. a donut slice's share. |

A hidden entry keeps its place in the row and dims: the swatch fades and the
label grays. A series that left the row would take its own way back with it.

The row wraps and never scrolls. It takes the lines it needs and the plot gives
up the height, which the chart's resize observer picks up. A legend that scrolls
hides series names behind a gesture nobody makes.

## Toggling

`change` carries the `name` of the entry that was pressed. Flip that series in
your own hidden list and pass the new `items` back.

Every entry is a button. The visible text is the series label, but the
accessible name says what the press does — "Hide Signups", "Show Signups" —
because a toggle state alone does not read as an action. `aria-pressed` carries
the state itself.

## Highlighting

`highlight` carries the `name` under the pointer or the focus ring, and `null`
when it leaves. Use it to raise that series in the plot and mute the rest. It
fires on hover and on focus alike, so a reader on the keyboard gets the same
reading as one on a mouse.

<!-- @include: ./ChartLegend.api.md -->
