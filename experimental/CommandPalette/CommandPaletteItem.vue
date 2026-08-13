<template>
  <!-- No wrapper element: a listbox owns options and groups, nothing else. -->
  <ListboxItem
    v-if="visible"
    ref="item"
    :value="value"
    :disabled="disabled"
    as-child
    @select="onSelect"
  >
    <component
      :is="as"
      data-slot="command-palette-item"
      :data-state="active ? 'active' : undefined"
      :data-disabled="disabled ? '' : undefined"
      class="mx-2.5 flex min-w-0 cursor-default items-center rounded-4 px-2 py-2 text-base-medium text-ink-gray-8 outline-none data-[state=active]:bg-surface-gray-2 data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-gray-4"
      v-bind="$attrs"
    >
      <slot name="prefix" v-bind="slotProps" />
      <span
        ref="labelEl"
        data-slot="command-palette-item-label"
        class="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        <slot v-bind="slotProps" />
      </span>
      <span v-if="$slots.suffix" class="ml-auto whitespace-nowrap pl-2">
        <slot name="suffix" v-bind="slotProps" />
      </span>
    </component>
  </ListboxItem>
</template>

<script setup lang="ts">
import { ListboxItem, injectListboxRootContext } from 'reka-ui'
import {
  computed,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  useTemplateRef,
} from 'vue'
import {
  useCommandPaletteContext,
  useCommandPaletteGroupContext,
} from './context'
import type {
  CommandPaletteItemEmits,
  CommandPaletteItemProps,
  CommandPaletteItemSlotProps,
  CommandPaletteSelectEvent,
} from './types'

defineOptions({ name: 'CommandPaletteItem', inheritAttrs: false })

const props = withDefaults(defineProps<CommandPaletteItemProps>(), {
  as: 'div',
})

const emit = defineEmits<CommandPaletteItemEmits>()

defineSlots<{
  /** The item's label. The client filter matches its text. */
  default: (props: CommandPaletteItemSlotProps) => any
  /** Leading content, before the label. */
  prefix?: (props: CommandPaletteItemSlotProps) => any
  /** Trailing content, pushed to the end of the row. */
  suffix?: (props: CommandPaletteItemSlotProps) => any
}>()

const palette = useCommandPaletteContext()
const group = useCommandPaletteGroupContext()

if (import.meta.env.DEV && !palette) {
  console.warn(
    '[frappe-ui] CommandPaletteItem has to render inside a CommandPalette.',
  )
}

const id = Symbol('command-palette-item')

// The label's own text, so the filter reads the label and not the shortcut
// hint or the badge a caller draws in `#suffix`. `label` overrides it.
const labelEl = useTemplateRef<HTMLElement>('labelEl')
const renderedText = ref('')

function readRenderedText() {
  const text = labelEl.value?.textContent?.trim()
  if (text) renderedText.value = text
}

onMounted(() => {
  readRenderedText()
  // An item with no text of its own and no `label` has nothing to match, so
  // the filter can never narrow it away and it sits under every query.
  if (import.meta.env.DEV && palette?.filterable.value && !filterText.value) {
    console.warn(
      '[frappe-ui] CommandPaletteItem draws no text, so the filter always keeps it. Give it a `label`.',
    )
  }
})
onUpdated(readRenderedText)

const filterText = computed(() => props.label ?? renderedText.value)

const visible = computed(() => {
  if (!palette) return true
  if (!palette.filterable.value) return true
  // Nothing to filter on yet. The label is measured off the mounted element,
  // so an item that opens with a query already typed has to render once
  // before it can know its own text. Hiding it first would keep it hidden.
  if (!filterText.value) return true
  return palette.matches(filterText.value, props.keywords ?? [])
})

const unregister = palette?.registerItem(id, {
  groupId: group?.id ?? null,
  visible,
})

onUnmounted(() => unregister?.())

// Read the highlight off the listbox's own element, not off a copy of the
// value. A caller that rebuilds its item objects on every render would break
// a value comparison; the element does not move.
const listbox = injectListboxRootContext(null)
const item = useTemplateRef<{ $el: HTMLElement }>('item')

// The one row state a palette has. There is no lasting selection to draw: a
// pick closes the palette, and a handler that keeps it open does so by
// preventing the event, which is also how reka is told not to record the pick.
const active = computed(() => {
  const el = item.value?.$el
  return !!el && listbox?.highlightedElement.value === el
})

const slotProps = computed<CommandPaletteItemSlotProps>(() => ({
  active: active.value,
  disabled: props.disabled ?? false,
}))

function onSelect(event: CommandPaletteSelectEvent) {
  emit('select', event)
  if (event.defaultPrevented) return
  palette?.select(props.value, event)
}
</script>
