<template>
  <ECharts :options="options" :error="error" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useAxisChartOptions from './axisChartOptions'
import ECharts from './ECharts.vue'
import { AxisChartConfig } from './types'

const props = defineProps<{ config: AxisChartConfig }>()

const error = ref('')
const options = computed(() => {
  try {
    return useAxisChartOptions(props.config)
  } catch (e: any) {
    error.value = e.message
    return {}
  }
})
</script>
