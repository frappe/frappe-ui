# Charts

Seven chart components under the `frappe-ui/charts` subpath, drawn with
[echarts](https://echarts.apache.org). Props are flat and name the columns of
your data — `x`, `y`, `series`, `category`, `value` — so a saved or serialized
chart is one typed object spread with `v-bind="savedChart"`.

```js
import { BarChart, LineChart } from 'frappe-ui/charts'
import 'frappe-ui/charts-style.css'
```

The stylesheet carries the `--chart-*` color tokens. See
[Chart Colors](/docs/foundations/colors/charts) for the three ramps and how to
rebrand them. `palette` picks a ramp by name — `categorical`, `sequential` or
`diverging` — or takes an explicit list of colors.

Each component registers only the echarts modules it draws, so a page with one
BarChart pays for bars and nothing else.

## Data shapes

The axis charts read either shape of the same data. Wide data keeps one column
per series, so `y` lists the columns to draw. Long data keeps one row per point,
so `y` names the single value column and `series` names the column that splits
the rows apart. Pick whichever shape your query already returns.

## The charts

- [BarChart](/docs/charts/bar-chart) — grouped, stacked and horizontal bars
- [LineChart](/docs/charts/line-chart) — trends, a second value axis, gaps
- [AreaChart](/docs/charts/area-chart) — the line family with a fill
- [DonutChart](/docs/charts/donut-chart) — share of a total
- [FunnelChart](/docs/charts/funnel-chart) — stage-to-stage drop-off
- [HeatmapChart](/docs/charts/heatmap-chart) — magnitude across two dimensions
- [NumberCard](/docs/charts/number-card) — one reading, with its change

Every chart shares the same
[loading, error and empty states](/docs/charts/states), and they compose into a
[dashboard](/docs/charts/dashboard) without extra chrome.
