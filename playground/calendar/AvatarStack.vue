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
 * `max` faces fit as they are. Past `max`, the group keeps `keep` of them
 * and a last disc says how many more there are. The header keeps three of
 * a crowd (four people are three faces and "1"); an agenda row keeps one
 * (three people are one face and "2"), since a row's group is read for
 * "who, roughly" rather than counted, and three discs a line was a third
 * column of faces down the card.
 *
 * A face is a photo where the person has one and an initial on their colour
 * where they have not; `portraitOf` decides, so the header and the rows
 * agree on who looks like what.
 */
import { computed } from 'vue'
import { Avatar } from '../../src'
import { portraitOf } from './sampleCalendars'

const props = withDefaults(
  defineProps<{
    names: string[]
    /** md is the header's 24px; sm the 20px a 32px row can hold. */
    size?: 'md' | 'sm'
    /** How many fit before the group starts counting. */
    max?: number
    /** How many faces stay once it does; `max` if not said. */
    keep?: number
  }>(),
  { size: 'md', max: 3 },
)

const faces = computed(() =>
  props.names.length > props.max
    ? props.names.slice(0, props.keep ?? props.max)
    : props.names,
)
const more = computed(() => props.names.length - faces.value.length)
</script>

<template>
  <div class="flex items-center -space-x-1">
    <!-- the rings are the surface the stack sits on; a row that changes its
         fill (an agenda row under the pointer) sets --stack-ring to match -->
    <Avatar
      v-for="(name, i) in faces"
      :key="name"
      :size="size"
      :label="name"
      :image="portraitOf(name).image"
      :theme="portraitOf(name).theme"
      class="ring-2 ring-[var(--stack-ring,var(--surface-base))]"
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
      class="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-gray-3 text-xs text-ink-gray-7 ring-2 ring-[var(--stack-ring,var(--surface-base))]"
      :class="size === 'sm' ? 'size-5' : 'size-6'"
      :title="`${more} more`"
    >
      {{ more }}
    </span>
  </div>
</template>
