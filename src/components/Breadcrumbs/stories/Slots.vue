<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center justify-center !py-20">
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
  </div>
</template>
