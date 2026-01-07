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
          class="!w-[150px]"
        />
        <!-- <Select
          v-if="state.eventType === 'time'"
          variant="outline"
          :options="timerOptions"
          placeholder="Select Interval"
          v-model="state.timerOffset"
          key="2"
        /> -->
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
      </template>
      <template #action>
        <Button
          v-if="state.presets.length === 0"
          variant="ghost"
          size="sm"
          :icon-left="FilterIcon"
          label="Add Filter"
          @click="() => conditionRef?.insertRow()"
        />
      </template>
    </BaseBlock>
    <ConditionBlock
      v-show="state.presets.length > 0"
      v-model="state.presets"
      ref="conditionRef"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDoctypeMeta } from '../../src'
import type { Option } from '../../src/components/Autocomplete/types'
import FormControl from '../../src/components/FormControl/FormControl.vue'
import Select from '../../src/components/Select/Select.vue'
import FilterIcon from '../Icons/FilterIcon.vue'
import { useAutomationState } from './automation'
import BaseBlock from './BaseBlock.vue'
import ConditionBlock from './ConditionBlock.vue'
import { IconType } from './types'

const state = useAutomationState()
const conditionRef = ref<InstanceType<typeof ConditionBlock> | null>(null)

const events: Option[] = [
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Minutes After', value: 'Minutes After' },
  { label: 'Minutes Before', value: 'Minutes Before' },
  { label: 'Days After', value: 'Days After' },
  { label: 'Days Before', value: 'Days Before' },
]

const isTimerEvent = computed(() =>
  ['Minutes After', 'Minutes Before', 'Days After', 'Days Before'].includes(
    state.eventType,
  ),
)
const icon = computed<IconType>(() => (isTimerEvent.value ? 'timer' : 'event'))

const { timeBaseFields } = useDoctypeMeta(state.dt)

const roundedClass = computed(() => (state.presets.length > 0 ? 'top' : 'all'))
</script>

<style scoped></style>
