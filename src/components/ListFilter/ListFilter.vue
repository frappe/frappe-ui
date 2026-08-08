<template>
  <!--
    `bare` because the filter row is wider than the standard panel, and the
    panel clips (`overflow-hidden`) so the remove button would be unreachable.
    This is the documented mapping for the old `#body` slot: content that
    brings its own surface.
  -->
  <Popover bare>
    <template #trigger>
      <Button label="Filter">
        <template #prefix><FilterIcon class="h-4" /></template>
        <template v-if="filters.length" #suffix>
          <div
            class="flex h-5 w-5 items-center justify-center rounded bg-surface-gray-10 pt-[1px] text-2xs-medium text-ink-base"
          >
            {{ filters.length }}
          </div>
        </template>
      </Button>
    </template>
    <template #default="{ close }">
      <!--
        A filter row does not shrink below ~550px, which is wider than a phone
        and wider than the panel gets on a short viewport. Capping at reka's
        available width and scrolling inside keeps the remove button reachable
        instead of parking it off-screen — the panel is portaled and fixed, so
        the page cannot scroll to it.
      -->
      <div
        class="my-2 max-w-[var(--reka-popover-content-available-width)] overflow-x-auto rounded-lg border border-outline-gray-1 bg-surface-base shadow-xl"
      >
        <div class="min-w-[400px] p-2">
          <div
            v-if="filters.length"
            v-for="(filter, i) in filters"
            :key="i"
            id="filter-list"
            class="mb-3 flex items-center justify-between gap-2"
          >
            <div class="flex flex-1 items-center gap-2">
              <div
                class="w-13 flex-shrink-0 ps-2 text-end text-base text-ink-gray-5"
              >
                {{ i == 0 ? 'Where' : 'And' }}
              </div>
              <div id="fieldname" class="!min-w-[140px] flex-1">
                <Combobox
                  trigger="button"
                  placeholder="Filter by..."
                  :options="fields"
                  :model-value="filter.fieldname"
                  @update:selected-option="selectFilterField(i, $event)"
                />
              </div>
              <div id="operator" class="!min-w-[140px] flex-shrink-0">
                <FormControl
                  type="select"
                  :options="getOperators(filter.field.fieldtype)"
                  :modelValue="filter.operator"
                  placeholder="Operator"
                  @update:modelValue="updateFilterOperator(i, $event)"
                />
              </div>
              <div id="value" class="!min-w-[140px] flex-1">
                <SearchComplete
                  v-if="
                    typeLink.includes(filter.field.fieldtype) &&
                    ['=', '!='].includes(filter.operator)
                  "
                  :doctype="filter.field.options || ''"
                  :model-value="filter.value"
                  @update:model-value="updateFilterValue(i, $event)"
                  placeholder="Value"
                />
                <component
                  v-else
                  :is="
                    getValueSelector(
                      filter.field.fieldtype,
                      filter.field.options,
                    )
                  "
                  :modelValue="filter.value"
                  @update:modelValue="updateFilterValue(i, $event)"
                  placeholder="Value"
                />
              </div>
            </div>
            <div class="flex-shrink-0">
              <Button
                variant="ghost"
                icon="lucide-x"
                @click="removeFilter(i)"
              />
            </div>
          </div>
          <div
            v-else
            class="mb-3 flex h-7 items-center px-3 text-sm text-ink-gray-5"
          >
            Empty - Choose a field to filter by
          </div>
          <div class="flex items-center justify-between gap-2">
            <Combobox
              v-model="addFilterField"
              :options="fields"
              placeholder="Filter by..."
              @update:selected-option="addFilterFromOption"
            >
              <!--
                Combobox forwards the open toggle onto the #trigger element
                itself, so this Button needs no @click of its own. Autocomplete's
                #target handed out a togglePopover to call by hand; carrying
                that through the rename throws on click.
              -->
              <template #trigger>
                <Button
                  class="!text-ink-gray-5"
                  variant="ghost"
                  label="Add filter"
                >
                  <template #prefix>
                    <span class="lucide-plus size-4" aria-hidden="true" />
                  </template>
                </Button>
              </template>
            </Combobox>
            <Button
              v-if="filters.length"
              class="!text-ink-gray-5"
              variant="ghost"
              label="Clear all filter"
              @click="filters = []"
            />
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { Combobox, FormControl } from '../../index'
import { computed, h, ref } from 'vue'
import FilterIcon from './FilterIcon.vue'
import Popover from '../Popover/Popover.vue'
import SearchComplete from './SearchComplete.vue'
import type {
  ComboboxCustomOption,
  ComboboxOptionValue,
  ComboboxSelectableOption,
} from '../Combobox/types'

/** Payload of Combobox's `update:selectedOption`. */
type SelectedOption = ComboboxSelectableOption | ComboboxCustomOption | null

type FilterFieldtype =
  | 'Check'
  | 'Link'
  | 'Float'
  | 'Int'
  | 'Select'
  | 'Data'
  | 'Long Text'
  | 'Small Text'
  | 'Text Editor'
  | 'Text'
  | 'JSON'
  | 'Code'
  | string

interface DocField {
  fieldname: string
  label?: string
  fieldtype: FilterFieldtype
  options?: string
  is_virtual?: boolean
  [key: string]: any
}

type FilterOperator = '=' | '!=' | 'like' | 'not like' | '<' | '>' | '<=' | '>='
type FilterValue = any
type FiltersDict = Record<string, [FilterOperator, FilterValue]>

interface FilterItem {
  fieldname: string
  operator: FilterOperator
  value: FilterValue
  field: DocField
}

type FieldOption = DocField & {
  label: string
  value: string
  description: string
}

const typeCheck: FilterFieldtype[] = ['Check']
const typeLink: FilterFieldtype[] = ['Link']
const typeNumber: FilterFieldtype[] = ['Float', 'Int']
const typeSelect: FilterFieldtype[] = ['Select']
const typeString = [
  'Data',
  'Long Text',
  'Small Text',
  'Text Editor',
  'Text',
  'JSON',
  'Code',
]

const emits = defineEmits<{
  'update:modelValue': [value: FiltersDict]
}>()

const props = withDefaults(
  defineProps<{
    /** The active filters, keyed by fieldname to `[operator, value]`. */
    modelValue?: FiltersDict
    /** Doctype fields the filter picker can filter by. */
    docfields?: DocField[]
  }>(),
  {
    modelValue: () => ({}),
    docfields: () => [],
  },
)

const fields = computed(() => {
  const fields = props.docfields
    .filter((field) => {
      return (
        !field.is_virtual &&
        (typeCheck.includes(field.fieldtype) ||
          typeLink.includes(field.fieldtype) ||
          typeNumber.includes(field.fieldtype) ||
          typeSelect.includes(field.fieldtype) ||
          typeString.includes(field.fieldtype))
      )
    })
    .map((field) => {
      return {
        label: field.label || field.fieldname,
        value: field.fieldname,
        description: field.fieldtype,
        ...field,
      }
    })
  return fields as FieldOption[]
})

const filters = computed({
  get: () => makeFiltersList(props.modelValue),
  set: (value) => emits('update:modelValue', makeFiltersDict(value)),
})

function makeFiltersList(filtersDict: FiltersDict): FilterItem[] {
  return Object.entries(filtersDict).map(([fieldname, [operator, value]]) => {
    const field = getField(fieldname)
    return {
      fieldname,
      operator,
      value,
      field: field!,
    }
  })
}

function getField(fieldname: string) {
  return fields.value.find((f) => f.fieldname === fieldname)
}

function makeFiltersDict(filtersList: FilterItem[]) {
  return filtersList.reduce<FiltersDict>((acc, filter) => {
    const { fieldname, operator, value } = filter
    acc[fieldname] = [operator, value]
    return acc
  }, {})
}

function getOperators(fieldtype: FilterFieldtype) {
  let options: Array<{ label: string; value: FilterOperator }> = []
  if (typeString.includes(fieldtype) || typeLink.includes(fieldtype)) {
    options.push(
      ...[
        { label: 'Equals', value: '=' as const },
        { label: 'Not Equals', value: '!=' as const },
        { label: 'Like', value: 'like' as const },
        { label: 'Not Like', value: 'not like' as const },
      ],
    )
  }
  if (typeNumber.includes(fieldtype)) {
    options.push(
      ...[
        { label: '<', value: '<' as const },
        { label: '>', value: '>' as const },
        { label: '<=', value: '<=' as const },
        { label: '>=', value: '>=' as const },
        { label: 'Equals', value: '=' as const },
        { label: 'Not Equals', value: '!=' as const },
      ],
    )
  }
  if (typeSelect.includes(fieldtype)) {
    options.push(
      ...[
        { label: 'Equals', value: '=' as const },
        { label: 'Not Equals', value: '!=' as const },
      ],
    )
  }
  if (typeCheck.includes(fieldtype)) {
    options.push(...[{ label: 'Equals', value: '=' as const }])
  }
  return options
}

function getDefaultOperator(fieldtype: FilterFieldtype): FilterOperator {
  if (
    typeSelect.includes(fieldtype) ||
    typeLink.includes(fieldtype) ||
    typeCheck.includes(fieldtype) ||
    typeNumber.includes(fieldtype)
  ) {
    return '='
  }
  return 'like'
}

function getValueSelector(fieldtype: FilterFieldtype, options?: string) {
  if (typeSelect.includes(fieldtype) || typeCheck.includes(fieldtype)) {
    const _options =
      fieldtype == 'Check' ? ['Yes', 'No'] : getSelectOptions(options)
    return h(FormControl, {
      type: 'select',
      options: _options,
    })
  } else {
    return h(FormControl, { type: 'text' })
  }
}

function getDefaultValue(field: DocField) {
  if (typeSelect.includes(field.fieldtype)) {
    return getSelectOptions(field.options)[0]
  }
  if (typeCheck.includes(field.fieldtype)) {
    return 'Yes'
  }
  return ''
}

function getSelectOptions(options = '') {
  return options.split('\n')
}

function addFilter(fieldname: string) {
  const field = getField(fieldname)
  if (!field) return
  const filter = {
    fieldname,
    operator: getDefaultOperator(field.fieldtype),
    value: getDefaultValue(field),
    field,
  }
  filters.value = [...filters.value, filter]
}

// The "Add filter" picker is an action, not a selection — reset it so picking
// the same field twice in a row still fires.
const addFilterField = ref<ComboboxOptionValue | null>(null)

function addFilterFromOption(option: SelectedOption) {
  const fieldname = getOptionValue(option)
  if (fieldname) addFilter(String(fieldname))
  addFilterField.value = null
}

function updateFilter(
  index: number,
  getNextFilter: (filter: FilterItem) => FilterItem,
) {
  filters.value = filters.value.map((filter, i) =>
    i === index ? getNextFilter(filter) : filter,
  )
}

function selectFilterField(index: number, option: SelectedOption) {
  const fieldname = getOptionValue(option)
  if (!fieldname) return

  const field = getField(String(fieldname))
  if (!field) return

  updateFilter(index, () => ({
    fieldname: String(fieldname),
    field,
    operator: getDefaultOperator(field.fieldtype),
    value: getDefaultValue(field),
  }))
}

function updateFilterOperator(index: number, option: unknown) {
  const operator = getOptionValue(option)
  if (!operator) return
  updateFilter(index, (filter) => ({
    ...filter,
    operator: operator as FilterOperator,
  }))
}

function updateFilterValue(index: number, value: FilterValue) {
  updateFilter(index, (filter) => ({ ...filter, value }))
}

function getOptionValue(option: unknown) {
  if (option && typeof option === 'object' && 'value' in option) {
    return (option as { value?: any }).value
  }
  return option
}

function removeFilter(index: number) {
  filters.value = filters.value.filter((_, i) => i !== index)
}
</script>
