<template>
  <Combobox
    v-model="model"
    trigger="button"
    placeholder="Select an option"
    :options="options"
    :loading="r.loading"
    :filterable="false"
    @update:query="(query) => onUpdateQuery(query as string)"
  />
</template>

<script setup lang="ts">
import { Combobox, createListResource } from '../../index'
import { computed, watch } from 'vue'
import type { ComboboxSelectableOption } from '../Combobox/types'

type SearchResult = Record<string, any>

const props = withDefaults(
  defineProps<{
    doctype: string
    searchField?: string
    labelField?: string
    valueField?: string
    pageLength?: number
  }>(),
  {
    searchField: 'name',
    labelField: 'name',
    valueField: 'name',
    pageLength: 10,
  },
)

const model = defineModel<string | null>({ default: null })

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
})

const options = computed<ComboboxSelectableOption[]>(
  () =>
    r.data?.map((result: SearchResult) => ({
      label: result[props.labelField],
      value: result[props.valueField],
    })) || [],
)

// The server already decided what matches the query, so client filtering is
// off (`filterable="false"`) — a second literal substring pass here would drop
// anything the backend matched fuzzily or by id.
//
// The `as string` at the call site is not decoration: Combobox declares
// `update:query` twice, once through `defineModel('query')` and once in
// `ComboboxEmits`, and vue-tsc resolves the pair to the untyped
// `(...args: unknown[]) => any`. Same for `update:modelValue` and
// `update:open`; `update:selectedOption` types correctly.
function onUpdateQuery(query: string) {
  r.update({
    filters: {
      [props.searchField]: ['like', `%${query}%`],
    },
  })

  r.reload()
}
</script>
