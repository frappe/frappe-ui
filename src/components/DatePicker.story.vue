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
        <DatePicker
          :value="dateValue"
          @change="(val) => (dateValue = val)"
          v-bind="state"
        />
      </div>
    </Variant>
    <Variant title="Date Time">
      <div class="p-2">
        <DateTimePicker
          :value="dateTimeValue"
          @change="(val) => (dateTimeValue = val)"
          v-bind="state"
        />
      </div>
    </Variant>
    <Variant title="Date Range">
      <div class="p-2">
        <DateRangePicker
          :value="dateRangeValue"
          @change="(val) => (dateRangeValue = val)"
          v-bind="state"
        />
      </div>
    </Variant>
  </Story>
</template>
