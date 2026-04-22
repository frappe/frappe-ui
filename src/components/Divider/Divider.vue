<template>
  <div v-if="props.action" :class="actionContainerClasses">
    <div
      role="separator"
      :aria-orientation="props.orientation"
      class="absolute border-0 border-outline-gray-2"
      :class="actionLineClasses"
    />
    <Button
      :label="props.action.label"
      :loading="props.action.loading"
      class="relative z-10"
      size="sm"
      variant="outline"
      @click="actionOnClick"
    />
  </div>

  <hr v-else class="border-0 border-outline-gray-2" :class="dividerClasses" />
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { Button } from '../../index'
import type { DividerProps } from './types'

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  position: 'center',
})

const hasWarnedAboutDeprecatedHandler = ref(false)

watchEffect(() => {
  if (props.action?.handler && !hasWarnedAboutDeprecatedHandler.value) {
    console.warn(
      '`Divider.action.handler` is deprecated. Use `Divider.action.onClick` instead.',
    )
    hasWarnedAboutDeprecatedHandler.value = true
  }
})

const actionOnClick = computed(() => {
  return props.action?.onClick ?? props.action?.handler
})

const dividerClasses = computed(() => {
  let spacerDimensionClasses = {
    horizontal: 'border-t-[1px] w-full',
    vertical: 'border-l-[1px]',
  }[props.orientation]

  let flexClasses = props.flexItem ? 'self-stretch h-auto' : 'h-full'

  return [spacerDimensionClasses, flexClasses]
})

const actionContainerClasses = computed(() => {
  let baseClasses = [
    'relative whitespace-nowrap border-0 border-outline-gray-2',
  ]

  if (props.orientation === 'horizontal') {
    let positionClasses = {
      center: 'justify-center',
      start: 'justify-start pl-4',
      end: 'justify-end pr-4',
    }[props.position]

    return [...baseClasses, 'flex w-full min-h-7 items-center', positionClasses]
  }

  let heightClasses = props.flexItem ? 'self-stretch' : 'h-full'
  let positionClasses = {
    center: 'items-center',
    start: 'items-start pt-4',
    end: 'items-end pb-4',
  }[props.position]

  return [...baseClasses, 'flex justify-center', heightClasses, positionClasses]
})

const actionLineClasses = computed(() => {
  return {
    horizontal: 'inset-x-0 top-1/2 -translate-y-1/2 border-t-[1px]',
    vertical: 'inset-y-0 left-1/2 -translate-x-1/2 border-l-[1px]',
  }[props.orientation]
})
</script>
