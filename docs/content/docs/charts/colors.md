<script setup>
import ChartColorsPage from '@/components/foundations/ChartColorsPage.vue'
</script>

# Chart colors

Charts draw from three color ramps. Each is a set of `--chart-*` CSS
variables that ships with `frappe-ui/charts` and has a dark theme value.

<ChartColorsPage />

## Usage

### Picking a ramp

Pass a ramp name to `palette`, or a list of colors:

```vue
<BarChart :data="data" x="month" :y="['won', 'lost']" palette="categorical" />
<BarChart :data="data" x="month" :y="['won', 'lost']" :palette="['#2563eb', '#dc2626']" />
```

### Changing the colors

Set the variables in your own CSS to change every chart at once:

```css
:root {
  --chart-categorical-1: oklch(0.55 0.2 260);
}
```

### Plot area

Four more variables color the plot area. Set one on any parent element to
change the charts inside it.

| Variable | Colors |
| --- | --- |
| `--chart-gridline` | The gridlines and the category axis line |
| `--chart-axis-line` | The line under the cursor |
| `--chart-inside-label` | Labels drawn on top of a bar or slice |
| `--chart-backdrop` | The background behind the plot, such as the gaps between heatmap cells. Unset by default: the chart uses the background of the nearest parent that has one. |

`--chart-gridline` and `--chart-axis-line` have a separate dark theme value,
so set them under `[data-theme='dark']` too. Set `--chart-backdrop` when the
chart sits on something it can't read a color from, such as an image.
