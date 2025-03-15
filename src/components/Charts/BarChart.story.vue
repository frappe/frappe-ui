<script setup lang="ts">
import BarChart from './BarChart.vue'
import { BarChartConfig } from './types'

const salesData = [
  { month: 'Jan', sales: 200, profit: 50, returns: 20 },
  { month: 'Feb', sales: 300, profit: 80, returns: 25 },
  { month: 'Mar', sales: 250, profit: 60, returns: 15 },
  { month: 'Apr', sales: 350, profit: 90, returns: 30 },
  { month: 'May', sales: 400, profit: 100, returns: 35 },
]

const simpleConfig: BarChartConfig = {
  title: 'Monthly Sales',
  subtitle: 'Sales data for first half of the year',
  x: 'month',
  xType: 'category',
  series: [{ name: 'sales', type: 'bar' }],
  xAxisTitle: 'Month',
  yAxisTitle: 'Amount ($)',
}

const stackedConfig: BarChartConfig = {
  title: 'Sales, Profit, and Returns',
  subtitle: 'Monthly breakdown',
  x: 'month',
  xType: 'category',
  stacked: true,
  series: [
    { name: 'sales', type: 'bar' },
    { name: 'profit', type: 'bar' },
    { name: 'returns', type: 'bar' },
  ],
  xAxisTitle: 'Month',
  yAxisTitle: 'Amount ($)',
}

const horizontalConfig: BarChartConfig = {
  title: 'Monthly Sales - Horizontal',
  subtitle: 'Sales data presented horizontally',
  x: 'month',
  xType: 'category',
  series: [{ name: 'sales', type: 'bar' }],
  xAxisTitle: 'Amount ($)',
  yAxisTitle: 'Month',
  swapAxes: true,
}

const comboConfig: BarChartConfig = {
  title: 'Sales and Growth Rate',
  subtitle: 'Bar and line combination',
  x: 'month',
  xType: 'category',
  series: [
    { name: 'sales', type: 'bar' },
    { name: 'growth_rate', type: 'line', axis: 'y2' },
  ],
  xAxisTitle: 'Month',
  yAxisTitle: 'Sales ($)',
  y2AxisTitle: 'Growth Rate (%)',
}

const comboData = salesData.map((item) => ({
  ...item,
  growth_rate: Math.round(Math.random() * 30),
}))
</script>

<template>
  <Story :layout="{ type: 'grid', width: 800 }">
    <Variant title="Simple Bar Chart">
      <BarChart :data="salesData" :config="simpleConfig" />
    </Variant>
    <Variant title="Stacked Bar Chart">
      <BarChart :data="salesData" :config="stackedConfig" />
    </Variant>
    <Variant title="Bar and Line Combo">
      <BarChart :data="comboData" :config="comboConfig" />
    </Variant>
    <Variant title="Horizontal Bar Chart">
      <BarChart :data="salesData" :config="horizontalConfig" />
    </Variant>
  </Story>
</template>
