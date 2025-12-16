<template>
  <template v-for="(row, index) in conditions">
    <BaseBlock v-bind="getPropsToApply(index)">
      <template #meta>
        <Combobox
          variant="outline"
          :openOnClick="true"
          :options="[
            { label: 'Field A', value: 'field_a' },
            { label: 'Field B', value: 'field_b' },
            { label: 'Field C', value: 'field_c' },
          ]"
          placeholder="Select Field"
          class="[&>div>div]:bg-surface-white ababa"
          v-model="row.fieldname"
        />
      </template>
      <template #action>
        <Dropdown :options="options(index)" placement="right">
          <Button variant="ghost" icon="more-horizontal" />
        </Dropdown>
      </template>
    </BaseBlock>
  </template>
</template>

<script setup lang="ts">
import { ModelRef } from 'vue'
import Combobox from '../../src/components/Combobox/Combobox.vue'
import Dropdown from '../../src/components/Dropdown/Dropdown.vue'
import BaseBlock from './BaseBlock.vue'
console.log(Combobox)
const emit = defineEmits<{
  (e: 'insert'): void
  (e: 'delete', index: number): void
}>()
const conditions = defineModel() as ModelRef<any[]>

// const titleClass

function getPropsToApply(idx: number): {
  rounded: string
  title: string
  icon: string
} {
  const rounded = idx === conditions.value.length - 1 ? 'bottom' : 'none'
  const title = idx === 0 ? 'Where' : 'and'
  const icon = idx === 0 ? 'filter' : ''
  return {
    rounded,
    title,
    icon,
  }
}

function options(idx: number) {
  return [
    {
      label: 'Add Condition',
      onClick: () => emit('insert'),
      icon: 'plus',
    },
    {
      label: 'Delete Condition',
      onClick: () => emit('delete', idx),
      icon: 'trash',
      theme: 'red',
    },
  ]
}
</script>
