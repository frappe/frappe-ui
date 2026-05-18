<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
</script>

<template>
  <div class="w-full flex flex-wrap gap-3 items-center justify-center !py-20">
    <Breadcrumbs
      :items="[
        { label: 'Home', route: { name: 'Home' } },
        { label: 'Views', route: '/components' },
        { label: 'List', route: '/components/breadcrumbs' },
      ]"
    />
  </div>
</template>
