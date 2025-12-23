<template>
  <div class="gap-x-3 flex">
    <!-- plus button rounded -->
    <Button class="rounded-2xl" variant="subtle" size="sm">
      <LucidePlus class="size-4 text-ink-gray-6" />
    </Button>
    <template v-for="action in actions">
      <button
        :key="action.label"
        class="flex items-center gap-1 group transition-all"
        @click="action.onClick"
        v-if="action.condition"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '../../src/components/Button/Button.vue'
import ActionIcon from '../Icons/ActionIcon.vue'
import BellIcon from '../Icons/BellIcon.vue'
import ConditionIcon from '../Icons/ConditionIcon.vue'
import { useAutomationState } from './automation'
const state = useAutomationState()

const hasElseBlock = computed(() => state.rule.some((r) => r.type === 'else'))
const hasIfBlock = computed(() => state.rule.some((r) => r.type === 'if'))

const actions = computed(() => [
  {
    label: 'Condition',
    icon: ConditionIcon,
    colorClass: 'group-hover:text-[#7757EE]',
    onClick: () => addConditionBlock(),
    condition: true,
  },
  {
    label: 'Else',
    icon: ConditionIcon,
    colorClass: 'group-hover:text-[#7757EE]',
    onClick: () => addElseBlock(),
    condition: !hasElseBlock.value && hasIfBlock.value,
  },
  {
    label: 'Action',
    icon: ActionIcon,
    colorClass: 'group-hover:text-[#278F5E]',
    onClick: () => addActionBlock(),
    condition: true,
  },
  {
    label: 'Notification',
    icon: BellIcon,
    colorClass: 'group-hover:text-[#318AD8]',
    onClick: () => addNotificationBlock(),
    condition: true,
  },
])
function addConditionBlock() {
  insertBeforeElse({
    type: 'if',
    conditions: [['', '', '']],
    actions: [],
  })
}

function addElseBlock() {
  // add this at the last of the rule array
  if (hasElseBlock.value) return
  state.rule.push({
    type: 'else',
    condition: 'True',
    actions: [],
  })
}

function addActionBlock() {
  insertBeforeElse({
    type: 'set',
    field: '',
    value: '',
  })
}

function addNotificationBlock() {}

function insertBeforeElse(block: any) {
  const elseIdx = state.rule.findIndex((r) => r.type === 'else')
  if (elseIdx === -1) {
    // No else block, push to end
    state.rule.push(block)
  } else {
    // Insert before else block
    state.rule.splice(elseIdx, 0, block)
  }
}
</script>

<style scoped></style>
