<script setup lang="ts">
import type { Component } from 'vue'
import FeatherIcon from '../FeatherIcon.vue'
import {
  isEmojiIconString,
  isLucideIconString,
} from '../../utils/iconString'

defineOptions({ inheritAttrs: false })

defineProps<{
  /**
   * Icon source. Supported forms:
   * - `lucide-*` string  → rendered via the Tailwind mask plugin.
   * - emoji / symbol string → rendered as plain text.
   * - Legacy feather name → rendered via `<FeatherIcon>`.
   * - Vue component → rendered via `<component :is>`.
   * Falsy values render nothing.
   */
  name?: string | Component | null
}>()
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
  <FeatherIcon
    v-else-if="typeof name === 'string' && name"
    :name="name"
    v-bind="$attrs"
    aria-hidden="true"
  />
  <component
    v-else-if="name && typeof name !== 'string'"
    :is="name"
    v-bind="$attrs"
    aria-hidden="true"
  />
</template>
