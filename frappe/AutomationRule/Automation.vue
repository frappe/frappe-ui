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
          :disabled="resource.loading"
        />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-6" v-if="!resource.loading">
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
      <div v-else class="flex items-center justify-center h-full">
        <LoadingIndicator class="w-6" />
      </div>
    </template>
  </SettingsLayoutBase>
</template>

<script setup lang="ts">
import {
  call,
  createResource,
  LoadingIndicator,
  Switch,
  toast,
} from 'frappe-ui'
import { computed, onMounted, provide, reactive, ref } from 'vue'
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

const _automationName = ref(props.automationName)

const DOCTYPE_NAME = 'Automation Rule'

const isNew = computed(() => !_automationName.value)
const dependencyLabel = computed(() => {
  if (isNew.value) return 'New Automation'
  return _automationName.value
})

const eventMap = {
  created: 'On Creation',
  updated: 'On Update',
  time: 'Timer',
}
const reverseEventMap = {
  'On Creation': 'created',
  'On Update': 'updated',
  Timer: 'time',
}

const state = reactive({
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
  if (isNew.value) {
    await createAutomation()
  } else {
    await updateAutomation()
  }
}

async function createAutomation() {
  const doc = prepareDoc()
  await call(
    'frappe.client.insert',
    {
      doc,
    },
    {
      onSuccess: () => {
        toast.success('Automation created')
      },
    },
  )
  resource.submit({ doctype: DOCTYPE_NAME, name: state.name })
  _automationName.value = doc.name
}

const hasNameChanged = computed(() => resource.data.name !== state.name)

async function updateAutomation() {
  if (hasNameChanged.value) {
    const newName = await call('frappe.client.rename_doc', {
      doctype: DOCTYPE_NAME,
      old_name: _automationName.value,
      new_name: state.name,
    })
    _automationName.value = newName
  }

  const doc = prepareDoc()
  await call(
    'frappe.client.set_value',
    {
      doctype: DOCTYPE_NAME,
      name: doc.name,
      fieldname: { ...doc },
    },
    {
      onSuccess: () => {
        toast.success('Automation upated')
      },
    },
  )
  resource.submit({ doctype: DOCTYPE_NAME, name: state.name })
}

function prepareDoc() {
  return {
    doctype: DOCTYPE_NAME,
    name: state.name,
    dt: state.dt,
    doctype_event: eventMap[state.eventType],
    rule: parseRule(),
    enabled: state.enabled,
  }
}

function parseRule() {
  const rule = {
    presets_json: state.presetsJson,
    rule: state.rule,
  }
  return JSON.stringify(rule)
}

function handleRule(rule: string) {
  try {
    const ruleJson = JSON.parse(rule)
    const presets = ruleJson.hasOwnProperty('presets_json')
      ? ruleJson.presets_json
      : []
    const _rule = ruleJson.hasOwnProperty('rule') ? ruleJson.rule : []

    return [presets, _rule]
  } catch (err) {
    console.error(err)
  }
}

const resource = createResource({
  url: 'frappe.client.get',
  params: {
    doctype: DOCTYPE_NAME,
    name: _automationName.value,
  },
  onSuccess(data) {
    // state
    state.name = data.name
    state.dt = data.dt
    state.eventType = reverseEventMap[data.doctype_event]
    state.enabled = Boolean(data.enabled)
    const [presets, rule] = handleRule(data.rule)
    state.presetsJson = presets
    state.rule = rule
  },
})

onMounted(() => {
  if (isNew.value) return
  resource.reload()
})

provide(AutomationStateSymbol, state)
</script>

<style scoped></style>
