<template>
  <!-- Select trigger from the Espresso subheaders: an optional leading glyph,
       a value, and a disclosure chevron. -->
  <button
    type="button"
    class="flex shrink-0 items-center gap-1 rounded-4 transition-colors hover:bg-surface-gray-3 active:bg-surface-gray-4"
    :class="[
      size === 'md' ? 'h-8 py-2 pl-2.5 pr-2' : 'h-7 py-1.5 pl-2 pr-1.5',
      variant === 'subtle' ? 'bg-surface-gray-2' : 'bg-transparent',
    ]"
  >
    <span class="flex items-center gap-1.5">
      <EIcon v-if="icon" :name="icon" class="size-4" :class="inkClass" />
      <span
        v-if="label"
        class="whitespace-nowrap"
        :class="[textClass, inkClass]"
      >
        {{ label }}
      </span>
    </span>
    <EIcon
      v-if="chevron"
      name="small-down"
      class="size-4"
      :class="chevronClass ?? inkClass"
    />
  </button>
</template>

<script setup lang="ts">
import EIcon from '../espresso-sidebar/EIcon.vue'

withDefaults(
  defineProps<{
    label?: string
    icon?: string
    variant?: 'subtle' | 'ghost'
    size?: 'sm' | 'md'
    /** Type style of the value. */
    textClass?: string
    /** Ink of the glyph and value. */
    inkClass?: string
    /** Ink of the chevron, when it differs from the value. */
    chevronClass?: string
    /** Show the disclosure chevron. The view controls (Columns, Group…) have none. */
    chevron?: boolean
  }>(),
  {
    variant: 'subtle',
    size: 'sm',
    textClass: 'text-base',
    inkClass: 'text-ink-gray-7',
    chevron: true,
  },
)
</script>
