<script setup lang="ts">
// The file's "Heat map" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68047,
// 1356:68106, 1356:68481): the United States coloured by active users,
// and the companies' table heat map two cards wide.
import { computed } from 'vue'
import Card from '../components/Card.vue'
import HeatTable from '../components/HeatTable.vue'
import UsMap from '../components/UsMap.vue'
import {
  HEAT_COLUMNS,
  heatSteps,
  heatTable,
  qualitativeHeatSteps,
  divergingHeatSteps,
} from '../chartData'
import type { ChartTheme } from '../chartThemes'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors; themeId?: ChartTheme }>()
const ramp = computed(() => props.theme.colors('map'))
const heat = computed(() => props.theme.colors('heat'))
/**
 * where each cell's colour falls: Ocean's frame places its own, the Diverging
 * one its own, and Qualitative, Mist and Earthy share one hand
 */
const steps = computed(() =>
  props.themeId === 'diverging'
    ? divergingHeatSteps
    : props.themeId === undefined || props.themeId === 'ocean'
      ? heatSteps
      : qualitativeHeatSteps,
)
</script>

<template>
  <Card>
    <UsMap title="Map Graph" :colors="ramp" :t="theme.t" />
  </Card>
  <!-- The file draws the table as its own card: the 8px corner and the
       hairline are the table's, and there is no second frame around it
       (1356:68481 stands on the page beside the map card, not inside one).
       Beside, not beneath — it takes one column of the grid like every
       other card, so the row reads across. -->
  <div class="min-w-0">
    <HeatTable
      :rows="heatTable"
      :columns="HEAT_COLUMNS"
      :colors="heat"
      :steps="steps"
      :ink="theme.t('chart-inside-label')"
    />
  </div>
</template>
