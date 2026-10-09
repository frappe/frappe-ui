<template>
  <EHeader>
    <template #left>
      <Breadcrumbs :items="[{ label: 'frappe' }]" />
    </template>
    <template #middle>
      <TabButtons
        v-model="tab"
        :options="tabs"
        variant="underline"
        size="md"
        class="fill-row h-12 cursor-pointer"
      >
        <template #suffix="{ button }">
          <Badge
            v-if="button.value === 'primary'"
            theme="gray"
            variant="solid"
            size="sm"
          >
            14
          </Badge>
        </template>
      </TabButtons>
    </template>
    <template #right>
      <Button
        v-for="action in actions"
        :key="action.icon"
        variant="ghost"
        size="sm"
        :aria-label="action.label"
      >
        <template #icon>
          <EIcon :name="action.icon" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
      <Button variant="solid" size="sm">
        <template #prefix>
          <EIcon name="edit" class="size-4" />
        </template>
        Compose
      </Button>
    </template>
  </EHeader>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Breadcrumbs, Button, TabButtons } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import EHeader from '../EHeader.vue'

const tab = ref('primary')
const tabs = [
  { label: 'Primary', value: 'primary' },
  { label: 'Updates', value: 'updates' },
  { label: 'Social', value: 'social' },
  { label: 'Promotions', value: 'promotions' },
]

const actions = [
  { icon: 'search-alt', label: 'Search' },
  { icon: 'reload', label: 'Refresh' },
  { icon: 'placement', label: 'Apps' },
]
</script>

<style scoped>
/* The design's tabs fill the 48px row, so the underline rail and the active
   indicator ride its bottom edge. Frappe's pills are shorter on their own. */
.fill-row :deep([data-slot='tab-buttons']) {
  height: 48px;
}
.fill-row :deep([data-slot='tab-button']),
.fill-row :deep([data-slot='tab-button'] > *) {
  height: 100%;
}
</style>
