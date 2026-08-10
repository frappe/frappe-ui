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
  prefix?: (props: { tab: TabItem } & TabTriggerSlotProps) => any
  /** Shorthand mode: replaces the label region of every generated trigger. */
  tab?: (props: { tab: TabItem } & TabTriggerSlotProps) => any
  /** Shorthand mode: trailing content in every generated trigger. */
  suffix?: (props: { tab: TabItem } & TabTriggerSlotProps) => any
  /** Shorthand mode: panel body for the selected tab. */
  panel?: (props: { tab: TabItem }) => any
}>()

if (import.meta.env.DEV) {
  let warned = false
  watch(
    () => Boolean(props.tabs && slots.default),
    (conflict) => {
      if (conflict && !warned) {
        warned = true
        console.warn(
          '[frappe-ui] Tabs: default-slot children are not supported when `tabs` is set. Use the shorthand slots (#prefix/#tab/#suffix/#panel) or drop the `tabs` prop.',
        )
      }
    },
    { immediate: true },
  )
}

// Trigger registry. Triggers register during setup so the registry is
// SSR-consistent; document-order sorting kicks in once elements mount.
const triggers = shallowRef<TabTriggerRegistration[]>([])

function register(trigger: TabTriggerRegistration) {
  triggers.value = [...triggers.value, trigger]
  return () => {
    triggers.value = triggers.value.filter((t) => t !== trigger)
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

function firstSelectable(): TabValue | undefined {
  const list = orderedTriggers.value
  const trigger = list.find((t) => !t.disabled()) ?? list[0]
  return trigger?.value()
}

const modelBound = computed(() => props.modelValue !== undefined)

// Route mode: with no model binding and at least one route trigger,
// selection derives from the current route.
const routeMode = computed(
  () => !modelBound.value && triggers.value.some((t) => t.hasRoute()),
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

const selected = computed<TabValue | undefined>(() => {
  if (routeMode.value) return routeSelected.value
  const desired = modelBound.value ? props.modelValue : internalValue.value
  const list = triggers.value
  if (!list.length) return desired
  if (desired !== undefined && list.some((t) => t.value() === desired)) {
    return desired
  }
  return firstSelectable()
})

// Stale-model fallback: when the model matches no visible trigger, select
// the first visible one and emit. The initial uncontrolled pick stays
// internal and does not emit.
watch(
  [orderedTriggers, () => props.modelValue],
  () => {
    if (routeMode.value) return
    const list = orderedTriggers.value
    if (!list.length) return
    const desired = modelBound.value ? props.modelValue : internalValue.value
    if (desired !== undefined && list.some((t) => t.value() === desired)) {
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
  orientation,
  register,
})

function onRekaUpdate(value: TabValue) {
  // In route mode, clicking a trigger navigates; the route drives
  // selection and no model update is emitted.
  if (routeMode.value) return
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
    :model-value="selected"
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
          <template v-if="slots.prefix" #prefix="triggerSlotProps">
            <slot name="prefix" :tab="tab" v-bind="triggerSlotProps" />
          </template>
          <template v-if="slots.tab" #default="triggerSlotProps">
            <slot name="tab" :tab="tab" v-bind="triggerSlotProps" />
          </template>
          <template v-if="slots.suffix" #suffix="triggerSlotProps">
            <slot name="suffix" :tab="tab" v-bind="triggerSlotProps" />
          </template>
        </TabTrigger>
      </TabList>

      <template v-if="slots.panel">
        <TabPanel
          v-for="tab in visibleTabs"
          :key="tab.value"
          :value="tab.value"
        >
          <slot name="panel" :tab="tab" />
        </TabPanel>
      </template>
    </template>

    <slot v-else />
  </TabsRoot>
</template>
