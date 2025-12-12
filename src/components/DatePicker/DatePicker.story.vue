<script setup lang="ts">
import { reactive, ref } from "vue";
import DatePicker from "./DatePicker.vue";
import DateTimePicker from "./DateTimePicker.vue";
import DateRangePicker from "./DateRangePicker.vue";
import Story from "../Story.vue";

const state = reactive({
  variant: "subtle",
  placeholder: "Placeholder",
  disabled: false,
  label: "Label",
});

const dateValue = ref("");
const dateTimeValue = ref("");
const dateRangeValue = ref("");
</script>

<template>
  <div class="grid gap-5 grid-cols-2">
    <Story title="Date Picker" preview-css="p-4">
      <DatePicker v-model="dateValue" v-bind="state" />
      <div class="mt-2 text-sm text-gray-600">
        Selected: {{ dateValue || "None" }}
      </div>
    </Story>

    <Story title="DateTime Picker" preview-css="p-4">
      <DateTimePicker v-model="dateTimeValue" v-bind="state" />
      <div class="mt-2 text-sm text-gray-600">
        Selected: {{ dateTimeValue || "None" }}
      </div>
    </Story>

    <Story title="Date Range Picker" preview-css="p-4">
      <DateRangePicker v-model="dateRangeValue" v-bind="state" />
      <div class="mt-2 text-sm text-gray-600">
        Selected: {{ dateRangeValue || "None" }}
      </div>
    </Story>
  </div>
</template>
