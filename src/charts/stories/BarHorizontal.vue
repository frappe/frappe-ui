<script setup lang="ts">
import { BarChart } from 'frappe-ui/charts'

const helpArticles = [
  { article: 'Setting up single sign-on with SAML', views: 18400 },
  { article: 'Importing contacts from a CSV file', views: 15200 },
  { article: 'Why did my scheduled report not run?', views: 11800 },
  { article: 'Changing the billing email on an account', views: 9300 },
  { article: 'Restoring a deleted workspace', views: 6100 },
  { article: 'Rate limits on the public API', views: 4200 },
]

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
</script>

<template>
  <div class="h-80 w-full">
    <BarChart
      :data="helpArticles"
      x="article"
      y="views"
      horizontal
      :y-axis="{ title: 'Views', format: compact }"
      :series-config="{ views: { showDataLabels: true } }"
      title="Most-read help articles"
      subtitle="Views in July 2026"
    />
  </div>
</template>
