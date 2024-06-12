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
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant title="Date">
      <div class="p-2">
        <DatePicker v-model="dateValue" v-bind="state" />
      </div>
    </Variant>
    <Variant title="Date Time">
      <div class="p-2">
        <DateTimePicker v-model="dateTimeValue" v-bind="state" />
      </div>
    </Variant>
    <Variant title="Date Range">
      <div class="p-2">
        <DateRangePicker v-model="dateRangeValue" v-bind="state" />
      </div>
    </Variant>
  </Story>
</template>
