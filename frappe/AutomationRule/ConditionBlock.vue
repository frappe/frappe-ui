<template>
  <div class="space-y-1">
    <template v-for="(row, index) in conditions">
      <BaseBlock v-bind="getPropsToApply(index)">
        <template #meta>
          <Combobox
            variant="outline"
            :open-on-click="true"
            :open-on-focus="true"
            :options="getFieldsForRow(row.field.fieldName)"
            placeholder="Select Field"
            class="[&>div>div]:bg-surface-white w-[120px]"
            :modelValue="row.field.fieldName"
            @update:modelValue="(val) => updateField(index, val)"
          />
          <Select
            placeholder="Select Operator"
            :options="getOperators(row.field)"
            v-model="row.operator"
            variant="outline"
            class="!w-[120px]"
            :disabled="!row.field.fieldName"
          />

          <component
            :is="getValueControl(row)"
            v-model="row.value"
            :disabled="!row.field.fieldName"
            variant="outline"
            class="w-[160px] abc"
            :class="
              row.field.fieldType === 'Link' &&
              '[&>div>div>div]:bg-surface-white'
            "
          />
        </template>
        <template #action>
          <Dropdown
            :options="rowOptions(index)"
            placement="right"
            v-if="index === conditions.length - 1"
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
import { computed, ModelRef } from 'vue'
import Combobox from '../../src/components/Combobox/Combobox.vue'
import Dropdown from '../../src/components/Dropdown/Dropdown.vue'
import Select from '../../src/components/Select/Select.vue'
import { useDoctypeMeta } from '../../src/data-fetching/useDoctypeMeta'
import type { StateRow } from '../Filter/types'
import { getOperators, getValueControl } from '../Filter/utils'
import BaseBlock from './BaseBlock.vue'
import { useAutomationState, useFilterConditions } from './automation'
import type { IconType, RoundedType } from './types'

const state = useAutomationState()
const { fields, getField } = useDoctypeMeta(state.dt)
const conditions = defineModel() as ModelRef<StateRow[]>
const { insertRow, deleteRow, updateField, canAddRow } = useFilterConditions(
  conditions.value,
  getField,
)

// Filter out fields already used in conditions
const availableFields = computed(() => {
  const usedFieldNames = new Set(
    conditions.value.map((row) => row.field.fieldName).filter((name) => name), // exclude empty strings
  )
  return fields.value.filter((f) => !usedFieldNames.has(f.value))
})

// Get available fields for a specific row (includes current row's field)
const getFieldsForRow = (currentFieldName: string) => {
  if (!currentFieldName) return availableFields.value
  // Include the current field in options so it shows as selected
  return fields.value.filter(
    (f) =>
      f.value === currentFieldName ||
      !conditions.value.some((row) => row.field.fieldName === f.value),
  )
}

function getPropsToApply(idx: number): {
  rounded: RoundedType
  title: string
  icon: IconType
} {
  const rounded: RoundedType =
    idx === conditions.value.length - 1 ? 'bottom' : 'none'
  const title = idx === 0 ? 'Where' : 'and'
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
