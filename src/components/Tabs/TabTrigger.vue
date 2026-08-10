<script setup lang="ts">
import {
  computed,
  inject,
  onUnmounted,
  ref,
  watchEffect,
  type ComponentPublicInstance,
} from 'vue'
import { TabsTrigger } from 'reka-ui'
import { RouterLink, useLink } from 'vue-router'
import Pill from '../shared/tabs/Pill.vue'
import { NativeButton } from '../shared/nativeElements'
import { tabRadiusClasses, tabShellClasses } from '../shared/tabs/styles'
import { warnUnsupportedIconString } from '../../utils/iconString'
import { tabListKey, tabsRootKey } from './context'
import type { BrowserTabBase } from '../shared/tabs/pillTypes'
import type { TabTriggerProps, TabTriggerSlotProps } from './types'

const props = defineProps<TabTriggerProps>()

const slots = defineSlots<{
  /** Leading content, after `iconLeft`. */
  prefix?: (props: TabTriggerSlotProps) => any
  /** Replaces the label region. */
  default?: (props: TabTriggerSlotProps) => any
  /** Trailing content (badges, counts). */
  suffix?: (props: TabTriggerSlotProps) => any
}>()

const root = inject(tabsRootKey, null)
const list = inject(tabListKey, null)

const variant = computed(() => list?.variant.value ?? 'underline')
const size = computed(() => list?.size.value ?? 'sm')
const side = computed(() => list?.side.value ?? 'left')
const orientation = computed(() => root?.orientation.value ?? 'horizontal')

watchEffect(() => {
  warnUnsupportedIconString('TabTrigger', 'icon', props.icon)
  warnUnsupportedIconString('TabTrigger', 'iconLeft', props.iconLeft)
})

// Route mode. `route` is assumed present-or-absent for the trigger's
// lifetime — useLink can only be called during setup.
const link = props.route
  ? useLink({ to: computed(() => props.route!) })
  : null

if (import.meta.env.DEV) {
  let warned = false
  watchEffect(() => {
    if (props.route && !link && !warned) {
      warned = true
      console.warn(
        '[frappe-ui] TabTrigger: `route` was added after the trigger mounted. `useLink` can only run during setup, so this trigger cannot drive or follow route selection. Give it a `route` from the start, or re-mount it with a `:key`.',
      )
    }
  })
}

const pillRef = ref<ComponentPublicInstance | null>(null)
const el = computed<HTMLElement | null>(
  () => (pillRef.value?.$el as HTMLElement | undefined) ?? null,
)

const unregister = root?.register({
  value: () => props.value,
  disabled: () => !!props.disabled,
  el,
  // Report the captured link, not the current prop: a `route` added after
  // setup has no `useLink`, so counting it would turn route mode on for a
  // trigger that can never match.
  hasRoute: () => link !== null,
  routeActive: link?.isActive,
  routeExactActive: link?.isExactActive,
})
onUnmounted(() => unregister?.())

const selected = computed(() => root?.selected.value === props.value)

const slotProps = computed<TabTriggerSlotProps>(() => ({
  selected: selected.value,
  disabled: !!props.disabled,
}))

const isIconOnly = computed(() => Boolean(props.icon) && !slots.default)

const browserTabBase = computed<BrowserTabBase>(() => {
  if (variant.value !== 'browser-tab') return 'none'
  if (orientation.value !== 'vertical') return 'default'
  return selected.value ? side.value : 'default'
})

const elementIs = computed(() =>
  props.route && !props.disabled ? RouterLink : NativeButton,
)

const elementProps = computed(() => {
  if (props.route && !props.disabled) return { to: props.route }
  return { type: 'button' as const }
})

const shellClasses = computed(() => [
  tabShellClasses,
  tabRadiusClasses(variant.value, size.value, browserTabBase.value),
  orientation.value === 'vertical' && 'w-full',
])
</script>

<template>
  <TabsTrigger as="template" :value="props.value" :disabled="props.disabled">
    <component
      :is="elementIs"
      v-bind="elementProps"
      data-slot="tab-trigger"
      :class="shellClasses"
      :aria-label="isIconOnly && props.label ? props.label : undefined"
      :title="isIconOnly && props.label ? props.label : undefined"
    >
      <Pill
        ref="pillRef"
        :class="orientation === 'vertical' ? 'w-full !justify-start' : ''"
        :label="props.label"
        :icon="props.icon"
        :icon-left="props.iconLeft"
        :active="selected"
        :variant="variant"
        :size="size"
        :browser-tab-base="browserTabBase"
        :orientation="orientation"
      >
        <template v-if="slots.prefix" #prefix>
          <slot name="prefix" v-bind="slotProps" />
        </template>
        <template v-if="slots.default" #default>
          <slot v-bind="slotProps" />
        </template>
        <template v-if="slots.suffix" #suffix>
          <slot name="suffix" v-bind="slotProps" />
        </template>
      </Pill>
    </component>
  </TabsTrigger>
</template>
