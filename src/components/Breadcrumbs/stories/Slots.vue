<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
import LucideHouse from '~icons/lucide/house'
import LucideList from '~icons/lucide/list'
import LucideView from '~icons/lucide/user-star'
</script>

<template>
  <Breadcrumbs
    :items="[
      { label: 'Home', icon: LucideHouse, route: { name: 'Home' } },
      { label: 'Views', icon: LucideView, route: '/components' },
      {
        label: 'List',
        icon: LucideList,
        route: '/components/breadcrumbs',
      },
    ]"
  >
    <template #prefix="{ item }">
      <component :is="item.icon" class="size-4 mr-1" />
    </template>
  </Breadcrumbs>
</template>
