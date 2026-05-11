<script setup lang="ts">
import type { Component } from 'vue'
import {
  isEmojiIconString,
  isLucideIconString,
} from '../../../utils/iconString'

/**
 * Auto-renders an option's `icon` value across the Select / MultiSelect /
 * Combobox families:
 *
 *   - `lucide-*` strings  → `<span>` with the lucide utility class
 *     (Tailwind mask plugin renders the glyph).
 *   - emoji / symbol strings → `<span>` with text content.
 *   - Component values → rendered via `<component :is>`.
 *
 * Renders nothing when `icon` is falsy. Other string forms (e.g. legacy
 * feather names) are intentionally not handled here — those call sites
 * (Dropdown) have their own renderer.
 */
defineProps<{
  icon?: string | Component | null
}>()
</script>

<template>
  <span
    v-if="isLucideIconString(icon)"
    :class="[icon, 'size-4 shrink-0 text-ink-gray-6']"
    aria-hidden="true"
  />
  <span
    v-else-if="isEmojiIconString(icon)"
    class="inline-flex size-4 shrink-0 items-center justify-center text-base leading-none"
    aria-hidden="true"
    >{{ icon }}</span
  >
  <component
    v-else-if="icon && typeof icon !== 'string'"
    :is="icon"
    class="size-4 shrink-0 text-ink-gray-6"
    aria-hidden="true"
  />
</template>
