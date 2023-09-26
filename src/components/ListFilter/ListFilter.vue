<template>
  <NestedPopover>
    <template #target>
      <Button label="Filter">
        <template #prefix><FilterIcon class="h-4" /></template>
        <template v-if="filters.size" #suffix>
          <div
            class="flex h-5 w-5 items-center justify-center rounded bg-gray-900 pt-[1px] text-2xs font-medium text-white"
          >
            {{ filters.size }}
          </div>
        </template>
      </Button>
    </template>
    <template #body="{ close }">
      <div class="my-2 rounded-lg border border-gray-100 bg-white shadow-xl">
        <div class="min-w-[400px] p-2">
          <div
            v-if="filters.size"
            v-for="(f, i) in filters"
            :key="i"
            id="filter-list"
            class="mb-3 flex items-center justify-between gap-2"
          >
            <div class="flex flex-1 items-center gap-2">
              <div
                class="w-13 flex-shrink-0 pl-2 text-end text-base text-gray-600"
              >
                {{ i == 0 ? 'Where' : 'And' }}
              </div>
              <div id="fieldname" class="!min-w-[140px] flex-1">
                <Autocomplete
                  :value="f.field.fieldname"
                  :options="fields"
                  @change="(e) => updateFilter(e, i)"
                  placeholder="Filter by..."
                />
              </div>
              <div id="operator" class="!min-w-[140px] flex-shrink-0">
                <FormControl
                  type="select"
                  v-model="f.operator"
                  :options="getOperators(f.field.fieldtype)"
                  placeholder="Operator"
                />
              </div>
              <div id="value" class="!min-w-[140px] flex-1">
                <SearchComplete
                  v-if="
                    typeLink.includes(f.field.fieldtype) &&
                    f.operator.includes('equals')
                  "
                  :doctype="f.field.options"
                  :value="f.value"
                  @change="(v) => (f.value = v.value)"
                  placeholder="Value"
                />
                <component
                  v-else
                  :is="getValueSelector(f.field.fieldtype, f.field.options)"
                  v-model="f.value"
                  placeholder="Value"
                />
              </div>
            </div>
            <div class="flex-shrink-0">
              <Button variant="ghost" icon="x" @click="removeFilter(i)" />
            </div>
          </div>
          <div
            v-else
            class="mb-3 flex h-7 items-center px-3 text-sm text-gray-600"
          >
            Empty - Choose a field to filter by
          </div>
          <div class="flex items-center justify-between gap-2">
            <Autocomplete
              value=""
              :options="fields"
              @change="(e) => setfilter(e)"
              placeholder="Filter by..."
            >
              <template #target="{ togglePopover }">
                <Button
                  class="!text-gray-600"
                  variant="ghost"
                  @click="togglePopover()"
                  label="Add filter"
                >
                  <template #prefix>
                    <FeatherIcon name="plus" class="h-4" />
                  </template>
                </Button>
              </template>
            </Autocomplete>
            <Button
              v-if="filters.size"
              class="!text-gray-600"
              variant="ghost"
              label="Clear all filter"
              @click="clearfilter(close)"
            />
          </div>
        </div>
      </div>
    </template>
  </NestedPopover>
</template>
<script setup>
import { Autocomplete, FeatherIcon, FormControl, debounce } from 'frappe-ui'
import { computed, h, ref, watch } from 'vue'
import FilterIcon from './FilterIcon.vue'
import NestedPopover from './NestedPopover.vue'
import SearchComplete from './SearchComplete.vue'

const typeCheck = ['Check']
const typeLink = ['Link']
const typeNumber = ['Float', 'Int']
const typeSelect = ['Select']
const typeString = [
  'Data',
  'Long Text',
  'Small Text',
  'Text Editor',
  'Text',
  'JSON',
  'Code',
]

const emits = defineEmits(['change'])
const props = defineProps({
  docfields: {
    type: Array,
    default: () => [],
  },
})

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
        label: field.label,
        value: field.fieldname,
        description: field.fieldtype,
        ...field,
      }
    })
  return fields
})

const filters = ref(new Set())
const filtersDict = computed(() => makeFiltersDict(filters.value))
watch(
  filters,
  debounce(() => emits('change', filtersDict.value), 300),
  { deep: true }
)

function getOperators(fieldtype) {
  let options = []
  if (typeString.includes(fieldtype) || typeLink.includes(fieldtype)) {
    options.push(
      ...[
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not equals' },
        { label: 'Like', value: 'like' },
        { label: 'Not Like', value: 'not like' },
      ]
    )
  }
  if (typeNumber.includes(fieldtype)) {
    options.push(
      ...[
        { label: '<', value: '<' },
        { label: '>', value: '>' },
        { label: '<=', value: '<=' },
        { label: '>=', value: '>=' },
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not equals' },
      ]
    )
  }
  if (typeSelect.includes(fieldtype)) {
    options.push(
      ...[
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not equals' },
      ]
    )
  }
  if (typeCheck.includes(fieldtype)) {
    options.push(...[{ label: 'Equals', value: 'equals' }])
  }
  return options
}

function getDefaultOperator(fieldtype) {
  if (
    typeSelect.includes(fieldtype) ||
    typeLink.includes(fieldtype) ||
    typeCheck.includes(fieldtype) ||
    typeNumber.includes(fieldtype)
  ) {
    return 'equals'
  }
  return 'like'
}

function getValueSelector(fieldtype, options) {
  if (typeSelect.includes(fieldtype) || typeCheck.includes(fieldtype)) {
    const _options =
      fieldtype == 'Check' ? ['Yes', 'No'] : getSelectOptions(options)
    return h(FormControl, {
      type: 'select',
      options: _options.map((o) => ({
        label: o,
        value: o,
      })),
    })
  } else {
    return h(FormControl, { type: 'text' })
  }
}

function getDefaultValue(field) {
  if (typeSelect.includes(field.fieldtype)) {
    return getSelectOptions(field.options)[0]
  }
  if (typeCheck.includes(field.fieldtype)) {
    return 'Yes'
  }
  return ''
}

function getSelectOptions(options) {
  return options.split('\n')
}

function setfilter(data) {
  if (!data) return
  filters.value.add({
    field: {
      label: data.label,
      fieldname: data.value,
      fieldtype: data.fieldtype,
      options: data.options,
    },
    fieldname: data.value,
    operator: getDefaultOperator(data.fieldtype),
    value: getDefaultValue(data),
  })
}

function updateFilter(data, index) {
  filters.value.delete(Array.from(filters.value)[index])
  if (!data) return
  filters.value.add({
    fieldname: data.value,
    operator: getDefaultOperator(data.fieldtype),
    value: getDefaultValue(data),
    field: {
      label: data.label,
      fieldname: data.value,
      fieldtype: data.fieldtype,
      options: data.options,
    },
  })
}

function removeFilter(index) {
  filters.value.delete(Array.from(filters.value)[index])
}

function clearfilter(close) {
  filters.value.clear()
  close()
}

function makeFiltersDict(filters) {
  const operatorMap = {
    equals: '=',
    'not equals': '!=',
    yes: true,
    no: false,
    like: 'LIKE',
    'not like': 'NOT LIKE',
    '>': '>',
    '<': '<',
    '>=': '>=',
    '<=': '<=',
  }
  const filtersDict = {}
  for (const filter of filters) {
    const { fieldname, operator, value } = filter
    if (value) {
      switch (operator) {
        case 'equals':
        case 'not equals':
          filtersDict[fieldname] = [operatorMap[operator], value]
          break
        case 'like':
        case 'not like':
          filtersDict[fieldname] = [operatorMap[operator], `%${value}%`]
          break
        case '>':
        case '<':
        case '>=':
        case '<=':
          filtersDict[fieldname] = [operatorMap[operator], value]
          break
      }
    }
  }
  return filtersDict
}
</script>
