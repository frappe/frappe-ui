<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  TagsInputRoot,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
} from 'reka-ui'
import Combobox from '../Combobox/Combobox.vue'
import { getLabel, getIcon, RenderIcon, getValue } from '../Combobox/utils'
import { type SimpleOption } from '../Combobox/types'
import { TagInputProps } from './types'

const props = defineProps<TagInputProps>()
const search = ref('')
const options = defineModel<SimpleOption[]>('options', { default: [] })
const modelValue = defineModel<SimpleOption[]>({ default: [] })
const optionsWithIcons = computed(() => {
  if (!props.renderIcon) return options.value
  return options.value.map((k) =>
    getIcon(k) ? k : { ...k, icon: props.renderIcon(k) },
  )
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
        const matches = options.value.filter((opt) =>
          getLabel(opt).toLowerCase().includes(lower),
        )
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
  search.value = ''
}

function removeTag(tag: string) {
  modelValue.value = modelValue.value.filter((t) => t !== tag)
}
</script>

<template>
  <TagsInputRoot
    v-model="modelValue"
    class="flex flex-wrap p-1.5 gap-1.5 w-full items-center justify-start rounded-md bg-surface-gray-2"
  >
    <TagsInputItem
      v-for="item in selectedTags"
      :key="getValue(item)"
      :value="getValue(item)"
      class="shadow-sm m-0.25 mr-0 p-1.5 text-sm bg-white flex items-center justify-center gap-1.5 rounded p-0.5 ring-1 ring-outline-gray-1"
    >
      <RenderIcon :icon="getIcon(item)" />
      <TagsInputItemText class="text-xs text-ink-gray-8">{{
        getLabel(item)
      }}</TagsInputItemText>
      <TagsInputItemDelete
        class="p-0.5 rounded bg-transparent hover:bg-blackA4"
        @click="removeTag(getValue(item))"
      >
        <LucideX class="size-3 text-ink-gray-6" />
      </TagsInputItemDelete>
    </TagsInputItem>
    <!-- fix: keyboard navigation doesn't work -->
    <Combobox
      :options="filteredOptions"
      v-model="search"
      :placeholder
      class="flex-1 min-w-[100px] text-xs focus:outline-none"
      @update:modelValue="addTag"
      :open-on-click="true"
      input-classes="bg-transparent border-none hover:!bg-transparent focus-within:border-none focus-within:!ring-0"
      :hide-trigger="true"
    >
      <template #add-email="{ searchTerm }">
        {{ searchTerm }}
      </template>
    </Combobox>
  </TagsInputRoot>
</template>
