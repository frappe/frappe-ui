<script setup lang="ts">
import { reactive, ref } from 'vue'
import DatePicker from './DatePicker.vue'
import DateTimePicker from './DateTimePicker.vue'
import DateRangePicker from './DateRangePicker.vue'

const state = reactive({
  variant: 'subtle',
  placeholder: 'Placeholder',
  disabled: false,
  label: 'Label',
})
const dateValue = ref('')
const dateTimeValue = ref('')
const dateRangeValue = ref('')
</script>

<template>
  <div class="grid gap-4">
    <div class="p-2">
      <DatePicker v-model="dateValue" v-bind="state" />
    </div>
    <div class="p-2">
      <DateTimePicker v-model="dateTimeValue" v-bind="state" />
    </div>
    <div class="p-2">
      <DateRangePicker v-model="dateRangeValue" v-bind="state" />
    </div>
  </div>
</template>
