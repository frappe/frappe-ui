<template>
  <SwitchGroup
    as="div"
    :tabindex="switchType == SwitchVariant.ONLY_LABEL ? 0 : -1"
    @keyup.space.self="emit('update:modelValue', !modelValue)"
    :class="switchGroupClasses"
  >
    <span :class="labelContainerClasses">
      <SwitchLabel v-if="props.label" as="span" :class="switchLabelClasses">{{
        props.label
      }}</SwitchLabel>
      <SwitchDescription
        v-if="props.description"
        as="span"
        :class="switchDescriptionClasses"
      >
        {{ props.description }}
      </SwitchDescription>
    </span>
    <Switch
      :disabled="props.disabled"
      :model-value="modelValue ? true : false"
      :class="switchClasses"
      @update:model-value="emit('update:modelValue', !modelValue)"
    >
      <span aria-hidden="true" :class="switchCircleClasses"></span>
    </Switch>
  </SwitchGroup>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from '@headlessui/vue'
import type { SwitchProps } from './types'

enum SwitchVariant {
  DEFAULT,
  ONLY_LABEL,
  WITH_LABEL_AND_DESCRIPTION,
}

const props = withDefaults(defineProps<SwitchProps>(), {
  size: 'sm',
  label: '',
  description: '',
  disabled: false,
})

const emit = defineEmits(['change', 'update:modelValue'])

const switchType = computed(() => {
  if (props.label && props.description) {
    return SwitchVariant.WITH_LABEL_AND_DESCRIPTION
  }

  if (props.label) {
    return SwitchVariant.ONLY_LABEL
  }

  return SwitchVariant.DEFAULT
})

const switchClasses = computed(() => {
  return [
    'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-100 ease-in-out items-center',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3',
    'disabled:cursor-not-allowed disabled:bg-surface-gray-3',
    props.modelValue
      ? 'bg-surface-gray-7 enabled:hover:bg-surface-gray-6 active:bg-surface-gray-5 group-hover:enabled:bg-surface-gray-6'
      : 'bg-surface-gray-4 enabled:hover:bg-gray-400 active:bg-gray-500 group-hover:enabled:bg-gray-400',
    props.size === 'md' ? 'h-5 w-8 border-[3px]' : 'h-4 w-[26px] border-2',
  ]
})

const switchCircleClasses = computed(() => {
  return [
    'pointer-events-none inline-block transform rounded-full bg-surface-white shadow ring-0 transition duration-100 ease-in-out',
    props.size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3',
    props.size === 'md'
      ? props.modelValue
        ? 'translate-x-3 rtl:-translate-x-3'
        : 'translate-x-0'
      : props.modelValue
        ? 'translate-x-2.5 rtl:-translate-x-2.5'
        : 'translate-x-0',
  ]
})

const switchLabelClasses = computed(() => {
  return [
    'font-medium leading-normal',
    props.disabled && switchType.value === SwitchVariant.ONLY_LABEL
      ? 'text-ink-gray-4'
      : 'text-ink-gray-8',
    props.size === 'md' ? 'text-lg' : 'text-base',
  ]
})

const switchDescriptionClasses = computed(() => {
  return ['max-w-xs text-p-base text-ink-gray-7']
})

const switchGroupClasses = computed(() => {
  const classes = ['flex justify-between']

  if (switchType.value === SwitchVariant.ONLY_LABEL) {
    classes.push(
      'group items-center space-x-3 cursor-pointer rounded focus-visible:bg-surface-gray-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3',
    )

    classes.push(
      props.disabled
        ? 'cursor-not-allowed'
        : 'hover:bg-surface-gray-3 active:bg-surface-gray-4',
    )

    classes.push(props.size === 'md' ? 'px-3 py-1.5' : 'px-2.5 py-1.5')
  } else if (switchType.value === SwitchVariant.WITH_LABEL_AND_DESCRIPTION) {
    classes.push('items-start')
    classes.push(props.size === 'md' ? 'space-x-3.5' : 'space-x-2.5')
  }

  return classes
})

const labelContainerClasses = computed(() => {
  return ['flex flex-col space-y-0.5']
})
</script>
