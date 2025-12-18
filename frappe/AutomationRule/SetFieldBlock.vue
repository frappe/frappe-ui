<template>
  <BaseBlock icon="action" title="Set" v-bind="$attrs">
    <template #meta>
      <Combobox
        variant="outline"
        :open-on-click="true"
        :open-on-focus="true"
        :options="fields"
        placeholder="Select Field"
        class="[&>div>div]:bg-surface-white !w-[120px] !min-w-[120px]"
        :modelValue="action.field"
        @update:modelValue="handleFieldChange"
      />

      <component
        :is="valueControl"
        variant="outline"
        :modelValue="action.value"
        @update:modelValue="handleValueChange"
        :disabled="!action.field"
        class="w-[160px]"
        :class="fieldType === 'Link' && '[&>div>div>div]:bg-surface-white'"
        placeholder="Select Value"
      />
    </template>
    <template #action>
      <Button
        variant="ghost"
        icon="trash-2"
        theme="red"
        tooltip="Delete Action"
        @click="$emit('deleteAction')"
      />
    </template>
  </BaseBlock>
</template>

<script setup lang="ts">
import { computed, ModelRef } from 'vue'
import Button from '../../src/components/Button/Button.vue'
import Combobox from '../../src/components/Combobox/Combobox.vue'
import { useDoctypeMeta } from '../../src/data-fetching/useDoctypeMeta'
import { getValueControl } from '../Filter/utils'
import BaseBlock from './BaseBlock.vue'
import { useAutomationState } from './automation'

interface SetAction {
  type: 'set'
  field: string
  value: string
}

defineEmits<{
  deleteAction: []
}>()

const action = defineModel() as ModelRef<SetAction>
const state = useAutomationState()
const { fields, getField } = useDoctypeMeta(state.dt)

const fieldType = computed(() => {
  if (!action.value.field) return ''
  const field = getField(action.value.field)
  return field?.fieldtype || ''
})

const valueControl = computed(() => {
  if (!action.value.field) return 'input'

  const field = getField(action.value.field)
  if (!field) return 'input'

  return getValueControl({
    field: {
      fieldName: field.fieldname,
      fieldType: field.fieldtype,
      options: field.options?.split('\n') || [],
    },
    operator: 'equals',
    value: action.value.value,
  })
})

function handleFieldChange(fieldName: string) {
  if (!fieldName) {
    action.value.field = ''
    action.value.value = ''
    return
  }
  action.value.field = fieldName
  action.value.value = ''
}

function handleValueChange(value: unknown) {
  action.value.value = String(value ?? '')
}
</script>

<style scoped></style>
