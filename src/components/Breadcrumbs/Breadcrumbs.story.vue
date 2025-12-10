<script setup lang="ts">
import Breadcrumbs from './Breadcrumbs.vue'
</script>

<template>
  <div class="grid gap-5">
    <Breadcrumbs
      :items="[
        { label: 'Home', route: { name: 'Home' } },
        { label: 'Views', route: '/components' },
        { label: 'List', route: '/components/breadcrumbs' },
      ]"
    />

    <Breadcrumbs
      :items="[
        { label: 'Home', onClick: () => console.log('Home clicked') },
        { label: 'Views', onClick: () => console.log('Views clicked') },
        { label: 'Kanban', onClick: () => console.log('Kanban clicked') },
      ]"
    />

    <Breadcrumbs
      :items="[
        { label: 'Home', icon: '🏡', route: { name: 'Home' } },
        { label: 'Views', icon: '🏞️', route: '/components' },
        { label: 'List', icon: '📃', route: '/components/breadcrumbs' },
      ]"
    >
      <template #prefix="{ item }">
        <span class="mr-1">{{ item.icon }}</span>
      </template>
    </Breadcrumbs>
  </div>
</template>
