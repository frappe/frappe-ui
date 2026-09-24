<script setup lang="ts">
// Figma: espresso-2.0 › Popover › filter (30869:37755). 380px, p 8, 12px
// radius, lg shadow, 8px gaps:
//   rows    28px, 8px apart: a 62px right-aligned 14 gray-500 "Where" /
//           "And" · 8px · subtle sm selects — field (88), operator (45),
//           value (109) — · a ghost sm × to drop the row. The selects take
//           Figma's pr 6 · 4px gap to the chevron (frappe-ui's are 8 · 8);
//           each column fits its widest entry, and the popover grows past
//           380 only when a value needs it
//   footer  ghost sm "+ Add filter" and "Reset filters", 14 gray-500
// Each field brings its own values; changing the field resets the value.
import { computed, ref } from 'vue'
import { Button, Select } from '../../../src'

const emit = defineEmits<{ change: [filters: Filter[]] }>()

const FIELDS: Record<string, string[]> = {
  Industry: ['Advertising', 'Education', 'Finance', 'Healthcare', 'Retail', 'Technology'],
  Status: ['New', 'Contacted', 'Demo', 'Qualified', 'Won', 'Lost'],
  Source: ['Website', 'Referral', 'Campaign', 'Cold call', 'Event'],
  Territory: ['India', 'United States', 'Europe', 'Middle East', 'Asia Pacific'],
  Owner: ['Jacob Salvi', 'Michelle Alva', 'Shariq Ansari', 'Janet Cooper'],
}

const OPERATORS = [
  { label: 'is', value: 'is' },
  { label: 'is not', value: 'is not' },
]

const fieldOptions = Object.keys(FIELDS).map((f) => ({ label: f, value: f }))
const valueOptions = (field: string) => FIELDS[field].map((v) => ({ label: v, value: v }))

interface Filter {
  id: number
  field: string
  operator: string
  value: string
}

let nextId = 0
const DEFAULTS = (): Filter[] => [
  { id: nextId++, field: 'Industry', operator: 'is', value: 'Advertising' },
  { id: nextId++, field: 'Status', operator: 'is', value: 'Demo' },
]

const filters = ref<Filter[]>(DEFAULTS())

// the next field not yet filtered on, else the first
const unusedField = computed(
  () => Object.keys(FIELDS).find((f) => !filters.value.some((x) => x.field === f)) ?? 'Industry',
)

function setField(filter: Filter, field: string) {
  filter.field = field
  filter.value = FIELDS[field][0]
  emit('change', filters.value)
}

function addFilter() {
  const field = unusedField.value
  filters.value.push({ id: nextId++, field, operator: 'is', value: FIELDS[field][0] })
  emit('change', filters.value)
}

function removeFilter(filter: Filter) {
  filters.value = filters.value.filter((f) => f !== filter)
  emit('change', filters.value)
}

function reset() {
  filters.value = DEFAULTS()
  emit('change', filters.value)
}
</script>

<template>
  <div
    class="flex w-max min-w-[380px] flex-col gap-2 rounded-6 bg-surface-elevation-2 p-2 shadow-lg"
    role="dialog"
    aria-label="Filters"
  >
    <!-- one grid for all rows, so the columns line up down the list -->
    <div
      v-if="filters.length"
      class="grid grid-cols-[62px_auto_auto_minmax(0,auto)_28px] items-center gap-2"
    >
      <div v-for="(f, i) in filters" :key="f.id" class="contents">
        <span class="text-right text-base text-ink-gray-5">
          {{ i === 0 ? 'Where' : 'And' }}
        </span>
        <Select
          :model-value="f.field"
          :options="fieldOptions"
          class="w-full !gap-1 !pr-1.5"
          :aria-label="`Filter ${i + 1} field`"
          @update:model-value="(v: string) => setField(f, v)"
        />
        <Select
          v-model="f.operator"
          :options="OPERATORS"
          class="w-full !gap-1 !pr-1.5"
          :aria-label="`Filter ${i + 1} operator`"
          @update:model-value="emit('change', filters)"
        />
        <Select
          v-model="f.value"
          :options="valueOptions(f.field)"
          class="w-full min-w-[109px] !gap-1 !pr-1.5"
          :aria-label="`Filter ${i + 1} value`"
          @update:model-value="emit('change', filters)"
        />
        <Button
          variant="ghost"
          size="sm"
          :label="`Remove filter ${i + 1}`"
          @click="removeFilter(f)"
        >
          <template #icon><span class="lucide-x size-4 text-ink-gray-7" /></template>
        </Button>
      </div>
    </div>
    <p v-else class="px-2 py-1.5 text-base text-ink-gray-5">No filters applied</p>

    <div class="flex h-7 items-center justify-between">
      <Button variant="ghost" size="sm" class="!text-ink-gray-5" @click="addFilter">
        <template #prefix><span class="lucide-plus size-4" /></template>
        Add filter
      </Button>
      <Button variant="ghost" size="sm" class="!text-ink-gray-5" @click="reset">
        Reset filters
      </Button>
    </div>
  </div>
</template>
