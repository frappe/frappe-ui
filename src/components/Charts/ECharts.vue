<script setup lang="ts">
import { EChartsOption, init } from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import debounce from '../../utils/debounce'

const props = defineProps<{
  options: EChartsOption
  events?: {
    click: (params: any) => void
  }
  error?: string
}>()

let chart: echarts.ECharts
const chartDiv = ref<HTMLDivElement>()

onMounted(() => {
  if (!chartDiv.value) return

  chart = init(chartDiv.value, 'light', { renderer: 'svg' })
  chart.setOption({ ...props.options }, true)

  if (props.events?.click) {
    chart.on('click', props.events.click)
  }

  const resizeDebounce = debounce(() => {
    chart.resize({
      animation: {
        duration: 300,
      },
    })
  }, 250)

  let resizeObserver = new ResizeObserver(resizeDebounce)
  setTimeout(() => resizeObserver.observe(chartDiv.value!), 500)
  onBeforeUnmount(() => resizeObserver.unobserve(chartDiv.value!))
})

watch(
  () => props.options,
  (newOptions) => {
    if (chart) {
      chart.setOption(newOptions, true)
    }
  },
  { deep: true },
)
</script>

<template>
  <div
    ref="chartDiv"
    v-show="!error"
    class="h-full w-full min-w-[300px] md:min-w-[400px] min-h-[300px] px-4 py-2"
  ></div>
  <div
    v-show="error"
    class="flex h-full w-full items-center justify-center text-center text-red-500"
  >
    Error: {{ error }}
  </div>
</template>
