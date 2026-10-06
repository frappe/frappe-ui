<script setup lang="ts">
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'

// Chart patterns, to be built with frappe-ui's charts and checked against
// Espresso as the designs come in. One file per pattern in `patterns/`, one
// entry here — the page stands ready, with nothing on it yet.
const patterns: Pattern[] = []
</script>

<template>
  <PatternsPage
    title="Chart patterns"
    description="How charts are drawn across the Frappe apps."
    :patterns="patterns"
  />
</template>
