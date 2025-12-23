<template>
  <template v-for="(r, idx) in state.rule">
    <IfElseBlock
      v-if="r.type == 'if'"
      v-model="state.rule[idx]"
      block-type="if"
    />
    <!-- Other Blocks  -->
    <div v-if="r.type === 'set'">
      <SetFieldBlock v-model="state.rule[idx]" :options="actionOptions(idx)" />
    </div>
    <IfElseBlock
      v-if="r.type == 'else'"
      v-model="state.rule[idx]"
      block-type="else"
    />
  </template>
</template>

<script setup lang="ts">
import { useAutomationState } from './automation'
import IfElseBlock from './IfElseBlock.vue'
import SetFieldBlock from './SetFieldBlock.vue'
import { DropdownOption } from './types'

const state = useAutomationState()
// onMounted(() => {
//   state.rule = [
//     {
//       type: 'if',
//       conditions: [['priority', 'equals', 'High']],
//       actions: [
//         {
//           type: 'set',
//           field: 'agent_group',
//           value: 'Product Experts',
//         },
//       ],
//     },
//     {
//       type: 'else',
//       conditions: 'True',
//       actions: [
//         {
//           type: 'set',
//           field: 'agent_group',
//           value: 'Billing',
//         },
//       ],
//     },
//     {
//       type: 'set',
//       field: 'status',
//       value: 'Open',
//     },
//   ]
// })

function actionOptions(idx: number): DropdownOption[] {
  return [
    {
      label: 'Delete Action',
      icon: 'trash-2',
      theme: 'red',
      onClick: () => {
        state.rule.splice(idx, 1)
      },
    },
  ]
}
</script>

<style scoped></style>
