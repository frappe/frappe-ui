<template>
  <EHeader>
    <template #left>
      <Breadcrumbs :items="[{ label: 'frappe' }]" />
    </template>
    <template #middle>
      <div class="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" aria-label="Previous file">
          <template #icon>
            <EIcon name="left-chevron" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
        <Button variant="ghost" size="sm" class="!text-ink-gray-7"
          >2 / 4</Button
        >
        <Button variant="ghost" size="sm" aria-label="Next file">
          <template #icon>
            <EIcon name="right-chevron" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
      </div>
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
      <VDivider />
      <Button variant="ghost" size="sm" aria-label="Close">
        <template #icon>
          <EIcon name="close" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
    </template>
  </EHeader>
</template>

<script setup lang="ts">
import { Breadcrumbs, Button } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import EHeader from '../EHeader.vue'
import VDivider from '../VDivider.vue'

const actions = [
  { icon: 'download', label: 'Download' },
  { icon: 'link', label: 'Copy link' },
  { icon: 'share', label: 'Share' },
  { icon: 'delete', label: 'Delete' },
  { icon: 'alert-circle', label: 'Details' },
  { icon: 'play', label: 'Present' },
]
</script>
