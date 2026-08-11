<script setup lang="ts">
import DataDisplay from "./dummies/DataDisplay.vue";
import Navigation from "./dummies/Navigation.vue";
import Forms from "./dummies/Forms.vue";
import Datetime from "./dummies/Datetime.vue";
import Overlays from "./dummies/Overlays.vue";
import Feedback from "./dummies/Feedback.vue";
import Charts from "./dummies/Charts.vue";
import { Badge } from "frappe-ui";
import { withBase } from 'vitepress'

const componentGroups = {
  "Data Display": {
    component: DataDisplay,
    list: ["Avatar", "Badge"],
  },

  "Navigation": {
    component: Navigation,
    list: [
      "Breadcrumbs",
      "Tabs",
      "TabButtons",
      "Sidebar",
    ],
  },
  "Forms": {
    component: Forms,
    list: [
      "TextInput",
      "FormControl",
      "Select",
      "MultiSelect",
      "Checkbox",
      "Switch",
      "Password",
      "FileUploader",
      "Rating",
    ],
  },
  "DateTime": {
    component: Datetime,
    list: ["DatePicker", "TimePicker"],
  },
  "Overlays": {
    component: Overlays,
    list: ["Dialog", "Dropdown", "Popover", "Tooltip"],
  },
  "Feedback": {
    component: Feedback,
    list: [
      "Alert",
      "ErrorMessage",
      "Progress",
    ],
  },

  "Charts": {
    component: Charts,
    list: [
      "Charts",
    ],
    // The chart family has its own docs section; it is not under /docs/components.
    links: { Charts: "/docs/charts/overview" },
  },
};
</script>

<template>
  <div class="grid grid-cols-2 gap-6 not-prose">
    <div
      v-for="(components, group) in componentGroups"
      :key="group"
      class="rounded-4 border border-outline-gray-2 dark:border-0 grid"
    >
      <component
        :is="components.component"
        class="min-h-[130px] bg-surface-gray-2 dark:bg-surface-gray-1 rounded-t-4"
      />

      <div class="grid gap-2 p-4 bg-surface-elevation-1 rounded-b-4">
        <h3 class="text-md font-semibold text-ink-gray-9">
          {{ group }}
        </h3>

        <div class="flex gap-3 flex-wrap">
          <a
            v-for="x in components.list"
            :key="x"
            :href='withBase(components.links?.[x] ?? "/docs/components/" + x.toLowerCase())'
          >
            <Badge size="lg" class="hover:bg-surface-gray-4">
              {{ x }}
            </Badge>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
