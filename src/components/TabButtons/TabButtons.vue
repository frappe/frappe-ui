<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { RouterLink } from 'vue-router'
import { Pill, type BrowserTabBase } from '../Pill'
import { warnDeprecated } from '../../utils/warnDeprecated'
import { warnFeatherIconUsage } from '../../utils/iconString'
import type { TabButton, TabButtonsEmits, TabButtonsProps } from './types'

defineOptions({
  name: 'TabButtons',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TabButtonsProps>(), {
  type: 'subtle',
  size: 'sm',
  vertical: false,
  direction: 'left',
})

const emit = defineEmits<TabButtonsEmits>()

watchEffect(() => {
  if (props.buttons) {
    warnDeprecated('TabButtons `buttons` prop', '`options`')
  }
})

const options = computed(() => props.options ?? props.buttons ?? [])

watchEffect(() => {
  for (const option of options.value) {
    warnFeatherIconUsage('TabButtons', 'options.icon', option.icon)
    warnFeatherIconUsage('TabButtons', 'options.iconLeft', option.iconLeft)
    warnFeatherIconUsage('TabButtons', 'options.iconRight', option.iconRight)
  }
})

const resolvedButtons = computed(() => {
  return options.value.map((button, index) => {
    const {
      value,
      label,
      icon,
      iconLeft,
      iconRight,
      active = false,
      class: customClass,
      onClick,
      tooltip,
      disabled,
      route,
      href,
    } = button

    const isIconOnly = Boolean(icon)
    const visibleLabel = hasLabel(label) && !isIconOnly
    const accessibleLabel = hasLabel(label) ? String(label) : tooltip

    return {
      key: `tab-button-${index}`,
      label,
      icon,
      iconLeft,
      iconRight,
      active,
      customClass,
      onClick,
      tooltip,
      disabled,
      visibleLabel,
      accessibleLabel,
      route,
      href,
      modelValue: value ?? label ?? index,
    }
  })
})

watch(
  [resolvedButtons, () => props.modelValue],
  ([buttons]) => {
    const selectedButton = buttons.find((button) =>
      Object.is(button.modelValue, props.modelValue),
    )

    if (selectedButton) return

    const fallbackButton = buttons.find((button) => button.active)
    if (
      fallbackButton &&
      !Object.is(fallbackButton.modelValue, props.modelValue)
    ) {
      emit('update:modelValue', fallbackButton.modelValue)
    }
  },
  { immediate: true },
)

const selectedButtonKey = computed({
  get: () => {
    const selectedButton = resolvedButtons.value.find((button) =>
      Object.is(button.modelValue, props.modelValue),
    )

    if (selectedButton) return selectedButton.key

    return resolvedButtons.value.find((button) => button.active)?.key
  },
  set: (nextKey) => {
    const selectedButton = resolvedButtons.value.find(
      (button) => button.key === nextKey,
    )
    emit('update:modelValue', selectedButton?.modelValue)
  },
})

const rootClasses = computed(() =>
  props.vertical ? verticalClasses() : horizontalClasses(),
)

function horizontalClasses() {
  const base = ['inline-flex shrink-0 items-center']
  const isSm = props.size === 'sm'

  switch (props.type) {
    case 'subtle':
    case 'ghost': {
      const surface =
        props.type === 'subtle' ? 'bg-surface-gray-2' : 'bg-surface-white'
      const shape = isSm ? 'gap-1 rounded' : 'gap-1.5 rounded-[10px]'
      return [...base, 'p-px', surface, shape]
    }
    case 'underline':
      return [...base, 'border-b border-outline-gray-1 gap-6']
    case 'browser-tab':
      return [...base, 'border-b border-outline-gray-1 gap-1']
  }
  return base
}

// Vertical mode is a separate layout. Buttons/pills below get `w-full` so
// every tab stretches to the container's intrinsic max width — the active
// indicator then lands on the container's rail rather than at the pill's
// own text width.
function verticalClasses() {
  const base = ['inline-flex shrink-0 flex-col']
  const isSm = props.size === 'sm'

  switch (props.type) {
    case 'subtle':
    case 'ghost': {
      const surface =
        props.type === 'subtle' ? 'bg-surface-gray-2' : 'bg-surface-white'
      const shape = isSm ? 'gap-1 rounded' : 'gap-1.5 rounded-[10px]'
      return [...base, 'p-px', surface, shape, 'items-center']
    }
    case 'underline':
      return [...base, 'border-r border-outline-gray-1 gap-1.5']
    case 'browser-tab': {
      const rule =
        props.direction === 'right'
          ? 'border-r border-outline-gray-1'
          : 'border-l border-outline-gray-1'
      return [...base, rule, 'gap-1']
    }
  }
  return base
}

const pillVariant = computed(() => {
  if (props.type === 'underline') return 'underline'
  if (props.type === 'browser-tab') return 'browser-tab'
  return 'default'
})

const pillActiveStyle = computed(() =>
  props.type === 'ghost' ? 'subtle' : 'raised',
)

function browserTabBase(checked: boolean): BrowserTabBase {
  if (props.type !== 'browser-tab') return 'none'
  if (!props.vertical) return 'default'
  if (!checked) return 'none'
  return props.direction
}

function hasLabel(label: TabButton['label']) {
  return label !== undefined && label !== null && label !== ''
}

// Pick the wrapper element for a tab. `route` → RouterLink, `href` →
// anchor, otherwise a native button. Disabled forces the button form so
// `:disabled` actually blocks interaction.
function tabElement(button: (typeof resolvedButtons.value)[number]) {
  if (button.disabled) return 'button'
  if (button.route) return RouterLink
  if (button.href) return 'a'
  return 'button'
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
    v-model="selectedButtonKey"
    :orientation="vertical ? 'vertical' : 'horizontal'"
    v-bind="$attrs"
  >
    <div :class="rootClasses">
      <RadioGroupItem
        v-for="button in resolvedButtons"
        :key="button.key"
        v-slot="{ checked, disabled }"
        as="template"
        :disabled="button.disabled"
        :value="button.key"
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
            'inline-flex appearance-none border-0 bg-transparent p-0 text-inherit no-underline disabled:pointer-events-none disabled:opacity-60',
            vertical && 'w-full',
            button.customClass,
          ]"
          @click="button.onClick?.($event)"
        >
          <Pill
            :class="vertical ? 'w-full !justify-start' : ''"
            :label="button.label"
            :icon="button.icon"
            :icon-left="button.iconLeft"
            :icon-right="button.iconRight"
            :active="checked"
            :size="size"
            :variant="pillVariant"
            :browser-tab-base="browserTabBase(checked)"
            :orientation="vertical ? 'vertical' : 'horizontal'"
            :active-style="pillActiveStyle"
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
