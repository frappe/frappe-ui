<template>
  <div v-if="visible" class="px-2.5">
    <ListboxItem
      :value="value"
      :disabled="disabled"
      as-child
      @select="onSelect"
    >
      <component
        :is="as"
        data-slot="command-palette-item"
        :data-state="state"
        :data-disabled="disabled ? '' : undefined"
        class="flex w-full min-w-0 cursor-default items-center rounded-4 px-2 py-2 text-base-medium text-ink-gray-8 outline-none data-[state=active]:bg-surface-gray-2 data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-gray-4"
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
  </div>
</template>

<script setup lang="ts">
import { ListboxItem } from 'reka-ui'
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

onMounted(readRenderedText)
onUpdated(readRenderedText)

const filterText = computed(() => props.label ?? renderedText.value)

const visible = computed(() => {
  if (!palette) return true
  if (!palette.filterable.value) return true
  return palette.matches(filterText.value, props.keywords ?? [])
})

const unregister = palette?.registerItem(id, {
  groupId: group?.id ?? null,
  visible,
})

onUnmounted(() => unregister?.())

const active = computed(
  () => palette != null && palette.activeValue.value === props.value,
)

const selected = computed(
  () => palette != null && palette.selectedValue.value === props.value,
)

// One attribute, so `active` wins: it is the row the palette highlights.
const state = computed(() => {
  if (active.value) return 'active'
  if (selected.value) return 'selected'
  return undefined
})

const slotProps = computed<CommandPaletteItemSlotProps>(() => ({
  active: active.value,
  selected: selected.value,
  disabled: props.disabled ?? false,
}))

function onSelect(event: CommandPaletteSelectEvent) {
  emit('select', event)
  if (event.defaultPrevented) return
  palette?.select(props.value, event)
}
</script>
