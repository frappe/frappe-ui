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
      class="flex max-h-[60vh] flex-col"
      v-bind="$attrs"
      highlight-on-hover
      selection-behavior="replace"
      @highlight="onHighlight"
    >
      <!-- The dialog's accessible name. `bare` draws no header. -->
      <VisuallyHidden as-child>
        <DialogTitle>{{ title }}</DialogTitle>
      </VisuallyHidden>
      <!--
        The parts sit in a column. `CommandPaletteList` is the listbox and the
        only thing that scrolls; the field, the empty state and the footer are
        its siblings. A listbox may own options and groups and nothing else, so
        they cannot live inside it, and being outside it they never need to be
        pinned over the rows.
      -->
      <slot v-bind="slotProps" />
    </ListboxRoot>
  </Dialog>
</template>

<script setup lang="ts">
import { DialogTitle, ListboxRoot, VisuallyHidden } from 'reka-ui'
import {
  computed,
  nextTick,
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

const listbox = useTemplateRef<{
  highlightFirstItem: () => void
  highlightedElement: HTMLElement | null
}>('listbox')

// `shallowRef`, so an object value comes back out of the slot props as the
// object the caller passed in and not a reactive proxy of it.
const activeValue = shallowRef<CommandPaletteValue | undefined>()
// Reka records the pick in the instant before the palette closes. Bound here
// so `reset` clears it with the query, and the next open starts clean.
const selectedValue = shallowRef<CommandPaletteValue | undefined>()

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

// Reka holds its highlight on the row it last had, even once the filter has
// unmounted that row, so the field keeps an `aria-activedescendant` naming an
// id that has left the document. Now that the empty state is a live region,
// that is two answers at once for a screen reader.
//
// `changeHighlight` refuses a null and nothing else reka exposes lets go of
// the highlight, so this writes the exposed `highlightedElement` ref, which is
// what reka's own pointer-leave handler does. Post-flush, so the rows have
// gone by the time it runs. The watch above puts the highlight back on the
// first row as soon as the query matches something again.
watch(
  empty,
  (isEmpty) => {
    if (!isEmpty || !listbox.value) return
    listbox.value.highlightedElement = null
    // Reka only emits `highlight` from `changeHighlight`, so the palette's own
    // active value has to be let go of here too.
    activeValue.value = undefined
  },
  { flush: 'post' },
)

const slotProps = computed<CommandPaletteSlotProps>(() => ({
  query: query.value,
  active: activeValue.value,
  empty: empty.value,
}))

provideCommandPaletteContext({
  query,
  title: computed(() => props.title),
  filterable: computed(() => props.filterable),
  activeValue,
  empty,
  matches,
  registerItem,
  groupHasVisibleItems,
  select,
})
</script>
