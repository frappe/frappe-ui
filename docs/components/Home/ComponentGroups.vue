<script setup lang="ts">
import { Badge } from 'frappe-ui'

import Charts from './dummies/Charts.vue'
import DataDisplay from './dummies/DataDisplay.vue'
import Datetime from './dummies/Datetime.vue'
import Feedback from './dummies/Feedback.vue'
import Forms from './dummies/Forms.vue'
import Navigation from './dummies/Navigation.vue'
import Overlays from './dummies/Overlays.vue'

const componentGroups = {
  'Data Display': {
    component: DataDisplay,
    list: ['Avatar', 'Badge', 'ListView'],
  },

  'Navigation': {
    component: Navigation,
    list: ['Breadcrumbs', 'Tabs', 'TabButtons', 'Sidebar'],
  },
  'Forms': {
    component: Forms,
    list: [
      'Input',
      'FormControl',
      'Select',
      'MultiSelect',
      'Checkbox',
      'Switch',
      'Password',
      'FileUploader',
      'Rating',
      'TextEditor',
    ],
  },
  'DateTime': {
    component: Datetime,
    list: ['Calendar', 'DatePicker', 'MonthPicker', 'TimePicker'],
  },
  'Overlays': {
    component: Overlays,
    list: ['Dialog', 'Dropdown', 'Popover', 'Tooltip'],
  },
  'Feedback': {
    component: Feedback,
    list: ['Alert', 'ErrorMessage', 'Progress', 'CircularProgressBar'],
  },

  'Charts': {
    component: Charts,
    list: ['Charts'],
  },
}
</script>

<template>
  <div class="not-prose grid grid-cols-2 gap-6">
    <div
      v-for="(components, group) in componentGroups"
      :key="group"
      class="grid rounded border border-outline-gray-2 dark:border-0"
    >
      <component
        :is="components.component"
        class="min-h-[130px] rounded-t bg-surface-gray-2 dark:bg-surface-gray-1"
      />

      <div class="grid gap-2 rounded-b bg-surface-cards p-4">
        <h3 class="text-lg font-semibold text-ink-gray-9">
          {{ group }}
        </h3>

        <div class="flex flex-wrap gap-3">
          <a v-for="x in components.list" :key="x" :href="'/docs/components/' + x.toLowerCase()">
            <Badge size="lg" class="hover:bg-surface-gray-4">
              {{ x }}
            </Badge>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
