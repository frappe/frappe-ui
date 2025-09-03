<script setup lang="ts">
import { reactive, ref } from 'vue'
import TimePicker from './TimePicker.vue'
import FeatherIcon from '../FeatherIcon.vue'
import type { Placement, Variant } from './types'

const valueBasic = ref('')
const value24 = ref('13:30')
const valueCustomOpts = ref('09:00')
const valueRange = ref('08:00')
const valueEvents = ref('')

const eventsLog = ref<string[]>([])
function log(e: string, payload?: any) {
  const ts = new Date().toLocaleTimeString()
  eventsLog.value.unshift(
    `${ts} ${e}${payload !== undefined ? ': ' + payload : ''}`,
  )
  if (eventsLog.value.length > 8) eventsLog.value.pop()
}

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
  <Story :layout="{ type: 'grid', width: 300 }" autoPropsDisabled>
    <Variant title="Basic">
      <div class="p-2 space-y-2">
        <TimePicker v-model="valueBasic" v-bind="state" />
        <div class="text-xs text-ink-gray-6">
          Value: {{ valueBasic || '—' }}
        </div>
      </div>
    </Variant>

    <Variant title="24 Hour Format">
      <div class="p-2 space-y-2">
        <TimePicker v-model="value24" v-bind="{ ...state, use12Hour: false }" />
        <div class="text-xs text-ink-gray-6">Value: {{ value24 }}</div>
      </div>
    </Variant>

    <Variant title="Custom Options (no interval generation)">
      <div class="p-2 space-y-2">
        <TimePicker
          v-model="valueCustomOpts"
          v-bind="state"
          :options="customOptions"
          :allowCustom="false"
        />
        <div class="text-xs text-ink-gray-6">Value: {{ valueCustomOpts }}</div>
      </div>
    </Variant>

    <Variant title="Min / Max Range">
      <div class="p-2 space-y-2">
        <TimePicker
          v-model="valueRange"
          v-bind="{ ...state, minTime: '08:00', maxTime: '12:00' }"
        />
        <div class="text-xs text-ink-gray-6">Value: {{ valueRange }}</div>
      </div>
    </Variant>

    <template #controls>
      <HstSelect
        v-model="state.variant"
        :options="['outline', 'subtle', 'ghost']"
        title="Variant"
      />
      <HstNumber v-model="state.interval" title="Interval (min)" />
      <HstCheckbox v-model="state.allowCustom" title="Allow Custom" />
      <HstCheckbox v-model="state.autoClose" title="Auto Close" />
      <HstCheckbox v-model="state.use12Hour" title="12 Hour" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
      <HstSelect
        v-model="state.placement"
        :options="placements"
        title="Placement"
      />
      <HstSelect
        v-model="state.scrollMode"
        :options="scrollModes"
        title="Scroll Mode"
      />
      <HstText v-model="state.minTime" title="Min Time (HH:MM)" />
      <HstText v-model="state.maxTime" title="Max Time (HH:MM)" />
      <HstText v-model="state.placeholder" title="Placeholder" />
    </template>
  </Story>
</template>
