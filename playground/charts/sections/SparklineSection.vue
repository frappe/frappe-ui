<script setup lang="ts">
// The file's "Spark line charts" row (Figma 1GDS12ys41lxeG3wQpNq41,
// 1356:69060 … 1356:69141): nine small cards, each a reading with its
// change and one of the file's trends under, beside or not at all.
import { computed } from 'vue'
import SparkCard from '../components/SparkCard.vue'
import { SPARK_BESIDE, SPARK_DOWN, SPARK_UP } from '../chartData'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()
const color = computed(() => props.theme.one('spark'))
</script>

<template>
  <!-- the file's nine small cards take the whole row of the page's grid, four
       across, and drop a column at a time as the stage narrows — measured on
       the stage, as the page's own grid is -->
  <div class="spark-grid col-span-full">
    <SparkCard
      title="Spark line"
      value="184"
      delta="+7%"
      caption="vs last month"
      :path="SPARK_UP"
      :range="[162, 198]"
      variant="area"
      :color="color"
    />
    <SparkCard
      title="Spark line"
      value="184"
      delta="+7%"
      caption="vs last month"
      :path="SPARK_UP"
      :range="[162, 198]"
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
      :path="SPARK_UP"
      :range="[162, 198]"
      variant="solid"
      :color="color"
    />
    <SparkCard
      title="My tickets"
      value="87"
      delta="+7%"
      caption="vs last week"
      :path="SPARK_BESIDE"
      :range="[78, 92]"
      variant="beside"
      :color="color"
    />
    <SparkCard
      title="Spark line"
      value="38%"
      delta="-4%"
      caption="vs last month"
      :path="SPARK_DOWN"
      :range="[34, 41]"
      :format="(v: number) => `${Math.round(v)}%`"
      variant="inset"
      :color="color"
    />
    <!-- the sales card with its trend sits second on the second row, ahead of
         the two plain sales cards -->
    <SparkCard
      title="Sales"
      value="$12,83,456"
      :path="SPARK_DOWN"
      :range="[1150000, 1283456]"
      :format="(v: number) => `$${Math.round(v).toLocaleString('en-IN')}`"
      variant="inset"
      :height="106"
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
  </div>
</template>

<style scoped>
/* The file's own card: 223 wide, and as many to a row as the stage holds,
   the way its frame lays them out. Under 223 of stage the card gives way
   rather than overflow. */
.spark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 223px));
  justify-content: start;
  column-gap: 17px;
  row-gap: 18px;
}
</style>
