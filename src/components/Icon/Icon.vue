<script setup lang="ts">
import { watchEffect } from 'vue'
import {
  isEmojiIconString,
  isLucideIconString,
  warnUnsupportedIconString,
} from '../../utils/iconString'
import type { IconProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<IconProps>()

watchEffect(() => {
  warnUnsupportedIconString('Icon', 'icon', props.icon)
})
</script>

<template>
  <span
    v-if="typeof icon === 'string' && isLucideIconString(icon)"
    :class="[icon]"
    v-bind="$attrs"
    aria-hidden="true"
  />
  <span
    v-else-if="typeof icon === 'string' && isEmojiIconString(icon)"
    class="inline-flex items-center justify-center leading-none"
    v-bind="$attrs"
    aria-hidden="true"
    >{{ icon }}</span
  >
  <component
    v-else-if="icon && typeof icon !== 'string'"
    :is="icon"
    v-bind="$attrs"
    aria-hidden="true"
  />
</template>
