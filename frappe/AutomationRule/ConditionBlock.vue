<template>
  <div class="space-y-1">
    <template v-for="(row, index) in conditionRows" :key="index">
      <BaseBlock v-bind="getPropsToApply(index)">
        <template #meta>
          <!-- And/Or toggle for rows after the first -->
          <Button
            v-if="index > 0"
            variant="subtle"
            class="w-max min-w-[50px]"
            @click="toggleConjunction"
            icon-right="refresh-cw"
            :disabled="index > 1"
            :label="conjunction"
            :tooltip="conjunctionTooltip"
          />

          <Combobox
            variant="outline"
            :open-on-click="true"
            :open-on-focus="true"
            :options="getFieldsForRow(row[0])"
            placeholder="Select Field"
            class="[&>div>div]:bg-surface-white w-[120px]"
            :modelValue="row[0]"
            @update:modelValue="(val) => handleFieldChange(row, val)"
          />
          <Select
            placeholder="Select Operator"
            :options="getOperatorsForRow(row)"
            :modelValue="row[1]"
            @update:modelValue="
              (val: String | undefined) => handleOperatorChange(row, val)
            "
            variant="outline"
            class="!w-[120px]"
            :disabled="!row[0]"
          />

          <component
            :is="getValueControlForRow(row)"
            variant="outline"
            :modelValue="row[2]"
            @update:modelValue="(val: unknown) => handleValueChange(row, val)"
            :disabled="!row[0]"
            class="w-[160px]"
            :class="
              getFieldTypeFromRow(row) === 'Link' &&
              '[&>div>div>div]:bg-surface-white'
            "
            placeholder="Select Value"
          />
        </template>
        <template #action>
          <Dropdown
            :options="rowOptions(index)"
            placement="right"
            v-if="index === conditionRows.length - 1"
          >
            <Button variant="ghost" icon="more-horizontal" />
          </Dropdown>
          <Button
            v-else
            variant="ghost"
            icon="trash-2"
            theme="red"
            tooltip="Delete Condition"
            @click="() => deleteRow(index)"
          />
        </template>
      </BaseBlock>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ModelRef } from 'vue'
import Button from '../../src/components/Button/Button.vue'
import Combobox from '../../src/components/Combobox/Combobox.vue'
import Dropdown from '../../src/components/Dropdown/Dropdown.vue'
import Select from '../../src/components/Select/Select.vue'
import BaseBlock from './BaseBlock.vue'
import { useAutomationState, useDoctypeFilters } from './automation'
import type { IconType, RoundedType } from './types'

type ConditionTuple = [string, string, string]
type ConditionArray = (ConditionTuple | string)[]

const state = useAutomationState()
const conditions = defineModel() as ModelRef<ConditionArray>

const {
  conditionRows,
  conjunction,
  conjunctionTooltip,
  toggleConjunction,
  handleFieldChange,
  handleOperatorChange,
  handleValueChange,
  getFieldTypeFromRow,
  getOperatorsForRow,
  getValueControlForRow,
  getFieldsForRow,
  insertRow,
  deleteRow,
  canAddRow,
} = useDoctypeFilters(state.dt, conditions)

function getPropsToApply(idx: number): {
  rounded: RoundedType
  title: string
  icon: IconType
} {
  const rounded: RoundedType =
    idx === conditionRows.value.length - 1 ? 'bottom' : 'none'
  const title = idx === 0 ? 'Where' : ''
  const icon: IconType = idx === 0 ? 'filter' : ''
  return {
    rounded,
    title,
    icon,
  }
}

function rowOptions(idx: number) {
  const canAdd = canAddRow()
  return [
    {
      label: 'Add Condition',
      onClick: canAdd ? () => insertRow() : undefined,
      icon: 'plus',
      disabled: !canAdd,
    },
    {
      label: 'Delete Condition',
      onClick: () => deleteRow(idx),
      icon: 'trash',
      theme: 'red' as const,
    },
  ]
}

defineExpose({ insertRow, deleteRow })
</script>
