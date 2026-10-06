<script setup lang="ts">
// The file's "Spark line charts" row (Figma 1GDS12ys41lxeG3wQpNq41,
// 1356:69060 … 1356:69141): nine small cards, each a reading with its
// change and one of the file's trends under, beside or not at all.
import { computed } from 'vue'
import SparkCard from '../components/SparkCard.vue'
import { SPARK, SPARK_DOWN } from '../chartData'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()
const color = computed(() => props.theme.one('spark'))
</script>

<template>
  <div class="col-span-2 grid grid-cols-4 gap-x-[17px] gap-y-[18px]">
    <SparkCard
      title="Spark line"
      value="184"
      delta="+7%"
      caption="vs last month"
      :data="SPARK"
      variant="area"
      :color="color"
    />
    <SparkCard
      title="Spark line"
      value="184"
      delta="+7%"
      caption="vs last month"
      :data="SPARK"
      variant="line"
      :color="color"
    />
    <SparkCard
      title="Tickets"
      value="184"
      delta="+7%"
      caption="vs last month"
      :data="[
        6, 10, 13, 10, 11, 17, 20, 28, 22, 22, 16, 27, 20, 20, 13, 26, 14, 17,
        20, 15, 6, 19, 20, 30, 28, 16, 10, 6, 6, 9,
      ]"
      variant="bars"
      :color="color"
    />
    <SparkCard
      title="Spark line"
      value="184"
      delta="+7%"
      caption="vs last month"
      :data="SPARK"
      variant="solid"
      :color="color"
    />
    <SparkCard
      title="My tickets"
      value="87"
      delta="+7%"
      caption="vs last week"
      :data="SPARK"
      variant="beside"
      :color="color"
    />
    <SparkCard
      title="Spark line"
      value="38%"
      delta="-4%"
      caption="vs last month"
      :data="SPARK_DOWN"
      variant="inset"
      :color="color"
    />
    <SparkCard
      title="Sales"
      value="$12,83,456"
      delta="+7%"
      caption="vs last month"
      :height="95"
      :color="color"
    />
    <SparkCard title="Sales" value="$12,83,456" :height="71" :color="color" />
    <SparkCard
      title="Sales"
      value="$12,83,456"
      :data="SPARK"
      variant="inset"
      :height="106"
      :color="color"
    />
  </div>
</template>
