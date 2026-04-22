<script setup lang="ts">
import { computed } from 'vue'
import { RadioGroupRoot, RadioGroupItem } from 'reka-ui'
import Button from '../Button/Button.vue'
import type { ButtonProps } from '../Button'

defineOptions({
  name: 'TabButtons',
  inheritAttrs: false,
})

type TabButtonValue = string | number | boolean

interface TabButton extends ButtonProps {
  value?: TabButtonValue
  hideLabel?: boolean
  onClick?: (event: MouseEvent) => void
}

const props = defineProps<{
  buttons: TabButton[]
  modelValue?: TabButtonValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TabButtonValue | undefined]
}>()

const selectedButtonKey = computed({
  get: () => {
    return resolvedButtons.value.find((button) =>
      Object.is(button.modelValue, props.modelValue),
    )?.key
  },
  set: (nextKey) => {
    const selectedButton = resolvedButtons.value.find(
      (button) => button.key === nextKey,
    )
    emit('update:modelValue', selectedButton?.modelValue)
  },
})

const resolvedButtons = computed(() => {
  return props.buttons.map((button, index) => {
    const {
      value,
      hideLabel = false,
      onClick,
      icon,
      iconLeft,
      label,
      ...buttonProps
    } = button

    const hasVisibleLabel = Boolean(label) && !hideLabel

    return {
      key: `tab-button-${index}`,
      label,
      hideLabel,
      onClick,
      modelValue: value ?? label ?? index,
      buttonProps: {
        ...buttonProps,
        label,
        icon: hasVisibleLabel ? undefined : icon,
        iconLeft: hasVisibleLabel ? (iconLeft ?? icon) : iconLeft,
        type: buttonProps.type ?? 'button',
        variant: buttonProps.variant ?? 'ghost',
      },
    }
  })
})
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
        :disabled="button.buttonProps.disabled"
        :value="button.key"
      >
        <Button
          v-bind="button.buttonProps"
          :aria-label="button.hideLabel ? button.label : undefined"
          :title="button.hideLabel ? button.label : undefined"
          class="!h-6.5 rounded-md border border-transparent px-2.5 shadow-none transition-[transform,background-color,color,box-shadow,border-color] duration-150 ease-out motion-safe:active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          :class="[
            checked
              ? '!border-outline-gray-1 !bg-surface-white !text-ink-gray-8 shadow-sm'
              : disabled
                ? '!bg-transparent !text-ink-gray-4'
                : '!bg-transparent !text-ink-gray-5 hover:!bg-surface-gray-3/80 hover:!text-ink-gray-7',
          ]"
          @click="button.onClick?.($event)"
        >
          <span
            v-if="button.label"
            class="flex min-w-0 items-center"
            :class="button.hideLabel ? 'sr-only' : undefined"
          >
            {{ button.label }}
          </span>
        </Button>
      </RadioGroupItem>
    </div>
  </RadioGroupRoot>
</template>
