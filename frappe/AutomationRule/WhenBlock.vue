<template>
  <div class="flex flex-col gap-1">
    <BaseBlock title="When" :icon="icon" :rounded="roundedClass">
      <template #meta>
        <Select
          variant="outline"
          :options="events"
          placeholder="Select Event Type"
          v-model="state.eventType"
          key="1"
          class="!w-[150px]"
        />
        <FormControl
          v-if="isTimerEvent"
          type="number"
          variant="outline"
          placeholder="Offset in Minutes"
          v-model="state.timerOffset"
          class="!w-[120px]"
          key="3"
          min="1"
        />
        <Select
          v-if="isTimerEvent"
          :options="timeBaseFields"
          variant="outline"
          placeholder="Select Time Field"
          v-model="state.timeField"
          class="!w-[150px]"
        />
        <Select
          v-if="state.eventType === 'Scheduled'"
          variant="outline"
          :options="eventFrequencyOptions"
          placeholder="Select Interval"
          v-model="state.eventFrequency"
          class="!w-[150px]"
        />
        <div
          v-if="
            state.eventFrequency === 'CRON Expression' &&
            state.eventType === 'Scheduled'
          "
          class="flex gap-1 items-center"
        >
          <FormControl
            type="text"
            variant="outline"
            placeholder="Enter CRON Expression"
            v-model="state.cronFormat"
            class="!w-[150px]"
          />
          <!-- Popover to know more about CRON Jobs
           
                *  *  *  *  *
                ┬  ┬  ┬  ┬  ┬
                │  │  │  │  │
                │  │  │  │  └ day of week (0 - 6) (0 is Sunday)
                │  │  │  └───── month (1 - 12)
                │  │  └────────── day of month (1 - 31)
                │  └─────────────── hour (0 - 23)
                └──────────────────── minute (0 - 59)
          this inside <code> tags
          -->

          <Popover trigger="hover" :hoverDelay="0.25" placement="top-end">
            <template #target>
              <div class="text-sm text-ink-gray-6 flex gap-1 cursor-default">
                <FeatherIcon name="info" class="size-4" />
              </div>
            </template>
            <template #body-main>
              <div
                class="text-sm text-ink-gray-6 p-4 bg-white rounded-md text-wrap whitespace-pre-wrap leading-5"
              >
                <code>{{ CRON_INFO }}</code>
              </div>
            </template>
          </Popover>
        </div>
      </template>
      <template #action>
        <Button
          v-if="state.presets.length === 0"
          variant="ghost"
          size="sm"
          :icon-left="FilterIcon"
          label="Add Filter"
          @click="addFilter"
        />
      </template>
    </BaseBlock>
    <ConditionBlock v-if="state.presets.length > 0" v-model="state.presets" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDoctypeMeta } from '../../src'
import type { Option } from '../../src/components/Autocomplete/types'
import FormControl from '../../src/components/FormControl/FormControl.vue'
import Popover from '../../src/components/Popover/Popover.vue'
import Select from '../../src/components/Select/Select.vue'
import FilterIcon from '../Icons/FilterIcon.vue'
import { useAutomationState } from './automation'
import BaseBlock from './BaseBlock.vue'
import ConditionBlock from './ConditionBlock.vue'
import { IconType } from './types'

const state = useAutomationState()
const addFilter = () => {
  if (state.presets.length === 0) {
    state.presets.push(['', '', ''])
  }
}
const isTimerEvent = computed(() =>
  ['Minutes After', 'Minutes Before', 'Days After', 'Days Before'].includes(
    state.eventType,
  ),
)
const icon = computed<IconType>(() =>
  isTimerEvent.value || state.eventType === 'Scheduled' ? 'timer' : 'event',
)

const { timeBaseFields } = useDoctypeMeta(state.dt)

const roundedClass = computed(() => (state.presets.length > 0 ? 'top' : 'all'))

const events: Option[] = [
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Minutes After', value: 'Minutes After' },
  { label: 'Minutes Before', value: 'Minutes Before' },
  { label: 'Days After', value: 'Days After' },
  { label: 'Days Before', value: 'Days Before' },
  { label: 'Scheduled', value: 'Scheduled' },
]

const eventFrequencyOptions = [
  'Every 5 Minutes',
  'Every 10 Minutes',
  'Every 30 Minutes',
  'Every Hour',
  'Every 6 Hours',
  'Every 12 Hours',
  'Every Day',
  'CRON Expression',
]

const CRON_INFO = `CRON Expression Format:
*  *  *  *  *
┬  ┬  ┬  ┬  ┬
│  │  │  │  │
│  │  │  │  └ day of week (0 - 6) (0 is Sunday)
│  │  │  └───── month (1 - 12)
│  │  └────────── day of month (1 - 31)
│  └─────────────── hour (0 - 23)
└──────────────────── minute (0 - 59)`
</script>

<style scoped></style>
