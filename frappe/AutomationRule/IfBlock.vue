<template>
  <div class="gap-1 flex flex-col">
    <ConditionBlock
      v-model="block.conditions"
      label="If"
      icon="condition"
      :round-first-block="true"
      :additional-actions="additionalConditionBlockOptions"
      @delete="handleDeleteCondition"
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
import { computed, ModelRef, ref } from 'vue'
import ActionIcon from '../Icons/ActionIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import ConditionBlock from './ConditionBlock.vue'
import SetFieldBlock from './SetFieldBlock.vue'
import type { DropdownOption, IfBlockData } from './types'

const block = defineModel() as ModelRef<IfBlockData>

const addedFields = computed(() =>
  block.value?.actions.map((a) => a.field).filter(Boolean),
)

function addAction() {
  block.value?.actions.push({ type: 'set', field: '', value: '' })
}

function deleteAction(index: number) {
  block.value?.actions.splice(index, 1)
}

function getActionOptions(index: number): DropdownOption[] {
  const isLast = index === block.value?.actions.length - 1
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

const additionalConditionBlockOptions: DropdownOption[] = [
  {
    label: 'Add Action',
    icon: ActionIcon,
    onClick: addAction,
  },
  {
    label: 'Add Notification',
    icon: BellIcon,
    onClick: addAction,
  },
]

const showConfirmDialog = ref(false)
function handleDeleteCondition(idx: number) {
  if (idx !== 0) return
  // if 0 then delete the whole if block
  block.value = []
}
</script>

<style scoped></style>
