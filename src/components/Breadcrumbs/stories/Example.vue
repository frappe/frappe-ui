<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
</script>

<template>
  <Breadcrumbs
    :items="[
      { label: 'Home', route: { name: 'Home' } },
      { label: 'Views', route: '/components' },
      { label: 'List', route: '/components/breadcrumbs' },
    ]"
  />
</template>
