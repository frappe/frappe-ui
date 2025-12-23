<template>
  <div class="gap-1 flex flex-col">
    <ConditionBlock
      v-if="blockType === 'if'"
      v-model="block.conditions"
      :label="label"
      icon="condition"
      :round-first-block="true"
      :additional-actions="additionalConditionBlockOptions"
      @delete="handleDeleteCondition"
    />
    <ElseBlock v-else :options="elseBlockOptions" />
    <div v-for="(_, actionIdx) in block.actions" :key="actionIdx" class="group">
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
import ActionIcon from '../Icons/ActionIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import { useAutomationState } from './automation'
import ConditionBlock from './ConditionBlock.vue'
import ElseBlock from './ElseBlock.vue'
import SetFieldBlock from './SetFieldBlock.vue'
import type { DropdownOption, IfBlockData } from './types'

// type : "if" | "else"
const props = defineProps<{
  blockType: 'if' | 'else'
}>()
const label = computed(() => (props.blockType === 'if' ? 'If' : 'Else'))

const block = defineModel() as ModelRef<IfBlockData>

const state = useAutomationState()

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

const elseBlockOptions: DropdownOption[] = [
  ...additionalConditionBlockOptions,
  {
    label: 'Delete Else Block',
    icon: 'trash-2',
    theme: 'red',
    onClick: () => handleDeleteCondition(0, 'else'),
  },
]

function handleDeleteCondition(idx: number, blockType: 'if' | 'else') {
  if (idx !== 0) return
  // if 0 then delete the whole block
  block.value = []
  // check if this was the last if block
  // check if else block is present, if yes delete that
  if (blockType === 'else') return
  findAndDeleteElseBlock()
}

function findAndDeleteElseBlock() {
  const countIfBlock = state.rule.reduce((acc, curr) => {
    if (curr.type === 'if') acc++
    return acc
  }, 0)
  if (countIfBlock === 0) {
    state.rule.splice(state.rule.length - 1)
  }
}
</script>

<style scoped></style>
