<script setup lang="ts">
import { reactive, ref } from 'vue'
import TimePicker from './TimePicker.vue'
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

const placements: Placement[] = [
  'bottom-start',
  'bottom-end',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'left-start',
  'left-end',
]

const scrollModes = ['center', 'start', 'nearest'] as const

interface StoryState {
  variant: Variant
  interval: number
  allowCustom: boolean
  autoClose: boolean
  use12Hour: boolean
  placement: Placement
  placeholder: string
  disabled: boolean
  minTime: string
  maxTime: string
  scrollMode: 'center' | 'start' | 'nearest'
}

const state = reactive<StoryState>({
  variant: 'subtle',
  interval: 15,
  allowCustom: true,
  autoClose: true,
  use12Hour: true,
  placement: 'bottom-start',
  placeholder: 'Select time',
  disabled: false,
  minTime: '',
  maxTime: '',
  scrollMode: 'center',
})
</script>

<template>
  <div class="space-y-4 max-w-sm">
    <div class="space-y-1">
      <label>Basic</label>
      <TimePicker v-model="valueBasic" v-bind="state" />
      <div class="text-xs text-gray-500">Value: {{ valueBasic || '—' }}</div>
    </div>

    <div class="space-y-1">
      <label>24 Hour Format</label>
      <TimePicker v-model="value24" v-bind="{ ...state, use12Hour: false }" />
      <div class="text-xs text-gray-500">Value: {{ value24 }}</div>
    </div>

    <div class="space-y-1">
      <label>Custom Options</label>
      <TimePicker
        v-model="valueCustomOpts"
        v-bind="state"
        :options="customOptions"
        :allowCustom="false"
      />
      <div class="text-xs text-gray-500">Value: {{ valueCustomOpts }}</div>
    </div>

    <div class="space-y-1">
      <label>Min / Max Range</label>
      <TimePicker
        v-model="valueRange"
        v-bind="{ ...state, minTime: '08:00', maxTime: '12:00' }"
      />
      <div class="text-xs text-gray-500">Value: {{ valueRange }}</div>
    </div>
  </div>
</template>
