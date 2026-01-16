<template>
  <span
    v-if="loading"
    ref="skeletonRef"
    :class="[
      'inline-block rounded-md animate-pulse bg-gray-200 dark:bg-gray-700',
      $attrs.class
    ]"
    :style="computedStyle"
    aria-hidden="true"
    tabindex="-1"
    :inert="true"
  >
    <span class="invisible">
      <slot />
    </span>
  </span>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SkeletonProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SkeletonProps>(), {
  loading: true,
  width: undefined,
  height: undefined,
})

const skeletonRef = ref<HTMLElement>()

const computedStyle = computed(() => {
  const style: Record<string, string> = {}  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }  
  return style
})
</script>
