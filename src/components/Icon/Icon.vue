<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import {
  isEmojiIconString,
  isLucideIconString,
  warnUnsupportedIconString,
} from '../../utils/iconString'
import type { IconProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<IconProps>()

const resolvedIcon = computed(() =>
  props.icon !== undefined ? props.icon : props.name,
)

watchEffect(() => {
  const sourceProp = props.icon !== undefined ? 'icon' : 'name'
  warnUnsupportedIconString('Icon', sourceProp, resolvedIcon.value)
})
</script>

<template>
  <span
    v-if="typeof resolvedIcon === 'string' && isLucideIconString(resolvedIcon)"
    :class="[resolvedIcon]"
    v-bind="$attrs"
    aria-hidden="true"
  />
  <span
    v-else-if="
      typeof resolvedIcon === 'string' && isEmojiIconString(resolvedIcon)
    "
    class="inline-flex items-center justify-center leading-none"
    v-bind="$attrs"
    aria-hidden="true"
    >{{ resolvedIcon }}</span
  >
  <component
    v-else-if="resolvedIcon && typeof resolvedIcon !== 'string'"
    :is="resolvedIcon"
    v-bind="$attrs"
    aria-hidden="true"
  />
</template>
