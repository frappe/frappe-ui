<script setup lang="ts">
import { logEvent } from 'histoire/client'
import Breadcrumbs from './Breadcrumbs.vue'
</script>

<template>
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant title="With route option">
      <Breadcrumbs
        :items="[
          {
            label: 'Home',
            route: { name: 'Home' },
          },
          {
            label: 'Views',
            route: '/components',
          },
          {
            label: 'List',
            route: '/components/breadcrumbs',
          },
        ]"
      />
    </Variant>
    <Variant title="With onClick option">
      <Breadcrumbs
        :items="[
          {
            label: 'Home',
            onClick: () => logEvent('onClick', 'Home'),
          },
          {
            label: 'Views',
            onClick: () => logEvent('onClick', 'Home'),
          },
          {
            label: 'Kanban',
            onClick: () => logEvent('onClick', 'Home'),
          },
        ]"
      />
    </Variant>

    <Variant title="With prefix slot">
      <Breadcrumbs
        :items="[
          {
            label: 'Home',
            icon: '🏡',
            route: { name: 'Home' },
          },
          {
            label: 'Views',
            icon: '🏞️',
            route: '/components',
          },
          {
            label: 'List',
            icon: '📃',
            route: '/components/breadcrumbs',
          },
        ]"
      >
        <template #prefix="{ item }">
          <span class="mr-1">
            {{ item.icon }}
          </span>
        </template>
      </Breadcrumbs>
    </Variant>
  </Story>
</template>
