# ChartCard

The card a chart sits in. Use it around a plot you draw yourself, so it gets
the same border, background, radius and padding as the built-in charts.

```js
import { ChartCard } from 'frappe-ui/charts'
```

It is a box with one slot. Give it a height: a chart fills the box it is in,
so a box with no height shows nothing.

## Removing the card style

`card` draws the border, background, radius and padding, and is on by default.
Set it to `false` when the chart is already inside a card of your own, so you do
not get a box inside a box. `NumberCard` takes the same prop.

The box stays `relative` and clips its content whatever `card` is set to,
because the plot draws inside the box and relies on it for layout.

## Direction

`dir` sets the layout direction to `'ltr'` or `'rtl'`. It defaults to
`document.documentElement.dir` and follows changes to it, so an app that sets
the direction on the root element does not need this prop.

<ComponentPreview name="Charts-CustomRadar" csr="true" self-layout />

The preview draws a radar chart, which the library does not include, inside `ChartCard`,
`ChartContainer` and `ChartLegend`. See
[Custom charts](/docs/charts/overview#custom-charts).

<!-- @include: ./ChartCard.api.md -->
