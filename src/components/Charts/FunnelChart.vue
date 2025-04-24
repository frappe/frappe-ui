<template>
  <ECharts :options="options" :error="error" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useFunnelChartOptions from './funnelChartOptions'
import ECharts from './ECharts.vue'
import { FunnelChartConfig } from './types'

const props = defineProps<{ config: FunnelChartConfig }>()

const error = ref('')
const options = computed(() => {
  try {
    return useFunnelChartOptions(props.config)
  } catch (e: any) {
    error.value = e.message
    return {}
  }
})
</script>
