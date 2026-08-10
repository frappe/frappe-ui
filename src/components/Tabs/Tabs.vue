<script setup lang="ts">
import { computed, provide, ref, shallowRef, watch } from 'vue'
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

const modelBound = computed(() => props.modelValue !== undefined)

// Route mode: with no model binding and at least one selectable route
// trigger, selection derives from the current route. Disabled route
// triggers do not count — they are excluded from route selection below, so
// counting them would leave nothing selected and discard every update.
const routeMode = computed(
  () =>
    !modelBound.value &&
    triggers.value.some((t) => t.hasRoute() && !t.disabled()),
)

// Broader than `routeMode`: a bound model keeps selection off the router,
// but clicking a route trigger still navigates. Activation stays manual
// there too, so the keyboard and the mouse cannot land on different URLs.
const hasAnyRoute = computed(() =>
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
    if (desired !== undefined) emit('update:modelValue', fallback)
  },
  { immediate: true, flush: 'post' },
)

const orientation = computed<'horizontal' | 'vertical'>(() =>
  props.vertical ? 'vertical' : 'horizontal',
)

provide(tabsRootKey, {
  selected,
  routeMode,
  hasAnyRoute,
  orientation,
  register,
})

// Handed to `TabsRoot` when nothing is selected. An undefined model reads as
// "uncontrolled" to reka, which then drives its own selection: arrow keys
// would flip `aria-selected` on a trigger whose `Pill` stays inactive,
// because every part of this component reads `selected` instead. A value no
// trigger carries keeps the root controlled and selects nothing.
const NO_SELECTION = '__frappe-ui-tabs-none__'

// reka reads `activationMode` once in its own setup and keeps the value, so
// it cannot see triggers that register afterwards — which is all of them.
// Keying the root on the mode remounts it the one time routes appear. A
// trigger's route-ness is fixed for its lifetime (`useLink` runs at setup),
// so this settles immediately and never flips back.
const activationMode = computed<'automatic' | 'manual'>(() =>
  hasAnyRoute.value ? 'manual' : 'automatic',
)

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
    :key="activationMode"
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
      <TabList :variant="props.variant" :size="props.size">
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
