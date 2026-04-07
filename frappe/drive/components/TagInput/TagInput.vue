<script setup lang="ts">
import {
  TagsInputRoot,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
} from 'reka-ui'
import { computed, ref } from 'vue'
import LucideX from '~icons/lucide/x'

import Combobox from '../../../../src/components/Combobox/Combobox.vue'
import { type SimpleOption } from '../../../../src/components/Combobox/types'
import { TagInputProps } from './types'
import { getLabel, getIcon, RenderIcon, getValue } from './utils'

const props = defineProps<TagInputProps>()
const options = defineModel<SimpleOption[]>('options', { default: [] })
const modelValue = defineModel<SimpleOption[]>({ default: [] })
const rerenderCombobox = ref(0)

const optionsWithIcons = computed(() => {
  if (!props.renderIcon) return options.value
  return options.value.map((k) => (getIcon(k) ? k : { ...k, icon: props.renderIcon(k) }))
})
const selectedTags = computed(() => {
  return modelValue.value.map((k) => {
    return optionsWithIcons.value.find((j) => getValue(j) === k)
  })
})

const filteredOptions = computed(() => {
  let remainingOptions = optionsWithIcons.value.filter((opt) => {
    const val = getValue(opt)
    if (!val) return false
    return !modelValue.value.includes(val)
  })

  return [
    ...remainingOptions,
    {
      type: 'custom',
      key: 'add-email',
      label: 'Add email',
      slotName: 'add-email',
      condition: ({ searchTerm }: any) => {
        if (!searchTerm) return false
        const lower = searchTerm.toLowerCase()
        const matches = options.value.filter((opt) => getLabel(opt).toLowerCase().includes(lower))
        return matches.length === 0
      },
      onClick: ({ searchTerm }: any) => {
        const tag = {
          label: searchTerm,
          value: searchTerm,
        }
        options.value.push(tag)
        addTag(searchTerm)
      },
    },
  ]
})

function addTag(tag: string) {
  if (!tag) return
  if (!modelValue.value.includes(tag)) modelValue.value.push(tag)
  rerenderCombobox.value += 1
}

function removeTag(tag: string) {
  modelValue.value = modelValue.value.filter((t) => t !== tag)
}
</script>

<template>
  <TagsInputRoot
    v-model="modelValue"
    class="flex w-full flex-wrap items-center justify-start gap-1.5 rounded-md bg-surface-gray-2 p-1.5"
  >
    <TagsInputItem
      v-for="item in selectedTags"
      :key="getValue(item)"
      :value="getValue(item)"
      class="m-0.25 shadow-xs mr-0 flex items-center justify-center gap-1.5 rounded bg-white p-0.5 p-1.5 text-sm shadow-sm ring-1 ring-outline-gray-2"
    >
      <RenderIcon :icon="getIcon(item)" />
      <TagsInputItemText class="text-xs text-ink-gray-8">{{ getLabel(item) }}</TagsInputItemText>
      <TagsInputItemDelete
        class="rounded-sm bg-transparent p-0.5 hover:bg-surface-gray-1"
        @click="removeTag(getValue(item))"
      >
        <LucideX class="size-3 text-ink-gray-6" />
      </TagsInputItemDelete>
    </TagsInputItem>
    <TagsInputInput :as-child="true">
      <!-- Explicitly set unset type as TagInput passes it in -->
      <Combobox
        :key="rerenderCombobox"
        :options="filteredOptions"
        type=""
        :placeholder
        class="min-w-[100px] flex-1 text-xs focus:outline-none"
        @update:modelValue="addTag"
        :open-on-click="true"
        variant="ghost"
      >
        <template #add-email="{ searchTerm }">
          {{ searchTerm }}
        </template>
      </Combobox>
    </TagsInputInput>
  </TagsInputRoot>
</template>
<style scoped>
[data-state='active'] {
  background: var(--surface-gray-1);
}
[aria-label='Show popup'] {
  display: none;
}
</style>
