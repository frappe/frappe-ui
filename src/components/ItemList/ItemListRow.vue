<script setup lang="ts">
import { Comment, Fragment, Text, computed, type VNode } from 'vue'
import type { ItemListRowProps } from './types'

const props = withDefaults(defineProps<ItemListRowProps>(), {
  as: 'div',
  size: 'sm',
  active: false,
  selected: false,
  disabled: false,
})

const isEmphasized = computed(() => {
  return props.active || props.selected
})

const sizeClasses = computed(() => {
  return {
    sm: 'min-h-7 px-2 py-1.5 text-base',
    md: 'min-h-8 px-2.5 py-1.5 text-base',
    lg: 'min-h-10 px-3 py-2 text-lg',
    xl: 'min-h-10 px-3 py-2 text-xl',
  }[props.size]
})

const stateClasses = computed(() => {
  if (props.disabled) {
    return 'cursor-not-allowed text-ink-gray-4'
  }

  return isEmphasized.value
    ? 'bg-surface-gray-2 text-ink-gray-8'
    : 'text-ink-gray-7'
})

defineSlots<{
  default?: () => any
  prefix?: () => any
  label?: () => any
  suffix?: () => any
}>()

function hasRenderableContent(nodes?: VNode[]): boolean {
  if (!nodes?.length) return false

  return nodes.some((node) => {
    if (node.type === Comment) return false

    if (node.type === Text) {
      return String(node.children ?? '').trim().length > 0
    }

    if (node.type === Fragment) {
      return hasRenderableContent(
        Array.isArray(node.children) ? (node.children as VNode[]) : [],
      )
    }

    return true
  })
}
</script>

<template>
  <component
    :is="as"
    data-slot="item-list-row"
    :data-size="size"
    :data-state="isEmphasized ? 'active' : 'inactive'"
    :data-disabled="disabled ? '' : undefined"
    :class="[
      'flex w-full items-center gap-2 rounded transition-colors',
      sizeClasses,
      stateClasses,
    ]"
  >
    <div
      v-if="hasRenderableContent($slots.prefix?.())"
      data-slot="item-prefix"
      class="flex shrink-0 items-center justify-center"
    >
      <slot name="prefix" />
    </div>

    <div data-slot="item-label" class="min-w-0 flex-1">
      <slot name="label">
        <slot />
      </slot>
    </div>

    <div
      v-if="hasRenderableContent($slots.suffix?.())"
      data-slot="item-suffix"
      class="flex shrink-0 items-center justify-center"
    >
      <slot name="suffix" />
    </div>
  </component>
</template>
