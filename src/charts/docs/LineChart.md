# LineChart

Lines for a value that changes over time.

## Trends

Two series on a time axis, with the comparison series dashed. Use `dashed` for
a projection, or for a comparison that was not measured like the rest.

`dashed`, `smooth`, `showDataPoints`, `connectNulls` and `showDataLabels` are
chart props and `seriesConfig` keys both. The chart-level value is every
series' default, and a `seriesConfig` entry overrides it for one series, on or
off. The chart prop is the only way to set every series of a `splitBy` chart,
because the data names those series, not you.

<ComponentPreview name="Charts-LineTrend" csr="true" self-layout />

## A numeric x axis

`xAxis.type: 'value'` treats the x column as numbers on a scale. Each point sits
at its own value, so points at 5 and 60 are spaced by the difference, and rows
draw in numeric order whatever order they come in.

The default is `'category'`, which gives every row equal space. A column of
dates becomes `'time'` automatically, but a column of numbers never becomes a
scale on its own, because category columns often hold numbers. A horizontal
`BarChart` ignores this setting, because each bar's size comes from its slot.
`horizontal` is a `BarChart` prop; a line chart does not have it.

<ComponentPreview name="Charts-LineNumericAxis" csr="true" self-layout />

## A second value axis

`y2` names the value columns to measure against a second value axis, drawn on
the opposite side. Use it for a measure in another unit, like a rate next to
dollars. Set `y2Axis.min` and `max` to fix that scale, so the line shows how far
it is over or under plan instead of its own trend. The axis is drawn only when
`y2` names a column.

<ComponentPreview name="Charts-LineDualAxis" csr="true" self-layout />

`y` and `y2` form one list, in order: every `y` column draws and takes its
color first, then every `y2` column. The three column props pair with the three
axis options (`x`/`xAxis`, `y`/`yAxis`, `y2`/`y2Axis`), and a series uses the
scale of the prop that names it. A `y2` series draws with the component's
default type, and `seriesConfig[key].type` can change it like any other series.

`splitBy` splits `y` only. A `y2` column has one value per category, not per
group, so it draws as one series next to the ones `splitBy` creates, and
`maxSeries` limits only those.

## Filling one series

`seriesConfig[key].type` sets how one series draws. Set `type: 'area'` to fill
one line of a `LineChart` while the rest stay unfilled. There is no separate
fill prop, because an area is a filled line. The same key takes `'bar'`, for a
combo chart.

<ComponentPreview name="Charts-LineFilledSeries" csr="true" self-layout />

## Targets and thresholds

`referenceLines` draws a line across the plot at a fixed value. `axis` sets
which axis `value` belongs to: `'y'` (the default) or `'y2'` for a horizontal
line at a value, `'x'` for a vertical line at a category, a date, or a number on
a numeric x axis. Each line also takes an optional `label`, `color`
and `dashed`.

`labelPlacement` moves the label when it covers something. See
[BarChart](/docs/charts/barchart#targets-and-thresholds).

<ComponentPreview name="Charts-LineThresholds" csr="true" self-layout />

A reference line is not a series. It has no legend entry, never shows in the
tooltip, and cannot be hidden, so a threshold always stays visible for
comparison. A line outside the plotted range is not drawn, because stretching
the scale to fit a distant target would flatten the data. Set `yAxis.min` or
`max` instead.

## Context in the tooltip

`tooltipColumns` names columns that show only in the tooltip. They get no
mark, no legend entry, no color and no place on the value axis. Use it for a
number that does not belong on the same scale, such as the order count behind
a conversion rate.

```vue
<LineChart
  :data="data"
  x="month"
  :y="['conversion_rate']"
  :tooltip-columns="[{ name: 'orders', label: 'Orders' }]"
/>
```

<ComponentPreview name="Charts-LineTooltipColumns" csr="true" self-layout />

Columns print after the series rows, in the order given. They are not sorted
by value, because a value in another unit cannot be compared with the series.

`name` is the row key. `label` defaults to it, and `format` formats the value.
A column of text prints as is.

For a custom tooltip, read `rows` from the `tooltip` slot instead.

```vue
<LineChart :data="data" x="month" y="conversion_rate">
  <template #tooltip="{ rows }">{{ rows[0].orders }} orders</template>
</LineChart>
```

## Hiding a series

A chart with more than one series draws a legend under the plot. Press an entry
to hide that line, or bind `v-model:hiddenSeries` to control that list
yourself. See
[BarChart](/docs/charts/barchart#hiding-a-series).

## Gaps

Null values break the line, so a gap in the data shows as a gap.
`connectNulls` joins the line across them instead, on every series or on one
series through `seriesConfig`.

<ComponentPreview name="Charts-LineGaps" csr="true" self-layout />

<!-- @include: ./LineChart.api.md -->
