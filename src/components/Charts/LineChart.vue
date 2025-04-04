<template>
  <ECharts :options="options" :error="error" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useLineChartOptions from './lineChartOptions';
import ECharts from './ECharts.vue'
import { LineChartConfig } from './types'

const props = defineProps<{
  data: Record<string, any>[]
  config: LineChartConfig
}>()

const error = ref('')
const options = computed(() => {
  try {
    return useLineChartOptions(props.config, props.data)
  } catch (e: any) {
    error.value = e.message
    return {}
  }
})
</script>
