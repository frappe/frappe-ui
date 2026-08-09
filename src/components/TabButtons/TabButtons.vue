<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { RouterLink } from 'vue-router'
import Pill from '../shared/tabs/Pill.vue'
import { NativeAnchor, NativeButton } from '../shared/nativeElements'
import {
  tabRadiusClasses,
  tabShellClasses,
  tabTrackClasses,
} from '../shared/tabs/styles'
import { warnUnsupportedIconString } from '../../utils/iconString'
import type { BrowserTabBase } from '../shared/tabs/pillTypes'
import type { TabButton, TabButtonsEmits, TabButtonsProps } from './types'

defineOptions({
  name: 'TabButtons',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TabButtonsProps>(), {
  variant: 'subtle',
  size: 'sm',
  vertical: false,
  direction: 'left',
  fluid: false,
})

const emit = defineEmits<TabButtonsEmits>()

const options = computed(() => props.options ?? [])

watchEffect(() => {
  for (const option of options.value) {
    warnUnsupportedIconString('TabButtons', 'options.icon', option.icon)
    warnUnsupportedIconString('TabButtons', 'options.iconLeft', option.iconLeft)
    warnUnsupportedIconString(
      'TabButtons',
      'options.iconRight',
      option.iconRight,
    )
  }
})

const resolvedButtons = computed(() => {
  return options.value.map((button) => {
    const { value, label, icon, tooltip } = button

    const isIconOnly = Boolean(icon)
    const visibleLabel = hasLabel(label) && !isIconOnly
    const accessibleLabel = hasLabel(label) ? String(label) : tooltip

    return {
      ...button,
      value,
      customClass: button.class,
      visibleLabel,
      accessibleLabel,
    }
  })
})

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value === undefined) return
    emit('update:modelValue', value)
  },
})

const rootClasses = computed(() => [
  props.fluid ? 'flex w-full' : 'inline-flex shrink-0',
  props.vertical ? 'flex-col' : 'items-center',
  ...tabTrackClasses({
    variant: props.variant,
    size: props.size,
    orientation: props.vertical ? 'vertical' : 'horizontal',
    direction: props.direction,
  }),
])

function browserTabBase(checked: boolean): BrowserTabBase {
  if (props.variant !== 'browser-tab') return 'none'
  if (!props.vertical) return 'default'
  return checked ? props.direction : 'default'
}

function hasLabel(label: TabButton['label']) {
  return label !== undefined && label !== null && label !== ''
}

// Pick the wrapper element for a tab. `route` → RouterLink, `href` →
// anchor, otherwise a native button. Disabled forces the button form so
// `:disabled` actually blocks interaction.
function tabElement(button: (typeof resolvedButtons.value)[number]) {
  if (button.disabled) return NativeButton
  if (button.route) return RouterLink
  if (button.href) return NativeAnchor
  return NativeButton
}

function tabElementProps(button: (typeof resolvedButtons.value)[number]) {
  if (!button.disabled && button.route) {
    return { to: button.route }
  }
  if (!button.disabled && button.href) {
    return {
      href: button.href,
      target: '_blank',
      rel: 'noreferrer noopener',
    }
  }
  return { type: 'button' as const, disabled: button.disabled }
}
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :orientation="vertical ? 'vertical' : 'horizontal'"
    v-bind="$attrs"
  >
    <div :class="rootClasses">
      <RadioGroupItem
        v-for="button in resolvedButtons"
        :key="button.value"
        v-slot="{ checked, disabled }"
        as="template"
        :disabled="button.disabled"
        :value="button.value"
      >
        <component
          :is="tabElement(button)"
          v-bind="tabElementProps(button)"
          data-slot="tab-button"
          :data-state="checked ? 'checked' : 'unchecked'"
          :data-disabled="disabled ? '' : undefined"
          :aria-label="
            button.accessibleLabel && !button.visibleLabel
              ? button.accessibleLabel
              : undefined
          "
          :title="
            button.accessibleLabel && !button.visibleLabel
              ? button.accessibleLabel
              : button.tooltip
          "
          :class="[
            tabShellClasses,
            tabRadiusClasses(variant, size, browserTabBase(checked)),
            vertical && 'w-full',
            fluid && 'flex-1 min-w-0',
            button.customClass,
          ]"
          @click="button.onClick?.($event)"
        >
          <Pill
            :class="[
              vertical ? 'w-full !justify-start' : '',
              fluid ? 'w-full' : '',
            ]"
            :label="button.label"
            :icon="button.icon"
            :icon-left="button.iconLeft"
            :icon-right="button.iconRight"
            :active="checked"
            :size="size"
            :variant="variant"
            :browser-tab-base="browserTabBase(checked)"
            :orientation="vertical ? 'vertical' : 'horizontal'"
          >
            <template v-if="$slots.prefix" #prefix>
              <slot
                name="prefix"
                :button="button"
                :checked="checked"
                :disabled="disabled"
              />
            </template>
            <template v-if="$slots.suffix" #suffix>
              <slot
                name="suffix"
                :button="button"
                :checked="checked"
                :disabled="disabled"
              />
            </template>
          </Pill>
        </component>
      </RadioGroupItem>
    </div>
  </RadioGroupRoot>
</template>
