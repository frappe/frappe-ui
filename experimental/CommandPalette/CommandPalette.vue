<template>
  <Dialog
    v-model:open="open"
    size="xl"
    position="top"
    bare
    @after-leave="reset"
  >
    <ListboxRoot
      ref="listbox"
      v-model="selectedValue"
      as="div"
      data-slot="command-palette"
      class="flex flex-col"
      v-bind="$attrs"
      highlight-on-hover
      selection-behavior="replace"
      @highlight="onHighlight"
    >
      <!--
        One scroll region holds the whole slot, so `CommandPaletteInput` and
        `CommandPaletteFooter` pin themselves with `position: sticky` instead
        of needing a `CommandPaletteList` part around the items.
      -->
      <!-- The dialog's accessible name. `bare` draws no header. -->
      <VisuallyHidden as-child>
        <DialogTitle>{{ title }}</DialogTitle>
      </VisuallyHidden>
      <ListboxContent
        as="div"
        data-slot="command-palette-content"
        class="max-h-[60vh] overflow-y-auto overscroll-contain focus-visible:outline-none"
      >
        <slot v-bind="slotProps" />
      </ListboxContent>
    </ListboxRoot>
  </Dialog>
</template>

<script setup lang="ts">
import {
  DialogTitle,
  ListboxContent,
  ListboxRoot,
  VisuallyHidden,
} from 'reka-ui'
import {
  computed,
  nextTick,
  ref,
  shallowRef,
  triggerRef,
  useTemplateRef,
  watch,
} from 'vue'
import Dialog from '../../src/components/Dialog/Dialog.vue'
import {
  provideCommandPaletteContext,
  type CommandPaletteItemRegistration,
} from './context'
import type {
  CommandPaletteEmits,
  CommandPaletteProps,
  CommandPaletteSelectEvent,
  CommandPaletteSlotProps,
  CommandPaletteValue,
} from './types'

defineOptions({ name: 'CommandPalette', inheritAttrs: false })

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  filterable: true,
  title: 'Command palette',
})

const emit = defineEmits<CommandPaletteEmits>()

defineSlots<{
  /** The palette's parts. Receives the query, the active value and the empty state. */
  default: (props: CommandPaletteSlotProps) => any
}>()

/** Whether the palette is open. */
const open = defineModel<boolean>('open', { default: false })
/** The search text. Cleared when the palette closes. */
const query = defineModel<string>('query', { default: '' })

const listbox = useTemplateRef<{ highlightFirstItem: () => void }>('listbox')

const activeValue = ref<CommandPaletteValue | undefined>()
const selectedValue = ref<CommandPaletteValue | undefined>()

// `shallowRef` + `triggerRef`, so the registrations keep their `ComputedRef`
// shape instead of being unwrapped by a deep `ref`.
const items = shallowRef(new Map<symbol, CommandPaletteItemRegistration>())

function registerItem(
  id: symbol,
  registration: CommandPaletteItemRegistration,
) {
  items.value.set(id, registration)
  triggerRef(items)
  return () => {
    items.value.delete(id)
    triggerRef(items)
  }
}

function groupHasVisibleItems(groupId: symbol) {
  for (const item of items.value.values()) {
    if (item.groupId === groupId && item.visible.value) return true
  }
  return false
}

const empty = computed(() => {
  for (const item of items.value.values()) {
    if (item.visible.value) return false
  }
  return true
})

/**
 * Ordinary substring matching, the same rule `Combobox` and `MultiSelect`
 * apply to their options.
 */
function matches(text: string, keywords: string[]) {
  const currentQuery = query.value.trim().toLowerCase()
  if (!currentQuery) return true
  const haystack = [text, ...keywords].join(' ').toLowerCase()
  return haystack.includes(currentQuery)
}

function select(value: CommandPaletteValue, event: CommandPaletteSelectEvent) {
  emit('select', value, event)
  if (event.defaultPrevented) return
  open.value = false
}

function reset() {
  query.value = ''
  activeValue.value = undefined
  selectedValue.value = undefined
}

function onHighlight(
  payload: { ref: HTMLElement; value: CommandPaletteValue } | undefined,
) {
  activeValue.value = payload?.value
}

// Put the keyboard on the first item, so Enter always has a target. Reka does
// this while the user types in the field, but not when the palette opens and
// not when the app writes `query` itself.
watch(
  [open, query],
  async () => {
    if (!open.value) return
    await nextTick()
    listbox.value?.highlightFirstItem()
  },
  { immediate: true },
)

const slotProps = computed<CommandPaletteSlotProps>(() => ({
  query: query.value,
  active: activeValue.value,
  empty: empty.value,
}))

provideCommandPaletteContext({
  query,
  filterable: computed(() => props.filterable),
  activeValue,
  selectedValue,
  empty,
  matches,
  registerItem,
  groupHasVisibleItems,
  select,
})
</script>
