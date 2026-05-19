<template>
  <Combobox
    ref="comboboxRef"
    v-bind="$attrs"
    v-model="model"
    v-model:open="open"
    class="group !gap-1"
    :options="linkOptions"
    :disabled="disabled"
    :loading="options.loading && !options.data"
    @update:query="handleInputChange"
    @focus="() => loadOptions('')"
  >
    <template
      v-for="(_, name) in forwardedSlots"
      #[name]="slotProps"
      :key="name"
    >
      <slot :name="name" v-bind="slotProps" />
    </template>

    <template v-if="!disabled && (showClear || showRedirect)" #suffix>
      <div
        class="group-hover:inline-flex group-focus:inline-flex group-focus-within:inline-flex gap-0.5 hidden items-center"
      >
        <button
          v-if="showClear"
          type="button"
          aria-label="Clear"
          class="grid size-4 place-items-center rounded-sm text-ink-gray-5 hover:bg-surface-gray-3 hover:text-ink-gray-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          @click="clearValue"
          @pointerdown.stop
        >
          <span class="lucide-x size-3.5" />
        </button>
        <button
          v-if="showRedirect"
          type="button"
          aria-label="Redirect"
          class="grid size-4 place-items-center rounded-sm text-ink-gray-5 hover:bg-surface-gray-3 hover:text-ink-gray-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          @click="handleRedirect"
          @pointerdown.stop
        >
          <span class="lucide-arrow-right size-3.5" />
        </button>
      </div>
    </template>

    <template #item-create="{ query }">
      <div class="flex">
        <span class="truncate">
          Create
          <span v-if="query" class="font-medium text-ink-gray-8">
            {{ query }}
          </span>
        </span>
      </div>
    </template>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch } from 'vue'
import { Combobox } from '../../src/components/Combobox'
import type {
  ComboboxCustomOption,
  ComboboxOption,
} from '../../src/components/Combobox/types'
import debounce from '../../src/utils/debounce'
import { createResource } from '../../src/resources'
import { frappeRequest } from '../../src/utils/frappeRequest'
import type { LinkProps, LinkOption } from './types'

const props = withDefaults(defineProps<LinkProps>(), {
  filters: () => ({}),
  allowCreate: false,
  allowClear: true,
  allowRedirect: false,
})

const model = defineModel<string | null>({ default: '' })
const open = ref(false)
const comboboxRef = ref<{ focus: () => void } | null>(null)

const emit = defineEmits<{
  (e: 'create', query: string, close: Function): void
  (e: 'redirect', value: string): void
  (e: 'clear'): void
}>()

defineOptions({ inheritAttrs: false })

const slots = useSlots()
const FORWARDED_SLOT_NAMES = [
  'label',
  'description',
  'prefix',
  'trigger',
  'item',
  'item-prefix',
  'item-label',
  'item-suffix',
  'empty',
] as const

const forwardedSlots = computed(() =>
  Object.fromEntries(
    FORWARDED_SLOT_NAMES.filter((name) => slots[name]).map((name) => [
      name,
      slots[name],
    ]),
  ),
)

const options = createResource({
  url: 'frappe.desk.search.search_link',
  params: {
    doctype: props.doctype,
    txt: '',
    filters: props.filters,
  },
  method: 'POST',
  resourceFetcher: frappeRequest,
  transform: (data: LinkOption[]): LinkOption[] =>
    data.map((doc: any) => ({
      label: doc.label || doc.value,
      value: doc.value,
      description: doc.description,
    })),
})

const createNewOption: ComboboxCustomOption = {
  type: 'custom',
  key: 'create',
  label: 'Create New',
  slot: 'create',
  condition: ({ query }: { query: string }) => {
    const q = query.trim().toLowerCase()
    if (!q) return false
    return true
  },
  onClick: ({ query }) => emit('create', query, () => (open.value = false)),
}

const linkOptions = computed<ComboboxOption[]>(() => {
  const _options = options.data || []
  if (props.allowCreate) {
    return [..._options, createNewOption]
  }
  return _options
})

const showClear = computed(() => props.allowClear && !!model.value)
const showRedirect = computed(() => props.allowRedirect && !!model.value)

const loadOptions = (txt: string = '') => {
  options.update({
    params: {
      txt,
      doctype: props.doctype,
      filters: props.filters,
    },
  })
  options.reload()
}

const handleInputChange = debounce((value: string) => {
  loadOptions(value || '')
}, 300)

const clearValue = () => {
  model.value = null
  emit('clear')
  comboboxRef.value?.focus()
}

const handleRedirect = () => {
  if (model.value) {
    open.value = false
    emit('redirect', model.value)
  }
}

watch([() => props.doctype, () => props.filters], () => loadOptions(''), {
  immediate: true,
  deep: true,
})

defineExpose({ reload: loadOptions })
</script>
