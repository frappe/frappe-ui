<script setup lang="ts">
import { AxisChart, DonutChart, FunnelChart, NumberChart } from "frappe-ui";

import {
  AxisChartConfig,
  DonutChartConfig,
} from "frappe-ui/src/components/Charts/types";

import Story from "@/components/Story.vue";

const salesData = [
  { month: new Date("2021-01-01"), sales: 200, profit: 50, returns: 20 },
  { month: new Date("2021-02-01"), sales: 300, profit: 80, returns: 25 },
  { month: new Date("2021-03-01"), sales: 250, profit: 60, returns: 15 },
  { month: new Date("2021-04-01"), sales: 350, profit: 90, returns: 30 },
  { month: new Date("2021-05-01"), sales: 400, profit: 100, returns: 35 },
  { month: new Date("2021-06-01"), sales: 300, profit: 80, returns: 25 },
  { month: new Date("2021-07-01"), sales: 200, profit: 50, returns: 20 },
  { month: new Date("2021-08-01"), sales: 300, profit: 80, returns: 25 },
  { month: new Date("2021-09-01"), sales: 250, profit: 60, returns: 15 },
  { month: new Date("2021-10-01"), sales: 350, profit: 90, returns: 30 },
  { month: new Date("2021-11-01"), sales: 400, profit: 100, returns: 35 },
  { month: new Date("2021-12-01"), sales: 300, profit: 80, returns: 25 },
];

const productData = [
  { product: "iPhone", sales: 200 },
  { product: "iPad", sales: 300 },
  { product: "Macbook", sales: 250 },
  { product: "iMac", sales: 350 },
  { product: "Apple Watch", sales: 400 },
  { product: "AirPods", sales: 300 },
  { product: "HomePod", sales: 200 },
  { product: "Apple TV", sales: 300 },
  { product: "Beats", sales: 250 },
  { product: "Accessories", sales: 350 },
  { product: "Services", sales: 400 },
  { product: "Others", sales: 300 },
];

const simpleConfig: AxisChartConfig = {
  data: salesData,
  title: "Monthly Sales",
  subtitle: "Sales data for first half of the year",
  xAxis: {
    key: "month",
    type: "time",
    title: "Month",
    timeGrain: "month",
  },
  yAxis: {
    title: "Amount ($)",
    echartOptions: {
      min: 0,
      max: 800,
    },
  },
  series: [{ name: "sales", type: "bar" }],
};

const stackedConfig: AxisChartConfig = {
  data: salesData,
  title: "Sales, Profit, and Returns",
  subtitle: "Monthly breakdown",
  xAxis: {
    key: "month",
    type: "time",
    title: "Month",
    timeGrain: "month",
  },
  yAxis: {
    title: "Amount ($)",
  },
  stacked: true,
  series: [
    { name: "sales", type: "bar" },
    { name: "profit", type: "bar" },
    { name: "returns", type: "bar" },
  ],
};

const horizontalConfig: AxisChartConfig = {
  data: productData,
  title: "Monthly Sales - Horizontal",
  subtitle: "Sales data presented horizontally",
  xAxis: {
    key: "product",
    title: "Product",
    type: "category",
  },
  yAxis: {
    title: "Sales ($)",
  },
  swapXY: true,
  series: [{ name: "sales", type: "bar" }],
};

const comboData = salesData.map((item) => ({
  ...item,
  growth_rate: item.sales > 0 ? (item.profit / item.sales) * 100 : 0,
}));

const comboConfig: AxisChartConfig = {
  data: comboData,
  title: "Sales and Growth Rate",
  subtitle: "Bar and line combination",
  xAxis: {
    key: "month",
    type: "time",
    title: "Month",
    timeGrain: "month",
  },
  yAxis: {
    title: "Amount ($)",
  },
  y2Axis: {
    title: "Growth Rate (%)",
  },
  series: [
    { name: "sales", type: "bar" },
    { name: "growth_rate", type: "line", axis: "y2" },
  ],
};

const areaConfig: AxisChartConfig = {
  data: salesData,
  title: "Monthly Sales - Area Chart",
  subtitle: "Sales data for first half of the year",
  xAxis: {
    key: "month",
    type: "time",
    title: "Month",
    timeGrain: "month",
  },
  yAxis: {
    title: "Amount ($)",
  },
  stacked: true,
  series: [
    { name: "sales", type: "area" },
    { name: "profit", type: "area" },
    { name: "returns", type: "area" },
  ],
};

const donutConfig: DonutChartConfig = {
  data: productData,
  title: "Product Sales Distribution",
  subtitle: "Sales distribution across products",
  categoryColumn: "product",
  valueColumn: "sales",
};

const numberChart1Config = {
  title: "Total Sales",
  value: 123456,
  prefix: "$",
  delta: 10,
  deltaSuffix: "% MoM",
  negativeIsBetter: false,
};
const numberChart2Config = {
  title: "Total Expenses",
  value: 5682,
  prefix: "$",
  delta: -2,
  deltaSuffix: "% MoM",
  negativeIsBetter: true,
};
const numberChart3Config = {
  title: "Total Profit",
  value: 123456 - 5682,
  prefix: "$",
  delta: 8,
  deltaSuffix: "% MoM",
  negativeIsBetter: false,
};

const funnelConfig = {
  data: [
    { stage: "Stage 1", value: 100 },
    { stage: "Stage 2", value: 50 },
    { stage: "Stage 3", value: 30 },
    { stage: "Stage 4", value: 20 },
    { stage: "Stage 5", value: 10 },
  ],
  title: "Sales Funnel",
  subtitle: "Conversion rates at each stage",
  categoryColumn: "stage",
  valueColumn: "value",
};
</script>

<template>
  <div class="grid gap-12">
    <Story title="Number Chart" preview-css="flex gap-3">
      <NumberChart :config="numberChart1Config" />
      <NumberChart :config="numberChart2Config" />
      <NumberChart :config="numberChart3Config" />
    </Story>

    <Story title="Simple Bar Chart">
      <AxisChart :config="simpleConfig" />
    </Story>

    <Story title="Stacked Bar Chart">
      <AxisChart :config="stackedConfig" />
    </Story>

    <Story title="Bar & Line Combo">
      <AxisChart :config="comboConfig" />
    </Story>

    <Story title="Horizontal Bar Chart">
      <AxisChart :config="horizontalConfig" />
    </Story>

    <Story title="Area Chart">
      <AxisChart :config="areaConfig" />
    </Story>

    <Story title="Donut Chart">
      <DonutChart :config="donutConfig" />
    </Story>

    <Story title="Funnel Chart">
      <FunnelChart :config="funnelConfig" />
    </Story>
  </div>
</template>
