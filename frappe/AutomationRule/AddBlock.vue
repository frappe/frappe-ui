<template>
  <div class="gap-x-3 flex">
    <!-- plus button rounded -->
    <Button class="rounded-2xl" variant="subtle" size="sm">
      <LucidePlus class="size-4 text-ink-gray-6" />
    </Button>

    <button
      v-for="action in actions"
      :key="action.label"
      class="flex items-center gap-1 group transition-all"
      @click="action.onClick"
    >
      <component
        :is="action.icon"
        class="text-ink-gray-4 transition-colors"
        :class="action.colorClass"
      />
      <span
        class="text-ink-gray-4 text-p-sm group-hover:text-ink-gray-8 transition-colors"
      >
        {{ action.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Button from '../../src/components/Button/Button.vue'
import ActionIcon from '../Icons/ActionIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import ConditionIcon from '../Icons/ConditionIcon.vue'
import { useAutomationState } from './automation'
const state = useAutomationState()

const actions = [
  {
    label: 'Condition',
    icon: ConditionIcon,
    colorClass: 'group-hover:text-[#7757EE]',
    onClick: () => addConditionBlock(),
  },
  {
    label: 'Action',
    icon: ActionIcon,
    colorClass: 'group-hover:text-[#278F5E]',
    onClick: () => addActionBlock(),
  },
  {
    label: 'Notification',
    icon: BellIcon,
    colorClass: 'group-hover:text-[#318AD8]',
    onClick: () => addNotificationBlock(),
  },
]
function addConditionBlock() {
  // state.rule empty hai ki nai
  // empty then add
  /*
	{
      "type": "if",
      "condition": "",
      "actions": [],
    },
	{
	  "type": "else",
      "condition": "True",
      "actions": [],
	}
	*/
  // we will add if block only if else block exists
  //
}
function addActionBlock() {}
function addNotificationBlock() {}
</script>

<style scoped></style>
