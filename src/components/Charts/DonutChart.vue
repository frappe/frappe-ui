<template>
  <ECharts :options="options" :error="error" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useDonutChartOptions from './donutChartOptions'
import ECharts from './ECharts.vue'
import { DonutChartConfig } from './types'

const props = defineProps<{ config: DonutChartConfig }>()

const error = ref('')
const options = computed(() => {
  try {
    return useDonutChartOptions(props.config)
  } catch (e: any) {
    error.value = e.message
    return {}
  }
})
</script>
