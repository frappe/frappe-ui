<template>
  <Autocomplete
    placeholder="Select an option"
    :options="options"
    :value="selection"
    @update:query="onUpdateQuery"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { Autocomplete, createListResource } from '../../index'
import { computed, ref, watch } from 'vue'
import type { Option } from '../Autocomplete/types'

type SearchResult = Record<string, any>

const props = withDefaults(
  defineProps<{
    value?: string
    doctype: string
    searchField?: string
    labelField?: string
    valueField?: string
    pageLength?: number
  }>(),
  {
    value: '',
    searchField: 'name',
    labelField: 'name',
    valueField: 'name',
    pageLength: 10,
  },
)

watch(
  () => props.doctype,
  (value) => {
    r.doctype = value
    r.reload()
  },
)

const r = createListResource({
  doctype: props.doctype,
  pageLength: props.pageLength,
  cache: ['link_doctype', props.doctype],
  auto: true,
  fields: [props.labelField, props.searchField, props.valueField],
  onSuccess: () => {
    selection.value = props.value
      ? (options.value.find((o) => o.value === props.value) ?? null)
      : null
  },
})
const options = computed<Option[]>(
  () =>
    r.data?.map((result: SearchResult) => ({
      label: result[props.labelField],
      value: result[props.valueField],
    })) || [],
)
const selection = ref<Option | null>(null)

function onChange(value: Option) {
  selection.value = value
}

function onUpdateQuery(query: string) {
  r.update({
    filters: {
      [props.searchField]: ['like', `%${query}%`],
    },
  })

  r.reload()
}
</script>
