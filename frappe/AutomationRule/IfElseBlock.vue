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
    <div
      v-for="(action, actionIdx) in block.actions"
      :key="actionIdx"
      class="group"
    >
      <SetFieldBlock
        v-if="action.type === 'set'"
        v-model="block.actions[actionIdx]"
        :indent="true"
        :options="getActionOptions(actionIdx)"
        :usedFields="addedFields"
      />
      <EmailBlock
        v-if="action.type === 'email'"
        v-model="block.actions[actionIdx]"
        :options="getActionOptions(actionIdx)"
        :indent="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ModelRef } from 'vue'
import ActionIcon from '../Icons/ActionIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import {
  getDummyNotificationAction,
  getDummySetAction,
  useAutomationState,
} from './automation'
import ConditionBlock from './ConditionBlock.vue'
import ElseBlock from './ElseBlock.vue'
import EmailBlock from './EmailBlock.vue'
import SetFieldBlock from './SetFieldBlock.vue'
import type { DropdownOption, IfBlockData } from './types'

const props = defineProps<{
  blockType: 'if' | 'else'
  ruleIdx: number
}>()

const block = defineModel() as ModelRef<IfBlockData>
const state = useAutomationState()

const label = computed(() => (props.blockType === 'if' ? 'If' : 'Else'))

// to hide already addes fields in actions
const addedFields = computed(() =>
  block.value?.actions.map((a) => a.field).filter(Boolean),
)

function addSetAction() {
  block.value?.actions.push(getDummySetAction())
}

function addNotifcation() {
  block.value.actions.push(getDummyNotificationAction())
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

  return [...additionalConditionBlockOptions, deleteOption]
}

const additionalConditionBlockOptions: DropdownOption[] = [
  {
    label: 'Add Action',
    icon: ActionIcon,
    onClick: addSetAction,
  },
  {
    label: 'Add Notification',
    icon: BellIcon,
    onClick: addNotifcation,
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
  state.rule.splice(props.ruleIdx, 1)
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
    state.rule.splice(props.ruleIdx)
  }
}
</script>
