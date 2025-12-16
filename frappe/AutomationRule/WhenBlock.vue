<template>
  <BaseBlock title="When" :icon="icon">
    <template #meta>
      <Select
        variant="outline"
        :options="events"
        placeholder="Select Doctype"
        v-model="state.eventType"
        key="1"
      />
      <Select
        v-if="state.eventType === 'time'"
        variant="outline"
        :options="timerOptions"
        placeholder="Select Interval"
        v-model="state.selectedTimerOption"
        key="2"
      />
    </template>
    <template #action>
      <Button
        variant="ghost"
        size="sm"
        :icon-left="FilterIcon"
        label="Add Filter"
      />
    </template>
  </BaseBlock>
  <!-- <ConditionsBlock /> -->
</template>

<script setup lang="ts">
import type { Option } from '../../src/components/Autocomplete/types'
import Button from '../../src/components/Button/Button.vue'
import Select from '../../src/components/Select/Select.vue'
import FilterIcon from '../Icons/FilterIcon.vue'
import BaseBlock from './BaseBlock.vue'
import { useAutomationState } from './automation'

const icon = 'event'

const state = useAutomationState()

const events: Option[] = [
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Time-based', value: 'time' },
]

const timerOptions: Option[] = [
  { label: 'Every 5 minutes', value: 5 },
  { label: 'Every 15 minutes', value: 15 },
  { label: 'Every 30 minutes', value: 30 },
  { label: 'Every 1 hour', value: 60 },
  { label: 'Every 6 hours', value: 360 },
  { label: 'Every 12 hours', value: 720 },
  { label: 'Every 24 hours', value: 1440 },
]
</script>

<style scoped></style>
