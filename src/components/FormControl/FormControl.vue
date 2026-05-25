<template>
  <component
    :is="resolvedComponent"
    :id="id"
    v-bind="forwardedAttrs"
    :class="[fillWidth ? 'w-full' : null, attrs.class]"
    :style="attrs.style"
  >
    <template v-for="name in Object.keys($slots)" :key="name" #[name]="slotProps">
      <!-- @vue-ignore -->
      <slot :name="name" v-bind="slotProps" />
    </template>
  </component>
</template>
<script setup lang="ts">
import { useAttrs, computed, provide, watchEffect } from 'vue'
import { useId } from '../../utils/useId'
import { TextInput } from '../TextInput'
import { Select } from '../Select'
import { Textarea } from '../Textarea'
import { Checkbox } from '../Checkbox'
import { Autocomplete } from '../Autocomplete'
import { autocompleteDeprecationSuppressed } from '../Autocomplete/deprecationKey'
import { Combobox } from '../Combobox'
import { MultiSelect } from '../MultiSelect'
import { DatePicker, DateRangePicker, DateTimePicker } from '../DatePicker'
import { TimePicker } from '../TimePicker'
import { warnDeprecated } from '../../utils/warnDeprecated'
import type { FormControlProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const id = useId()
const props = withDefaults(defineProps<FormControlProps>(), {
  type: 'text',
  size: 'sm',
  variant: 'subtle',
})

provide(autocompleteDeprecationSuppressed, true)

watchEffect(() => {
  if (props.type === 'autocomplete') {
    warnDeprecated('FormControl type="autocomplete"', 'Combobox')
  }
})

const attrs = useAttrs()

// FormControl represents "form context = full width" — the legacy template
// hard-coded `class="w-full"` on Select/Combobox. Preserve that contract for
// all select-like dispatched types (including bare uses with no label, e.g.
// ListFilter's operator picker placed inside a min-width column). Standalone
// Select/Combobox/MultiSelect retain their own hasLabeling heuristic.
const fillWidth = computed(() =>
  new Set([
    'select',
    'combobox',
    'multiselect',
    'autocomplete',
    'date',
    'daterange',
    'datetime',
    'time',
  ]).has(props.type as string),
)

const resolvedComponent = computed(() => {
  switch (props.type) {
    case 'select':
      return Select
    case 'combobox':
      return Combobox
    case 'multiselect':
      return MultiSelect
    case 'autocomplete':
      return Autocomplete
    case 'textarea':
      return Textarea
    case 'checkbox':
      return Checkbox
    case 'date':
      return DatePicker
    case 'daterange':
      return DateRangePicker
    case 'datetime':
      return DateTimePicker
    case 'time':
      return TimePicker
    default:
      return TextInput
  }
})

const forwardedAttrs = computed(() => {
  // attrs minus class/style (applied separately on the rendered child)
  const out: Record<string, unknown> = {}
  for (const key in attrs) {
    if (key !== 'class' && key !== 'style') out[key] = attrs[key]
  }

  out.size = props.size
  out.variant = props.variant

  if (props.label !== undefined) out.label = props.label
  if (props.description !== undefined) out.description = props.description
  if (props.error !== undefined) out.error = props.error
  if (props.required !== undefined) out.required = props.required

  // TextInput needs the html input `type`; the dispatcher consumes the
  // composite types (select/combobox/multiselect/textarea/checkbox/autocomplete)
  // and lets the rest fall through to <TextInput :type="...">.
  const composite = new Set([
    'select',
    'combobox',
    'multiselect',
    'autocomplete',
    'textarea',
    'checkbox',
    'date',
    'daterange',
    'datetime',
    'time',
  ])
  if (!composite.has(props.type as string)) {
    out.type = props.type
  }

  return out
})

defineSlots<{
  /** Custom content rendered before the input (prefix icon/content) */
  prefix?: () => any
  /** Custom content rendered after the input (suffix icon/content) */
  suffix?: () => any
  /** Custom description slot (replaces description prop) */
  description?: () => any
  /** Custom label slot (replaces label prop). Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Custom slot for autocomplete items prefix (if using Autocomplete type) */
  'item-prefix'?: (props: { item: any }) => any
  /** Default slot override for full input rendering */
  default?: () => any
}>()
</script>
