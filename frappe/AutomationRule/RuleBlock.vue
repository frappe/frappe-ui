<template>
  <template v-for="r in state.rule">
    <div v-if="r.type == 'if'" class="gap-1 flex flex-col">
      <ConditionBlock
        v-model="r.conditions"
        label="If"
        icon="condition"
        :round-first-block="true"
      />
      <template v-for="(action, idx) in r.actions" :key="idx">
        <SetFieldBlock
          v-model="r.actions[idx]"
          :indent="true"
          @deleteAction="r.actions.splice(idx, 1)"
        />
      </template>
    </div>
    <!-- Other Blocks  -->
    <!-- Else -->
  </template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAutomationState } from './automation'
import ConditionBlock from './ConditionBlock.vue'
import SetFieldBlock from './SetFieldBlock.vue'

const state = useAutomationState()
onMounted(() => {
  state.rule = [
    {
      type: 'if',
      conditions: [['priority', 'equals', 'High']],
      actions: [
        {
          type: 'set',
          field: 'agent_group',
          value: 'Product Experts',
        },
      ],
    },
    {
      type: 'else',
      conditions: 'True',
      actions: [
        {
          type: 'set',
          field: 'agent_group',
          value: 'Billing',
        },
      ],
    },
    {
      action: {
        type: 'set',
        field: 'status',
        value: 'open',
      },
    },
  ]
})
</script>

<style scoped></style>
