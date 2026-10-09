<template>
  <ESubheader>
    <template #left>
      <HeaderSelect v-for="filter in filters" :key="filter" :label="filter" />
    </template>
    <template #right>
      <HeaderSelect
        v-for="control in controls"
        :key="control.label"
        :label="control.label"
        :icon="control.icon"
        :chevron="false"
      />
      <Button variant="subtle" size="sm" aria-label="More">
        <template #icon>
          <EIcon name="dot-horizontal" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
    </template>
  </ESubheader>
</template>

<script setup lang="ts">
import { Button } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import ESubheader from '../ESubheader.vue'
import HeaderSelect from '../HeaderSelect.vue'

const filters = ['Lead owner', 'Status', 'Organization']
const controls = [
  { label: 'Columns', icon: 'hide' },
  { label: 'Group', icon: 'group' },
  { label: 'Filter', icon: 'filter' },
  { label: 'Sort', icon: 'sort' },
]
</script>
