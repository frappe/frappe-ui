<template>
  <SettingsLayoutBase>
    <template #title>
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          icon-left="chevron-left"
          :label="dependencyLabel"
          size="md"
          @click="$emit('update:step', 'list')"
          class="cursor-pointer -ml-4 hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:none active:bg-transparent active:outline-none active:ring-0 active:ring-offset-0 active:text-ink-gray-5 font-semibold text-ink-gray-7 text-lg hover:opacity-70 !pr-0"
        />
        <!-- <Badge v-if="isDirty" theme="orange"> {{ __("Unsaved") }} </Badge> -->
      </div>
    </template>
    <template #header-actions>
      <div class="flex gap-4 items-center">
        <div class="flex gap-2 items-center">
          <Switch v-model="state.enabled" class="!w-fit" />
          <span class="text-p-base text-ink-gray-6">
            {{ 'Enabled' }}
          </span>
        </div>
        <Button
          :label="'Save'"
          variant="solid"
          size="sm"
          @click="handleSubmit"
        />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-6">
        <NameBlock v-model="state.name" />
        <ScopeBlock :doctypes="[{ label: 'Tickets', value: 'HD Ticket' }]" />
        <WhenBlock v-if="state.dt" />
        <RuleBlock v-if="state.dt" />
        <!-- RuleBlock -->
        <!-- Can include -->
        <!-- ConditionBlock -->
        <!-- NotificationBlock -->
        <!-- ActionBlock -->
        <AddBlock />
      </div>
    </template>
  </SettingsLayoutBase>
</template>

<script setup lang="ts">
import { call, Switch } from 'frappe-ui'
import { computed, provide, ref } from 'vue'
import SettingsLayoutBase from '../../src/components/SettingsLayoutBase.vue'
import AddBlock from './AddBlock.vue'
import NameBlock from './NameBlock.vue'
import RuleBlock from './RuleBlock.vue'
import ScopeBlock from './ScopeBlock.vue'
import WhenBlock from './WhenBlock.vue'
import { AutomationStateSymbol } from './types'

const props = defineProps<{
  automationName?: string | null
}>()

const isNew = computed(() => !props.automationName)
const dependencyLabel = computed(() => {
  if (isNew.value) return 'New Automation'
  return props.automationName
})
const state = ref({
  name: '',
  enabled: false,
  dt: '',
  eventType: 'created' as 'created' | 'updated' | 'time',
  selectedTimerOption: 0,
  presets: '',
  presetsJson: [],
  rule: [],
})
async function handleSubmit(): Promise<void> {
  console.log('Save automation')
  console.log(state)
  let doc = await call('frappe.client.insert', {
    doc: {
      doctype: 'Automation Rule',
      name: state.value.name,
      dt: state.value.dt,
      doctype_event: getEventType(),
      rule: getRule(),
      enabled: state.value.enabled,
    },
  })
  console.log(doc.name)
}

function getEventType() {
  if (state.value.eventType === 'created') return 'On Creation'
  if (state.value.eventType === 'updated') return 'On Update'
}

function getRule() {
  const rule = {
    presets_json: state.value.presetsJson,
    rule: state.value.rule,
  }
  return JSON.stringify(rule)
}

provide(AutomationStateSymbol, state.value)
</script>

<style scoped></style>
