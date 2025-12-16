<template>
  <div class="flex flex-col gap-1">
    <BaseBlock title="When" :icon="icon" :rounded="roundedClass">
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
          v-if="state.presetsJson.length === 0"
          variant="ghost"
          size="sm"
          :icon-left="FilterIcon"
          label="Add Filter"
          @click="insertRow"
        />
      </template>
    </BaseBlock>
    <ConditionBlock
      v-if="state.presetsJson.length > 0"
      v-model="state.presetsJson"
      @insert="insertRow"
      @delete="deleteRow"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Option } from '../../src/components/Autocomplete/types'
import Select from '../../src/components/Select/Select.vue'
import FilterIcon from '../Icons/FilterIcon.vue'
import BaseBlock from './BaseBlock.vue'
import ConditionBlock from './ConditionBlock.vue'
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

const roundedClass = computed(() =>
  state.presetsJson.length > 0 ? 'top' : 'all',
)

const dummyObj = () => ({
  field: { fieldName: '', fieldType: '', options: [] },
  operator: '',
  value: '',
})
const insertRow = () => state.presetsJson.push(dummyObj())
const deleteRow = (index: number) => {
  state.presetsJson.splice(index, 1)
}
</script>

<style scoped></style>
