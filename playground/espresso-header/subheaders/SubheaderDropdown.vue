<template>
  <ESubheader>
    <template #left>
      <!-- A ghost control leading the row: pulled left by its padding less the
           breadcrumb's 2px, so its text sits on the header text's edge. -->
      <HeaderSelect
        label="August 2025"
        variant="ghost"
        text-class="text-lg-medium"
        class="-ml-1.5"
      />
    </template>
    <template #right>
      <div class="flex items-center gap-0.5">
        <Button variant="ghost" size="sm" aria-label="Previous">
          <template #icon>
            <EIcon name="small-left-chevron" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
        <Button variant="ghost" size="sm" class="!text-ink-gray-7"
          >Today</Button
        >
        <Button variant="ghost" size="sm" aria-label="Next">
          <template #icon>
            <EIcon name="small-right-chevron" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
      </div>
      <HeaderSelect label="Week" />
      <TabButtons
        v-model="view"
        :options="views"
        variant="subtle"
        size="sm"
        class="cursor-pointer"
      />
      <HeaderSelect label="Lead" icon="people" />
      <Button variant="subtle" size="sm" aria-label="More">
        <template #icon>
          <EIcon name="dot-horizontal" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
    </template>
  </ESubheader>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, TabButtons } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import ESubheader from '../ESubheader.vue'
import HeaderSelect from '../HeaderSelect.vue'

const view = ref('all')
const views = [
  { label: 'All', value: 'all' },
  { label: 'Events', value: 'events' },
  { label: 'Tasks', value: 'tasks' },
]
</script>
