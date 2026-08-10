<script setup lang="ts">
import { LineChart } from 'frappe-ui/charts'
import type { LineChartProps } from 'frappe-ui/charts'

// The discounts pricing actually ran, which is not an even ladder: the last two
// are where the curve flattens out, and they are the reason to read the scale.
const byDiscount = [
  { discount: 0, conversion: 2.1 },
  { discount: 5, conversion: 3.4 },
  { discount: 10, conversion: 4.6 },
  { discount: 15, conversion: 5.1 },
  { discount: 40, conversion: 6.0 },
  { discount: 60, conversion: 6.2 },
]

const conversion: LineChartProps = {
  data: byDiscount,
  x: 'discount',
  y: 'conversion',
  xAxis: { title: 'Discount (%)' },
  yAxis: { title: 'Conversion (%)' },
  seriesConfig: { conversion: { label: 'Conversion', showDataPoints: true } },
}
</script>

<template>
  <div class="grid w-full gap-4 sm:grid-cols-2">
    <div class="h-72">
      <LineChart
        v-bind="conversion"
        title="Conversion by discount"
        subtitle="Discounts as categories"
      />
    </div>
    <div class="h-72">
      <LineChart
        v-bind="conversion"
        :x-axis="{ title: 'Discount (%)', type: 'value' }"
        title="Conversion by discount"
        subtitle="Discounts on a numeric axis"
      />
    </div>
  </div>
</template>
