<script setup lang="ts">
// The file's "Heat map" row (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68047,
// 1356:68106, 1356:68481): the United States coloured by active users,
// and the companies' table heat map two cards wide.
import { computed } from 'vue'
import Card from '../components/Card.vue'
import HeatTable from '../components/HeatTable.vue'
import UsMap from '../components/UsMap.vue'
import { HEAT_COLUMNS, heatTable } from '../chartData'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()
const ramp = computed(() => props.theme.colors('map'))
const heat = computed(() => props.theme.colors('heat'))
</script>

<template>
  <Card>
    <UsMap title="Map Graph" :colors="ramp" :t="theme.t" />
  </Card>
  <Card wide>
    <HeatTable
      :rows="heatTable"
      :columns="HEAT_COLUMNS"
      :colors="heat"
      :ink="theme.t('ink-gray-8')"
    />
  </Card>
</template>
