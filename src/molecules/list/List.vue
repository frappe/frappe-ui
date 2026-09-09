<template>
  <div
    ref="root"
    data-slot="list"
    :role="hasHeader ? 'table' : 'list'"
    :style="style"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  ref,
  useTemplateRef,
  watchEffect,
} from 'vue'
import { provideListContext } from './list-context'
import type { ListProps } from './types'

const props = defineProps<ListProps>()

defineSlots<{
  /** The list's rows — `<ListRow>` / `<ListRows>`, optionally under `<ListHeader>` / `<ListGroup>`. */
  default?: () => unknown
}>()

/**
 * The checkbox-selected row values, when `selectable` reveals the checkbox
 * column. Two-way — toggling a row's checkbox updates this set.
 */
const selection = defineModel<string[]>('selection', { default: () => [] })
// Single active row. Unlike `selection` there's no explicit mode flag: binding
// v-model:active is the opt-in, detected via the update listener below so a
// highlight never appears on a list that doesn't track one.
/**
 * The single open/highlighted row, for a master–detail layout. Binding this
 * model is what opts a list into active-row tracking — an unbound list shows
 * no highlight. Independent of `selection`.
 */
const active = defineModel<string | undefined>('active')

const instance = getCurrentInstance()
const activatable = computed(
  () => 'onUpdate:active' in (instance?.vnode.props ?? {}),
)

const hasHeader = ref(false)

// `columns` rides internal custom properties, one per supplied breakpoint
// (`--_list-columns-base`, `--_list-columns-md`, …). The Tailwind preset emits
// the media rules that pick one of them into the `--_list-columns` the header
// and rows read, so the switch happens in CSS — correct in SSR markup, with no
// viewport state and no resize listener. The array form is the single-tier
// case. Those rules also reset every carrier at each list root, which is what
// keeps a nested list's template its own. See tailwind/listColumns.js.
const style = computed(() => {
  const vars: Record<string, string> = {}
  const columns = props.columns
  if (Array.isArray(columns)) {
    vars['--_list-columns-base'] = columns.join(' ')
  } else if (columns) {
    for (const [breakpoint, tracks] of Object.entries(columns)) {
      if (tracks?.length) {
        vars[`--_list-columns-${breakpoint}`] = tracks.join(' ')
      }
    }
  }
  if (props.selectable) vars['--_list-checkbox-width'] = '32px'
  if (props.rowHeight) vars['--_list-row-height'] = `${props.rowHeight}px`
  return vars
})

const rootRef = useTemplateRef<HTMLElement>('root')

if (import.meta.env.DEV) {
  watchEffect(() => {
    const columns = props.columns
    if (!columns || Array.isArray(columns)) return
    if (!columns.base?.length) {
      console.warn(
        '[frappe-ui] List: `columns` needs a `base` template — it is what ' +
          'applies below the smallest breakpoint. Without it the list falls ' +
          'back to the default feed template at narrow widths.',
      )
    }
  })

  // A key that names no screen writes a carrier no media rule reads, so its
  // template never applies and the list silently keeps the tier below it — the
  // failure `:columns="{ base: […], medium: […] }"` produces. Nothing in the
  // types can catch it: breakpoint names belong to the app, so the index
  // signature on `ListColumnsByBreakpoint` has to stay open.
  //
  // The component can't read the app's Tailwind config, but the preset can, and
  // it publishes the names it emitted tiers for on `--_list-screens` (see
  // tailwind/listColumns.js). Reading that back off the resolved style is how
  // the check learns the app's own breakpoints. `flush: 'post'` so the root
  // element exists; the whole block is stripped from a production build.
  watchEffect(
    () => {
      const columns = props.columns
      if (!columns || Array.isArray(columns)) return
      const el = rootRef.value
      if (!el) return
      const declared = getComputedStyle(el)
        .getPropertyValue('--_list-screens')
        .trim()
      // Empty means no list stylesheet resolved at all — a test environment
      // with no CSS, for instance. There is nothing to check the keys against,
      // so say nothing rather than guess. `frappe-ui/list`'s own style.css
      // declares at least `base`, so a real app never lands here.
      if (!declared) return
      const known = new Set(declared.split(/\s+/))
      for (const key of Object.keys(columns)) {
        if (known.has(key) || columns[key] === undefined) continue
        console.warn(
          `[frappe-ui] List: \`columns\` key \`${key}\` is not one of this ` +
            `app's Tailwind screens (${[...known].join(', ')}), so its ` +
            'template is ignored and the list keeps the one below it. If ' +
            `\`${key}\` is a screen in your Tailwind config, this app is not ` +
            "using frappe-ui's Tailwind preset.",
        )
      }
    },
    { flush: 'post' },
  )
}

function isSelected(value: string) {
  return selection.value.includes(value)
}

function toggleSelection(value: string) {
  selection.value = isSelected(value)
    ? selection.value.filter((selected) => selected !== value)
    : [...selection.value, value]
}

function isActive(value: string) {
  return active.value === value
}

function activate(value: string) {
  active.value = value
}

// The full set of selectable row values, fed by <ListRows>. Drives the header
// select-all without depending on which rows are currently mounted.
const allValues = ref<string[]>([])
function setAllValues(values: string[]) {
  allValues.value = values
}

const selectAllState = computed<'none' | 'some' | 'all'>(() => {
  const universe = allValues.value
  if (!universe.length) return 'none'
  const selectedCount = universe.filter((value) =>
    selection.value.includes(value),
  ).length
  if (selectedCount === 0) return 'none'
  return selectedCount === universe.length ? 'all' : 'some'
})

function toggleSelectAll() {
  if (selectAllState.value === 'all') {
    // Clear only the current universe; preserve any selected values outside it
    // (e.g. carried over from a previous filter or page).
    const universe = new Set(allValues.value)
    selection.value = selection.value.filter((value) => !universe.has(value))
  } else {
    selection.value = [...new Set([...selection.value, ...allValues.value])]
  }
}

provideListContext({
  divider: computed(() => props.divider ?? (props.columns ? 'full' : 'inset')),
  selectable: computed(() => !!props.selectable),
  rowHeight: computed(() => props.rowHeight),
  hasHeader,
  isSelected,
  toggleSelection,
  activatable,
  isActive,
  activate,
  setAllValues,
  selectAllState,
  toggleSelectAll,
})
</script>
