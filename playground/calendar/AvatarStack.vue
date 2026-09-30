<script setup lang="ts">
/**
 * Faces overlapping by 4, the first on top — the file's `avatar-group`
 * (`itemSpacing: -4`, `itemReverseZIndex`), which frappe-ui doesn't ship.
 * Built from Avatar until it does: `-space-x-1` is the 4px, and the z-index
 * runs down the row so each face cuts a clean edge out of the one behind.
 *
 * It began in the app header and moved here when the agenda's rows needed
 * the same thing a size down: one group, drawn one way, wherever people are
 * shown together.
 *
 * The group is `max` circles at most. Past that the last stops being a face
 * and says how many are not shown — so a team of twenty reads as three
 * people and a number, not as a row of heads running into whatever is next.
 * `max` exactly still fit, so the count only appears when it would stand for
 * more than the one face it replaces.
 */
import { computed } from 'vue'
import { Avatar } from '../../src'
import { faceFor } from '../components/patterns/designAssets'

const props = withDefaults(
  defineProps<{
    names: string[]
    /** md is the header's 24px; sm the 20px a 32px row can hold. */
    size?: 'md' | 'sm'
    max?: number
  }>(),
  { size: 'md', max: 4 },
)

const faces = computed(() =>
  props.names.length > props.max
    ? props.names.slice(0, props.max - 1)
    : props.names,
)
const more = computed(() => props.names.length - faces.value.length)
</script>

<template>
  <div class="flex items-center -space-x-1">
    <Avatar
      v-for="(name, i) in faces"
      :key="name"
      :size="size"
      :label="name"
      :image="faceFor(name)"
      class="ring-2 ring-[--surface-base]"
      :style="{ zIndex: faces.length + 1 - i }"
    />
    <!--
      The count wears the same disc as the faces so the row keeps one rhythm,
      but no initial and no colour of its own: it stands for people rather
      than being one, and a tinted disc among the faces read as one more of
      them.
    -->
    <span
      v-if="more"
      class="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-gray-3 text-xs text-ink-gray-7 ring-2 ring-[--surface-base]"
      :class="size === 'sm' ? 'size-5' : 'size-6'"
      :title="`${more} more`"
    >
      {{ more }}
    </span>
  </div>
</template>
