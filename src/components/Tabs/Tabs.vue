<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  provide,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { TabsRoot } from 'reka-ui'
import TabList from './TabList.vue'
import TabTrigger from './TabTrigger.vue'
import TabPanel from './TabPanel.vue'
import { tabsRootKey, type TabTriggerRegistration } from './context'
import type {
  TabItem,
  TabsEmits,
  TabsProps,
  TabTriggerSlotProps,
  TabValue,
} from './types'

const props = withDefaults(defineProps<TabsProps>(), {
  vertical: false,
  variant: 'underline',
  size: 'sm',
})

const emit = defineEmits<TabsEmits>()

const slots = defineSlots<{
  /** Composed mode: `TabList` / `TabPanel` children. */
  default?: () => any
  /** Shorthand mode: leading content in every generated trigger. */
  'tab-prefix'?: (props: { tab: TabItem } & TabTriggerSlotProps) => any
  /** Shorthand mode: replaces the label region of every generated trigger. */
  'tab-label'?: (props: { tab: TabItem } & TabTriggerSlotProps) => any
  /** Shorthand mode: trailing content in every generated trigger. */
  'tab-suffix'?: (props: { tab: TabItem } & TabTriggerSlotProps) => any
  /** Shorthand mode: panel body for the selected tab. */
  'tab-panel'?: (props: { tab: TabItem }) => any
}>()

if (import.meta.env.DEV) {
  let warned = false
  watch(
    () => Boolean(props.tabs && slots.default),
    (conflict) => {
      if (conflict && !warned) {
        warned = true
        console.warn(
          '[frappe-ui] Tabs: default-slot children are not supported when `tabs` is set. Use the shorthand slots (#tab-prefix/#tab-label/#tab-suffix/#tab-panel) or drop the `tabs` prop.',
        )
      }
    },
    { immediate: true },
  )
}

// A route trigger navigates when it is selected, so arrow keys must move
// focus without selecting — otherwise the keyboard changes the highlight
// while only a click changes the URL. The ARIA APG asks for manual
// activation whenever activation has a significant side effect.
//
// This has to be decided before the first render: reka reads
// `activationMode` once in its own setup and keeps the value. The trigger
// registry is too late — triggers register after the root renders — and
// re-keying the root to force a re-read would tear down every panel with it.
//
// So look at what the caller passed instead. Shorthand mode reads `tabs`.
// Composed mode reads the default slot's vnodes, which exist before they
// mount.
//
// The walk is deliberately narrow. It enters fragments (`v-for`, `v-if`) and
// `TabList`, and reads `route` off `TabTrigger` — nothing else. It must never
// call an unknown component's slot: a scoped slot destructures its argument,
// so calling it with none throws, and this runs inside setup where a throw
// takes the whole component down. Staying out of panels also keeps a nested
// route `Tabs` from flipping the outer, route-free list to manual.
function anyRouteTrigger(nodes: unknown): boolean {
  if (!Array.isArray(nodes)) return false
  return nodes.some((node: any) => {
    if (!node || typeof node !== 'object') return false
    if (node.type === TabTrigger) return Boolean(node.props?.route)
    // Fragments carry a symbol type. Plain elements are safe too: Vue
    // normalises an element vnode's children into an array when it creates
    // it, so there is no slot function left to call — and a `TabList` inside
    // a toolbar row is an ordinary way to write this. `TabList` is ours, and
    // its default slot takes no arguments, so calling that one is safe.
    const isFragment = typeof node.type === 'symbol'
    const isElement = typeof node.type === 'string'
    if (!isFragment && !isElement && node.type !== TabList) return false
    const children = node.children
    if (Array.isArray(children)) return anyRouteTrigger(children)
    if (node.type === TabList && typeof children?.default === 'function') {
      return anyRouteTrigger(children.default())
    }
    return false
  })
}

// The raw children off the vnode, not `slots.default`. Vue wraps a slot
// passed from a render function or JSX, and that wrapper dev-warns when it is
// called outside a render — which is exactly where this runs. Compiled
// templates and render functions both leave the original function here.
function rawDefaultSlot(): (() => unknown) | undefined {
  const children = getCurrentInstance()?.vnode.children as any
  if (typeof children === 'function') return children
  if (typeof children?.default === 'function') return children.default
  return undefined
}

const activationMode: 'automatic' | 'manual' = (
  props.tabs
    ? props.tabs.some((tab) => tab.route)
    : anyRouteTrigger(rawDefaultSlot()?.())
)
  ? 'manual'
  : 'automatic'

// Trigger registry. Triggers register during setup so the registry is
// SSR-consistent; document-order sorting kicks in once elements mount.
const triggers = shallowRef<TabTriggerRegistration[]>([])

// Route mode, mixed lists: the non-route trigger the user clicked. Such a
// trigger has nothing to navigate to, so the route can never represent it —
// without this it would either sit unselectable behind a matching route
// trigger or emit a value the root does not show. The click wins until the
// route moves again, the trigger turns disabled, or it unregisters.
//
// This holds the registration, not its value: `value` is a live prop, so a
// value-keyed override would survive a trigger renaming itself and could then
// be claimed by an unrelated trigger that later took the old value.
const routeOverride = shallowRef<TabTriggerRegistration | null>(null)

function register(trigger: TabTriggerRegistration) {
  if (import.meta.env.DEV && trigger.hasRoute() && activationMode === 'automatic') {
    console.warn(
      '[frappe-ui] Tabs: a trigger has a `route`, but the root could not see it before its first render, so arrow-key activation stayed on. Arrow keys will select without navigating while a click does both. Either the trigger sits inside your own wrapper component (put `TabTrigger` directly in `TabList`), or the routed items arrived after mount — from a resource, or through `tabs`. For late items, render `Tabs` once they are known, with `v-if` or a `:key`.',
    )
  }
  triggers.value = [...triggers.value, trigger]
  return () => {
    triggers.value = triggers.value.filter((t) => t !== trigger)
    // The override leaves with its trigger. A `condition` that flips back
    // remounts an identical trigger, which must not reclaim selection.
    if (routeOverride.value === trigger) routeOverride.value = null
  }
}

const orderedTriggers = computed(() =>
  [...triggers.value].sort((a, b) => {
    const ae = a.el.value
    const be = b.el.value
    if (!ae || !be) return 0
    return ae.compareDocumentPosition(be) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1
  }),
)

// Undefined when every trigger is disabled: nothing is selected, rather than
// falling back to a tab the user cannot reach. Same rule as route mode with no
// match — a disabled trigger counts as absent everywhere.
function firstSelectable(): TabValue | undefined {
  return orderedTriggers.value.find((t) => !t.disabled())?.value()
}

// Whether a model is *bound*, not whether it currently holds a value.
// `const tab = ref()` with `v-model` is ordinary, and reading the value would
// call that unbound: route mode would turn on, and route mode never emits for
// a route trigger, so the ref would stay undefined and the binding would be
// dead for the life of the component. The binding itself is on the vnode.
// The prop key, not the update listener: an app may listen to
// `update:modelValue` to observe selection without binding a model at all,
// and that must stay uncontrolled. `v-model` always passes the key.
const modelBindingPresent = (() => {
  const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
  return 'modelValue' in vnodeProps || 'model-value' in vnodeProps
})()

const modelBound = computed(
  () => modelBindingPresent || props.modelValue !== undefined,
)

// Route mode: with no model binding and at least one selectable route
// trigger, selection derives from the current route. Disabled route
// triggers do not count — they are excluded from route selection below, so
// counting them would leave nothing selected and discard every update.
const routeMode = computed(
  () =>
    !modelBound.value &&
    triggers.value.some((t) => t.hasRoute() && !t.disabled()),
)

// Disabled triggers are skipped here as well as in keyboard navigation: a
// disabled trigger renders as a button rather than a link, but `useLink`
// still tracks its route, so reaching that URL any other way would
// otherwise select a tab the user cannot select themselves.
const routeSelected = computed<TabValue | undefined>(() => {
  const list = orderedTriggers.value.filter((t) => !t.disabled())
  const exact = list.find((t) => t.routeExactActive?.value)
  if (exact) return exact.value()
  return list.find((t) => t.routeActive?.value)?.value()
})

const internalValue = ref<TabValue | undefined>(props.modelValue)

function triggerFor(value: TabValue) {
  return triggers.value.find((t) => t.value() === value)
}

watch(routeSelected, () => {
  routeOverride.value = null
})

// Turning the clicked trigger disabled ends the override for good, rather
// than parking it: re-enabling the tab must not hand selection back without
// another click.
watch(
  () => routeOverride.value?.disabled() ?? false,
  (isDisabled) => {
    if (isDisabled) routeOverride.value = null
  },
)

const selected = computed<TabValue | undefined>(() => {
  if (routeMode.value) {
    // The `disabled` guard also covers the tick before the watch above
    // flushes. Unregistering clears the override in `register`'s cleanup.
    const override = routeOverride.value
    if (override && !override.disabled()) return override.value()
    const fromRoute = routeSelected.value
    if (fromRoute !== undefined) return fromRoute
    // No route matches. Fall back to the first selectable trigger with no
    // `route` — it claims no URL, so selecting it is safe. A route trigger
    // stays unselected: highlighting one would claim a route the app is not
    // on. An all-route list therefore starts with nothing selected.
    return orderedTriggers.value
      .find((t) => !t.disabled() && !t.hasRoute())
      ?.value()
  }
  const desired = modelBound.value ? props.modelValue : internalValue.value
  const list = triggers.value
  if (!list.length) return desired
  // A disabled trigger counts as absent, so a model pointing at one falls back
  // like a stale model rather than selecting a tab the user cannot reach.
  if (desired !== undefined && selectable(list, desired)) return desired
  return firstSelectable()
})

// Values of the triggers a user can actually select. The fallback watcher
// tracks this rather than `orderedTriggers` so that disabling the selected
// trigger re-runs it — a trigger's `disabled` changes without the registry
// array changing identity.
const selectableValues = computed(() =>
  orderedTriggers.value.filter((t) => !t.disabled()).map((t) => t.value()),
)

function selectable(list: TabTriggerRegistration[], value: TabValue) {
  return list.some((t) => t.value() === value && !t.disabled())
}

// Stale-model fallback: when the model matches no selectable trigger, select
// the first selectable one and emit. The initial uncontrolled pick stays
// internal and does not emit.
watch(
  [selectableValues, () => props.modelValue],
  () => {
    if (routeMode.value) return
    const list = orderedTriggers.value
    if (!list.length) return
    const desired = modelBound.value ? props.modelValue : internalValue.value
    if (desired !== undefined && selectable(list, desired)) {
      internalValue.value = desired
      return
    }
    const fallback = firstSelectable()
    if (fallback === undefined) return
    internalValue.value = fallback
    // Emit whenever a model is bound: an unbound root's initial pick stays
    // internal, but a bound one asked to be told — including the `ref()` that
    // started undefined.
    if (modelBound.value) emit('update:modelValue', fallback)
  },
  { immediate: true, flush: 'post' },
)

const orientation = computed<'horizontal' | 'vertical'>(() =>
  props.vertical ? 'vertical' : 'horizontal',
)

provide(tabsRootKey, {
  selected,
  routeMode,
  orientation,
  register,
})

// Handed to `TabsRoot` when nothing is selected. An undefined model reads as
// "uncontrolled" to reka, which then drives its own selection: arrow keys
// would flip `aria-selected` on a trigger whose `Pill` stays inactive,
// because every part of this component reads `selected` instead. A value no
// trigger carries keeps the root controlled and selects nothing.
const NO_SELECTION = '__frappe-ui-tabs-none__'


function onRekaUpdate(value: TabValue) {
  if (routeMode.value) {
    // Clicking a route trigger navigates; the route drives selection from
    // here and no model update is emitted. Hand selection back to it.
    const trigger = triggerFor(value)
    if (trigger?.hasRoute()) {
      routeOverride.value = null
      return
    }
    // A non-route trigger has no route to follow, so the click selects it
    // directly even while a route matches elsewhere in the list.
    routeOverride.value = trigger ?? null
  }
  internalValue.value = value
  emit('update:modelValue', value)
}

const dir = computed<'ltr' | 'rtl'>(
  () =>
    props.dir ??
    (typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
      ? 'rtl'
      : 'ltr'),
)

const visibleTabs = computed(() =>
  (props.tabs ?? []).filter((tab) => !tab.condition || tab.condition()),
)
</script>

<template>
  <TabsRoot
    :model-value="selected ?? NO_SELECTION"
    :activation-mode="activationMode"
    :orientation="orientation"
    :dir="dir"
    :class="
      props.tabs ? 'flex flex-col data-[orientation=vertical]:flex-row' : undefined
    "
    @update:model-value="onRekaUpdate($event as TabValue)"
  >
    <template v-if="props.tabs">
      <TabList
        :variant="props.variant"
        :size="props.size"
        :side="props.side"
      >
        <TabTrigger
          v-for="tab in visibleTabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
          :icon="tab.icon"
          :icon-left="tab.iconLeft"
          :disabled="tab.disabled"
          :route="tab.route"
        >
          <template v-if="slots['tab-prefix']" #prefix="triggerSlotProps">
            <slot name="tab-prefix" :tab="tab" v-bind="triggerSlotProps" />
          </template>
          <template v-if="slots['tab-label']" #default="triggerSlotProps">
            <slot name="tab-label" :tab="tab" v-bind="triggerSlotProps" />
          </template>
          <template v-if="slots['tab-suffix']" #suffix="triggerSlotProps">
            <slot name="tab-suffix" :tab="tab" v-bind="triggerSlotProps" />
          </template>
        </TabTrigger>
      </TabList>

      <template v-if="slots['tab-panel']">
        <TabPanel
          v-for="tab in visibleTabs"
          :key="tab.value"
          :value="tab.value"
        >
          <slot name="tab-panel" :tab="tab" />
        </TabPanel>
      </template>
    </template>

    <slot v-else />
  </TabsRoot>
</template>
