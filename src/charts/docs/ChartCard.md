# ChartCard

The card surface a chart sits on. One panel among the panels an app puts on a
page, so a plot you draw yourself takes the same border, background, radius and
padding as the built-in charts beside it.

```js
import { ChartCard } from 'frappe-ui/charts'
```

It is a box with one slot. Give it a height — a chart fills the box it is given,
and a box with no height has none to fill.

## Dropping the surface

`card` draws the surface and is on by default. Set it to `false` for a chart the
app has already placed inside a card of its own: the content renders with no
border, background, radius or padding, so one bordered box does not nest in
another. `NumberCard` takes the same prop for the same reason.

The box stays `relative` and clipping whatever `card` says. That part is
structure: a plot draws inside the box and expects the box to hold it.

## Direction

`dir` forces the layout direction to `'ltr'` or `'rtl'`. It defaults to
`document.documentElement.dir`, so an app that sets the direction once at the
root needs nothing here.

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

The preview draws a radar plot the library does not ship, inside `ChartCard`,
`ChartContainer` and `ChartLegend`. See
[Custom charts](/docs/charts/overview#custom-charts).

<!-- @include: ./ChartCard.api.md -->
