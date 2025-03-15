<template>
  <ECharts :options="options" :error="error" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useBarChartOptions from './barChartOptions'
import ECharts from './ECharts.vue'
import { BarChartConfig } from './types'

const props = defineProps<{
  data: Record<string, any>[]
  config: BarChartConfig
}>()

const error = ref('')
const options = computed(() => {
  try {
    return useBarChartOptions(props.config, props.data)
  } catch (e: any) {
    error.value = e.message
    return {}
  }
})
</script>
