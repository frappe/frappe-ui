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
  warnUnsupportedIconString('Icon', 'name', props.name)
})
</script>

<template>
  <span
    v-if="typeof name === 'string' && isLucideIconString(name)"
    :class="[name]"
    v-bind="$attrs"
    aria-hidden="true"
  />
  <span
    v-else-if="typeof name === 'string' && isEmojiIconString(name)"
    class="inline-flex items-center justify-center leading-none"
    v-bind="$attrs"
    aria-hidden="true"
    >{{ name }}</span
  >
  <component
    v-else-if="name && typeof name !== 'string'"
    :is="name"
    v-bind="$attrs"
    aria-hidden="true"
  />
</template>
