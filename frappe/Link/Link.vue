<template>
  <div class="flex flex-col gap-1.5" :class="attrs.class" :style="attrs.style">
    <FormLabel v-if="label" :label="label" size="sm" :required="required" />
    <Combobox
      v-model="model"
      :placeholder="placeholder || `Select ${doctype}`"
      :options="linkOptions"
      @input="handleInputChange"
      @focus="() => loadOptions('')"
      :open-on-focus="true"
      v-bind="attrsWithoutClassStyle"
      :variant="props.variant"
    >
      <template #create-new="{ searchTerm }">
        <LucidePlus class="size-4 mr-2" />
        <span class="font-medium"> Create new {{ doctype }}</span>
      </template>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { watch, useAttrs, computed } from 'vue'
import { Combobox, type ComboboxOption } from '../../src/components/Combobox'
import FormLabel from '../../src/components/FormLabel.vue'
import debounce from '../../src/utils/debounce'
// @ts-ignore - Vue SFC without explicit types
import { createResource } from '../../src/resources'
import { frappeRequest } from '../../src/utils/frappeRequest'
import type { LinkProps, SelectOption } from './types'
import LucidePlus from '~icons/lucide/plus'

const props = withDefaults(defineProps<LinkProps>(), {
  label: '',
  filters: () => ({}),
  variant: 'subtle',
})
const model = defineModel<string | null>({ default: '' })
const emit = defineEmits<{
  (e: 'create', searchTerm: string): void
}>()
defineOptions({ inheritAttrs: false })

const attrs = useAttrs() as Record<string, any>
const attrsWithoutClassStyle = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
})

const options = createResource({
  url: 'frappe.desk.search.search_link',
  params: {
    doctype: props.doctype,
    txt: '',
    filters: props.filters,
  },
  method: 'POST',
  resourceFetcher: frappeRequest,
  transform: (data: SelectOption[]) => {
    return data.map((doc) => ({
      label: doc.label || doc.value,
      value: doc.value,
    }))
  },
})

const createNewOption = {
  type: 'custom' as const,
  key: 'create_new',
  label: 'Create New',
  slotName: 'create-new',
  condition: () => true,
  onClick: ({ searchTerm }) => emit('create', searchTerm),
} as ComboboxOption

const linkOptions = computed(() => {
  const _options = options.data || []
  if (props.allowCreate) {
    return [..._options, createNewOption]
  }
  return _options
})

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

const handleInputChange = debounce((inputString: string) => {
  loadOptions(inputString || '')
}, 300)

watch([() => props.doctype, () => props.filters], () => loadOptions(''), {
  immediate: true,
  deep: true,
})
</script>
