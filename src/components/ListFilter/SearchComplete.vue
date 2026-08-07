<template>
  <Combobox
    v-model="model"
    v-model:query="query"
    trigger="button"
    placeholder="Select an option"
    :options="options"
    :loading="r.loading"
    :filterable="false"
    @update:open="(open) => onUpdateOpen(open as boolean)"
    @update:selected-option="rememberSelection"
  />
</template>

<script setup lang="ts">
import { Combobox, createListResource } from '../../index'
import { computed, ref, watch } from 'vue'
import type {
  ComboboxCustomOption,
  ComboboxSelectableOption,
} from '../Combobox/types'

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

const results = computed<ComboboxSelectableOption[]>(
  () =>
    r.data?.map((result: SearchResult) => ({
      label: result[props.labelField],
      value: result[props.valueField],
    })) || [],
)

// Combobox resolves its button label out of the options it was handed, and
// here those options are one page of server results. Type a query the selected
// row no longer matches and it leaves the list, so the label would drop back to
// the placeholder. Hold on to the option that was selected and merge it back
// in — the pattern `Combobox.md` prescribes for server-backed pickers.
const selectedOption = ref<ComboboxSelectableOption | null>(null)

const options = computed<ComboboxSelectableOption[]>(() => {
  const remembered = selectedOption.value
  if (!remembered) return results.value
  if (results.value.some((option) => option.value === remembered.value)) {
    return results.value
  }
  return [remembered, ...results.value]
})

function rememberSelection(
  option: ComboboxSelectableOption | ComboboxCustomOption | null,
) {
  // This picker declares no custom rows, so anything but a selectable option
  // means the selection was cleared.
  selectedOption.value = option && option.type !== 'custom' ? option : null
}

// A value handed in by the parent was never picked through the popover, so
// there is nothing to remember until the results carry it. Resolving it here
// covers that case without disturbing a selection already made: once the
// remembered option matches the model, later result sets are ignored.
watch(
  [results, model],
  ([list, value]) => {
    if (value === null || value === undefined || value === '') {
      selectedOption.value = null
      return
    }
    if (selectedOption.value?.value === value) return
    selectedOption.value = list.find((option) => option.value === value) ?? null
  },
  { immediate: true },
)

// Combobox treats a listened-to `update:query` as a bound query and hands
// ownership over, so this component has to own it for real: listening alone
// left the search box holding the committed label ("Alpha"), and the next
// keystroke appended to it ("AlphaBeta"). Owning it means resetting the filter
// each time the popover opens, which is what an unbound query would have done.
const query = ref('')

watch(query, (value) => {
  // The server already decided what matches, so client filtering stays off
  // (`filterable="false"`) — a second literal substring pass would drop
  // anything the backend matched fuzzily or by id.
  r.update({
    filters: {
      [props.searchField]: ['like', `%${value}%`],
    },
  })

  r.reload()
})

// The `as boolean` at the call site is not decoration: Combobox declares
// `update:open` twice, once through `defineModel('open')` and once in
// `ComboboxEmits`, and vue-tsc resolves the pair to the untyped
// `(...args: unknown[]) => any`. Same for `update:query` and
// `update:modelValue`; `update:selectedOption` types correctly.
function onUpdateOpen(open: boolean) {
  if (open) query.value = ''
}
</script>
