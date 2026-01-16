<template>
  <div v-if="step === 'list'" class="h-full">
    <AutomationList @update:step="updateStep" />
  </div>
  <div v-else-if="step === 'view'" class="h-full">
    <Automation
      @update:step="updateStep"
      :automation-name="automationViewName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Automation from './Automation.vue'
import AutomationList from './AutomationList.vue'

type AutomationStep = 'list' | 'view'

const step = ref<AutomationStep>('list')
const automationViewName = ref<string | null>(null)

function updateStep(newStep: AutomationStep, automationView?: string): void {
  step.value = newStep
  automationViewName.value = automationView || null
}
</script>
<style scoped></style>
