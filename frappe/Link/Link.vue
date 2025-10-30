<template>
  <div class="flex flex-col gap-1.5" :class="attrs.class" :style="attrs.style">
    <FormLabel v-if="label" :label="label" size="sm" :required="required" />
    <Combobox
      v-model="model"
      :placeholder="placeholder || `Select ${doctype}`"
      :options="options.data"
      @input="handleInputChange"
      @focus="() => loadOptions('')"
      :open-on-focus="true"
      v-bind="attrsWithoutClassStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, useAttrs, computed } from 'vue'
import { Combobox } from '../../src/components/Combobox'
import FormLabel from '../../src/components/FormLabel.vue'
import debounce from '../../src/utils/debounce'
// @ts-ignore - Vue SFC without explicit types
import { createResource } from '../../src/resources'
import type { LinkProps, SelectOption } from './types'

const props = withDefaults(defineProps<LinkProps>(), {
  label: '',
  filters: () => ({}),
})
const model = defineModel<string>({ default: '' })
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
  transform: (data: SelectOption[]) => {
    return data.map((doc) => ({
      label: doc.label || doc.value,
      value: doc.value,
    }))
  },
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
