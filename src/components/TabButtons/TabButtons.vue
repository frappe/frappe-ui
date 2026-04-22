<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RadioGroupRoot, RadioGroupItem } from 'reka-ui'
import FeatherIcon from '../FeatherIcon.vue'

defineOptions({
  name: 'TabButtons',
  inheritAttrs: false,
})

type TabButtonValue = string | number | boolean

type TabButtonIcon = string | Component

type NativeButtonClass = string | string[] | Record<string, boolean>

interface TabButton {
  label?: string | number
  value?: TabButtonValue
  icon?: TabButtonIcon
  iconLeft?: TabButtonIcon
  iconRight?: TabButtonIcon
  hideLabel?: boolean
  disabled?: boolean
  active?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: NativeButtonClass
  onClick?: (event: MouseEvent) => void
}

const props = defineProps<{
  buttons: TabButton[]
  modelValue?: TabButtonValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TabButtonValue | undefined]
}>()

const resolvedButtons = computed(() => {
  return props.buttons.map((button, index) => {
    const {
      value,
      label,
      icon,
      iconLeft,
      iconRight,
      hideLabel = false,
      disabled = false,
      active = false,
      type = 'button',
      class: customClass,
      onClick,
    } = button

    return {
      key: `tab-button-${index}`,
      label,
      hideLabel,
      disabled,
      active,
      type,
      customClass,
      onClick,
      modelValue: value ?? label ?? index,
      leadingIcon: iconLeft ?? icon,
      trailingIcon: iconRight,
    }
  })
})

const selectedButtonKey = computed({
  get: () => {
    const selectedButton = resolvedButtons.value.find((button) =>
      Object.is(button.modelValue, props.modelValue),
    )

    if (selectedButton) {
      return selectedButton.key
    }

    return resolvedButtons.value.find((button) => button.active)?.key
  },
  set: (nextKey) => {
    const selectedButton = resolvedButtons.value.find(
      (button) => button.key === nextKey,
    )
    emit('update:modelValue', selectedButton?.modelValue)
  },
})

function hasLabel(label: TabButton['label']) {
  return label !== undefined && label !== null && label !== ''
}
</script>

<template>
  <RadioGroupRoot v-model="selectedButtonKey" v-bind="$attrs">
    <div
      class="inline-flex min-h-7 items-center gap-0.5 rounded-md bg-surface-gray-2 p-px ring-1 ring-inset ring-outline-gray-1"
    >
      <RadioGroupItem
        v-for="button in resolvedButtons"
        :key="button.key"
        v-slot="{ checked, disabled }"
        as="template"
        :disabled="button.disabled"
        :value="button.key"
      >
        <button
          :type="button.type"
          :disabled="disabled"
          :aria-label="
            button.hideLabel && hasLabel(button.label)
              ? String(button.label)
              : undefined
          "
          :title="
            button.hideLabel && hasLabel(button.label)
              ? String(button.label)
              : undefined
          "
          class="inline-flex h-7 shrink-0 items-center justify-center gap-2 rounded-[9px] border border-transparent text-base transition-[transform,background-color,color,box-shadow,border-color] duration-150 ease-out motion-safe:active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          :class="[
            button.hideLabel ? 'w-7 px-0' : 'px-2.5',
            checked
              ? 'border-outline-gray-1 bg-surface-white text-ink-gray-8 shadow-sm'
              : disabled
                ? 'bg-transparent text-ink-gray-4'
                : 'bg-transparent text-ink-gray-5 hover:bg-surface-gray-3/80 hover:text-ink-gray-7',
            button.customClass,
          ]"
          @click="button.onClick?.($event)"
        >
          <FeatherIcon
            v-if="button.leadingIcon && typeof button.leadingIcon === 'string'"
            :name="button.leadingIcon"
            class="h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <component
            :is="button.leadingIcon"
            v-else-if="button.leadingIcon"
            class="h-4 w-4 shrink-0"
            aria-hidden="true"
          />

          <span
            v-if="hasLabel(button.label)"
            class="flex min-w-0 items-center truncate"
            :class="button.hideLabel ? 'sr-only' : undefined"
          >
            {{ button.label }}
          </span>

          <FeatherIcon
            v-if="
              button.trailingIcon && typeof button.trailingIcon === 'string'
            "
            :name="button.trailingIcon"
            class="h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <component
            :is="button.trailingIcon"
            v-else-if="button.trailingIcon"
            class="h-4 w-4 shrink-0"
            aria-hidden="true"
          />
        </button>
      </RadioGroupItem>
    </div>
  </RadioGroupRoot>
</template>
