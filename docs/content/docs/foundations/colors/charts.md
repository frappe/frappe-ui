---
outline: false
---

<script setup>
import ChartColorsPage from '@/components/foundations/ChartColorsPage.vue'
</script>

# Chart Colors

Three ramps every chart draws from. They ship with `frappe-ui/charts` as
`--chart-*` custom properties, and each has a dark counterpart that keeps a
series' hue identity across a theme flip.

Pick a ramp per chart with `palette`, or hand it an explicit list of colors.
Redefine the tokens in your own CSS to rebrand every chart at once.

<ChartColorsPage />

## Plot-area variables

Four more `--chart-*` properties paint the plot area. They are the family's
whole CSS-variable contract: every other color a chart draws in comes from a
semantic token or from a ramp above. Redefine one on any ancestor and the charts
in that subtree follow.

| Variable               | Paints                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| `--chart-gridline`     | The horizontal gridlines and the category baseline.               |
| `--chart-axis-line`    | The line the axis pointer draws under the cursor, one step firmer. |
| `--chart-inside-label` | Ink for a label printed on a fill rather than beside it.          |
| `--chart-backdrop`     | The surface behind the plot. Unset by default, and read off the page. |

The first three have a dark counterpart, so a subtree that redefines them should
redefine both. `--chart-backdrop` is the override for a chart drawn on something
the walk up the tree cannot see, an image say.
