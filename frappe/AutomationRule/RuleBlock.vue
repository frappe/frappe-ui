<template>
  <template v-for="(r, idx) in state.rule">
    <IfBlock v-if="r.type == 'if'" v-model="state.rule[idx]" />
    <!-- Other Blocks  -->
    <div v-if="r.type === 'set'">
      <SetFieldBlock v-model="state.rule[idx]" />
    </div>
    <!-- Else Block -->
  </template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAutomationState } from './automation'
import IfBlock from './IfBlock.vue'
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
      type: 'set',
      field: 'status',
      value: 'Open',
    },
  ]
})
</script>

<style scoped></style>
