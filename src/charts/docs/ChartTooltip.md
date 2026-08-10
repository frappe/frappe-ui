# ChartTooltip

The reading beside the pointer. HTML rather than a canvas overlay, so it takes
the app's type, colors and elevation, and a slot can replace what it says.

```js
import { ChartTooltip } from 'frappe-ui/charts'
```

Every built-in chart draws this one. Reach for it directly when you draw the
plot yourself; on a built-in chart, the `#tooltip` slot hands you the same
content to override.

<ComponentPreview name="Charts-TooltipCustom" csr="true" self-layout />

## Driving it

The tooltip has no pointer of its own. The plot tells it what to show and where:

- `open` shows it. It draws nothing while `open` is false, and nothing when
  `items` is empty — a tooltip with no rows is a box with a heading.
- `x` and `y` are viewport coordinates, i.e. `clientX` and `clientY`.
- `label` heads the rows, e.g. the category or the date the pointer is over.
- `items` are the rows.
- `dir` forces the layout direction. It defaults to
  `document.documentElement.dir`.

## Rows

One `ChartTooltipItem` per reading:

| Field | What it is |
| --- | --- |
| `name` | Series identity. |
| `label` | The series name as it should read. |
| `color` | The color the series is drawn in, shown as a swatch. |
| `value` | The number behind the reading. |
| `formattedValue` | That number as it should print, e.g. through `format`. |
| `percent` | Share of the total, printed after the value. Part-to-whole charts only. |

`formattedValue` is what the tooltip prints. `value` is there for a slot that
wants to do its own arithmetic.

## Placement

The tooltip is teleported out of the chart and positioned against the viewport,
so a card that clips its content cannot clip the tooltip.

It sits 12px past the pointer, and flips to the other side of it when that would
run off the right edge or the bottom. Whatever is left is clamped to 4px inside
the window, so a tooltip near a corner still fits.

The size is measured after render rather than estimated, because slot content is
the app's and its size is not knowable up front. The tooltip stays hidden for
the frame that measurement takes, so it never paints at the previous point
first.

## Replacing the content

The default slot takes over the whole body, with `label` and `items` as slot
props. Use it for a reading the rows cannot carry — a sparkline, a second
measure, a link to the records behind the point.

```vue
<ChartTooltip :open="open" :x="x" :y="y" :label="label" :items="items">
  <template #default="{ label, items }">
    <div class="text-p-sm text-ink-gray-5">{{ label }}</div>
    <div v-for="item in items" :key="item.name" class="text-p-sm">
      {{ item.label }} — {{ item.formattedValue }}
    </div>
  </template>
</ChartTooltip>
```

<!-- @include: ./ChartTooltip.api.md -->
