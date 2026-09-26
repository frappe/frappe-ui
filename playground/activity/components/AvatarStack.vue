<script setup lang="ts">
import { Avatar } from '../../../src'
import { faceFor } from '../../components/patterns/designAssets'

defineProps<{
  /** Names, in the order the design stacks them. */
  people: string[]
  /** A name ending in "…" style initials instead of a face, e.g. "N". */
  initials?: string[]
}>()
</script>

<template>
  <!--
    frappe-ui has no avatar-group, so this is the design's own: 20px avatars
    overlapping by 4px, each ringed so the one in front cuts a clean edge out
    of the one behind. The ring takes the card's colour, not the page's —
    identical in the light theme, and the only one that disappears in the dark
    one, where a card sits a step above the page. Written as a CSS variable
    because `ringColor` in the preset carries the outline tokens only.
  -->
  <div class="flex shrink-0 items-center -space-x-1">
    <Avatar
      v-for="person in people"
      :key="person"
      size="sm"
      :image="faceFor(person)"
      :label="person"
      class="ring-2 ring-[--surface-elevation-1]"
    />
    <Avatar
      v-for="letter in initials"
      :key="letter"
      size="sm"
      :label="letter"
      class="ring-2 ring-[--surface-elevation-1]"
    />
  </div>
</template>
