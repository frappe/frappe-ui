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
