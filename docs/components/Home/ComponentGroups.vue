<script setup lang="ts">
import DataDisplay from "./dummies/DataDisplay.vue";
import Navigation from "./dummies/Navigation.vue";
import Forms from "./dummies/Forms.vue";
import Datetime from "./dummies/Datetime.vue";
import Overlays from "./dummies/Overlays.vue";
import Feedback from "./dummies/Feedback.vue";
import Charts from "./dummies/Charts.vue";

const componentGroups = {
  "Data Display": {
    subtxt: "Extensive Listview, badges",
    component: DataDisplay,
    list: ["Avatar", "Badge", "ListView"],
  },

  "Navigation": {
    subtxt: "Tabs, Sidebar, Breadcrumbs",
    component: Navigation,
    list: [
      "Breadcrumbs",
      "Tabs",
      "TabButtons",
      "Sidebar",
    ],
  },
  "Forms": {
    subtxt: "Select, Checkbox, Switch ",
    component: Forms,
    list: [
      "Input",
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
    subtxt: "Calendar, Datepicker, TimePicker",
    component: Datetime,
    list: ["Calendar", "DatePicker", "MonthPicker", "TimePicker"],
  },
  "Overlays": {
    subtxt: "Dialog, Dropdown, Popover",
    component: Overlays,
    list: ["Dialog", "Dropdown", "ConfirmDialog", "Popover", "Tooltip"],
  },
  "Feedback": {
    subtxt: "Alert, Toast, Progress",
    component: Feedback,
    list: [
      "Alert",
      "Toast",
      "ErrorMessage",
      "Progress",
      "CircularProgressBar",
      "Spinner",
    ],
  },

  "Charts": {
    subtxt: "Number Charts, Bar Charts, Line Charts",
    component: Charts,
    list: [
      "Number Charts",
      "Bar Charts",
      "Line Charts",
      "Pie Charts",
      "Doughnut Charts",
    ],
  },
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 my-12 prose">
    <h1 class="text-[2.7rem] font-bold text-center mb-4">
      Everything you need <br /> <span> to build. </span>
    </h1>

    <p class="text-2xl max-w-2xl text-center mx-auto text-ink-gray-5 leading-7">
      From simple buttons to complex data tables, Frappe UI provides all the
      building blocks for your next project.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 not-prose">
      <div
        v-for="(components, group) in componentGroups"
        :key="group"
        class="rounded border border-outline-gray-2 dark:border-0 grid"
      >
        <div
          class="min-h-[130px] bg-surface-gray-1 rounded-t flex justify-center *:w-full"
        >
          <component :is="components.component" />
        </div>

        <div class="grid gap-2 p-4 bg-surface-cards rounded-b">
          <h3 class="text-lg font-semibold text-ink-gray-9">
            {{ group }}
          </h3>

          <p class="text-sm text-ink-gray-5">
            {{ components.list.slice(0, 3).join(", ") }}
          </p>

          <span class="text-sm text-ink-blue-2">
            + {{ components.list.slice(3).length }} More
          </span>
        </div>
      </div>
    </div>
  </main>
</template>
