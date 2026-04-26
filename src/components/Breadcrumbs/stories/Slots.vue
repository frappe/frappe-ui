<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
</script>

<template>
  <Breadcrumbs
    :items="[
      { label: 'Home', icon: 'lucide-house', route: { name: 'Home' } },
      { label: 'Views', icon: 'lucide-user-star', route: '/components' },
      {
        label: 'List',
        icon: 'lucide-list',
        route: '/components/breadcrumbs',
      },
    ]"
  >
    <template #prefix="{ item }">
      <span class="size-4 mx-2" :class="item.icon" />
    </template>
  </Breadcrumbs>
</template>
