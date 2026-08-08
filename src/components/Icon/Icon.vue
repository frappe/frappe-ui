<script setup lang="ts">
import type { Component } from 'vue'
import { watchEffect } from 'vue'
import {
  isEmojiIconString,
  isLucideIconString,
  warnUnsupportedIconString,
} from '../../utils/iconString'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /**
   * Icon source. Supported forms:
   * - `lucide-*` string  → rendered via the Tailwind mask plugin.
   * - emoji / symbol string → rendered as plain text.
   * - Vue component → rendered via `<component :is>`.
   * Any other string (e.g. a bare feather-style name) is unsupported —
   * it renders nothing and warns once in dev. Falsy values render nothing.
   */
  name?: string | Component | null
}>()

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
