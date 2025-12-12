<script setup lang="ts">
import { reactive, ref } from 'vue'
import TimePicker from './TimePicker.vue'
import Story from '../Story.vue'
import type { Placement, Variant } from './types'

const valueBasic = ref('')
const value24 = ref('13:30')
const valueCustomOpts = ref('09:00')
const valueRange = ref('08:00')

const customOptions = [
  { value: '08:00' },
  { value: '09:00' },
  { value: '09:30' },
  { value: '10:00' },
  { value: '11:15' },
  { value: '13:45' },
]

const state = reactive({
  variant: 'subtle' as Variant,
  interval: 15,
  allowCustom: true,
  autoClose: true,
  use12Hour: true,
  placement: 'bottom-start' as Placement,
  placeholder: 'Select time',
  disabled: false,
  minTime: '',
  maxTime: '',
  scrollMode: 'center' as 'center' | 'start' | 'nearest',
})
</script>

<template>
  <div class="grid gap-4 grid-cols-2">
    <Story title="Basic">
      <TimePicker v-model="valueBasic" v-bind="state" />
      <div class="text-xs text-gray-500">Value: {{ valueBasic || '—' }}</div>
    </Story>

    <Story title="24 Hour Format">
      <TimePicker v-model="value24" v-bind="{ ...state, use12Hour: false }" />
      <div class="text-xs text-gray-500">Value: {{ value24 }}</div>
    </Story>

    <Story title="Custom Options">
      <TimePicker
        v-model="valueCustomOpts"
        v-bind="state"
        :options="customOptions"
        :allowCustom="false"
      />
      <div class="text-xs text-gray-500">Value: {{ valueCustomOpts }}</div>
    </Story>

    <Story title="Min / Max Range">
      <TimePicker
        v-model="valueRange"
        v-bind="{ ...state, minTime: '08:00', maxTime: '12:00' }"
      />
      <div class="text-xs text-gray-500">Value: {{ valueRange }}</div>
    </Story>
  </div>
</template>
