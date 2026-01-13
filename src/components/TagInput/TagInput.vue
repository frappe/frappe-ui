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
const modelValue = defineModel<SimpleOption[]>({ default: [] })
const selectedTags = computed(() =>
  modelValue.value.map((k) => props.options.find((j) => getValue(j) === k)),
)
const filteredOptions = computed(() =>
  props.options.filter((opt) => {
    const val = getValue(opt)
    if (!val) return false
    return (
      (!search.value ||
        val.toLowerCase().includes(search.value.toLowerCase())) &&
      !modelValue.value.includes(val)
    )
  }),
)

function addTag(tag: string) {
  if (!tag) return
  if (!modelValue.value.includes(tag)) modelValue.value.push(tag)
  search.value = ''
  console.log(tag, search.value)
}

function removeTag(tag: string) {
  modelValue.value = modelValue.value.filter((t) => t !== tag)
}
</script>

<template>
  <TagsInputRoot
    v-model="modelValue"
    class="flex flex-wrap justify-between p-0.5 items-start justify-center rounded-md bg-surface-gray-2 gap-2 items-center w-full"
  >
    <TagsInputItem
      v-for="item in selectedTags"
      :key="getValue(item)"
      :value="getValue(item)"
      class="shadow-sm m-0.5 px-2 py-1.5 text-sm bg-white flex items-center justify-center gap-1.5 rounded p-0.5 ring-1 ring-outline-gray-1"
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
    <Combobox
      :options="filteredOptions"
      v-model="search"
      :placeholder
      class="flex-1 min-w-[100px] text-xs focus:outline-none"
      @update:modelValue="addTag"
      :open-on-click="true"
      :input-classes="[
        'bg-transparent border-none hover:!bg-transparent focus-within:ring-0 focus-within:border-none',
        modelValue.length && '!p-0',
      ]"
      :hide-trigger="true"
    />
  </TagsInputRoot>
</template>
