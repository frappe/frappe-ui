<template>
  <div class="flex flex-col gap-1 group">
    <BaseBlock
      icon="notification"
      title="Notify"
      :rounded="action.via === 'rich_text' ? 'top' : 'all'"
      :indent
    >
      <template #meta>
        <div class="flex gap-1.5 items-center">
          <Select
            variant="outline"
            :options="emailFields"
            placeholder="Select Recipient"
            v-model="action.to"
            class="!w-[140px]"
          />
          <Select
            v-if="action.to"
            variant="outline"
            :options="via"
            placeholder="Select Method"
            v-model="action.via"
            class="!w-[140px]"
          />
          <Link
            v-if="action.via === 'template'"
            variant="outline"
            :doctype="templateDoctype"
            placeholder="Select Method"
            v-model="action.template"
            class="!w-[140px] [&>div>div>div]:bg-surface-white"
          />
          <div>
            <label
              class="flex items-center gap-1 text-p-sm justify-center text-ink-gray-7"
            >
              <Checkbox v-model="action.create_communication" />
              Create Communication?
            </label>
          </div>
        </div>
      </template>
      <template #action>
        <DropdownOptions :options="options" />
      </template>
    </BaseBlock>
    <BaseBlock
      icon="align"
      title="Text"
      rounded="bottom"
      v-if="action.via === 'rich_text'"
      :indent
    >
      <template #footer>
        <TextEditor
          class="bg-surface-white rounded-sm px-2.5 py-2 max-h-[240px] overflow-y-scroll"
          placeholder="{{ fieldname }} to add dynamic values"
          editor-class="prose-sm"
          v-model="action.message"
        />
      </template>
    </BaseBlock>
  </div>
</template>

<script setup lang="ts">
import { ModelRef } from 'vue'
import Checkbox from '../../src/components/Checkbox/Checkbox.vue'
import Select from '../../src/components/Select/Select.vue'
import TextEditor from '../../src/components/TextEditor/TextEditor.vue'
import { useDoctypeMeta } from '../../src/data-fetching/useDoctypeMeta'
import Link from '../Link/Link.vue'
import { useAutomationState } from './automation'
import BaseBlock from './BaseBlock.vue'
import DropdownOptions from './DropdownOptions.vue'
import { DropdownOption, SendEmailAction } from './types'

const props = withDefaults(
  defineProps<{
    indent?: boolean
    options?: DropdownOption[]
  }>(),
  {
    indent: false,
    options: () => [],
  },
)

const action = defineModel() as ModelRef<SendEmailAction>
const state = useAutomationState()

const { emailFields } = useDoctypeMeta(state.dt)

const via = [
  { label: 'Rich Text', value: 'rich_text' },
  { label: 'Template', value: 'template' },
]
// will come from prop config
const templateDoctype = 'HD Canned Response'
</script>

<style scoped></style>
