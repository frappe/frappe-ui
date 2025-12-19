<template>
  <div class="gap-1 flex flex-col">
    <ConditionBlock
      v-model="block.conditions"
      label="If"
      icon="condition"
      :round-first-block="true"
    />
    <div
      v-for="(action, actionIdx) in block.actions"
      :key="actionIdx"
      class="group"
    >
      <SetFieldBlock
        v-model="block.actions[actionIdx]"
        :indent="true"
        :options="getActionOptions(actionIdx)"
        :usedFields="addedFields"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ModelRef } from 'vue'
import ConditionBlock from './ConditionBlock.vue'
import SetFieldBlock from './SetFieldBlock.vue'
import type { DropdownOption, IfBlockData } from './types'

const block = defineModel() as ModelRef<IfBlockData>

const addedFields = computed(() =>
  block.value.actions.map((a) => a.field).filter(Boolean),
)

function addAction() {
  block.value.actions.push({ type: 'set', field: '', value: '' })
}

function deleteAction(index: number) {
  block.value.actions.splice(index, 1)
}

function getActionOptions(index: number): DropdownOption[] {
  const isLast = index === block.value.actions.length - 1
  const deleteOption: DropdownOption = {
    label: 'Delete Action',
    icon: 'trash-2',
    theme: 'red',
    onClick: () => deleteAction(index),
  }

  if (!isLast) return [deleteOption]

  return [
    {
      label: 'Add Action',
      icon: 'plus',
      onClick: () => addAction(),
    },
    deleteOption,
  ]
}
</script>

<style scoped></style>
