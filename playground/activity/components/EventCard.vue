<script setup lang="ts">
import { Badge } from '../../../src'
import AvatarStack from './AvatarStack.vue'

withDefaults(
  defineProps<{
    /** The meeting's name. */
    title: string
    /** When it runs — "2:30 PM - 3:00 PM". */
    time: string
    /** An optional state badge above the title, e.g. "Awaiting response". */
    badge?: string
    people?: string[]
    initials?: string[]
  }>(),
  { people: () => [], initials: () => [] },
)
</script>

<template>
  <div
    class="flex gap-2 rounded-6 border border-outline-gray-1 bg-surface-elevation-1 p-2.5"
  >
    <!-- The amber bar down the left, the full height of the card's content. -->
    <div class="w-0.5 shrink-0 self-stretch rounded-full bg-surface-amber-6" />

    <!--
      The guests sit in the card's top-right corner, beside the text rather
      than inside it: a taller avatar than a line of text would otherwise open
      up the gap under the title, and the two cards would stop matching.
    -->
    <div class="flex min-w-0 flex-1 gap-2">
      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <Badge
          v-if="badge"
          class="self-start"
          theme="red"
          size="md"
          variant="subtle"
        >
          <template #prefix>
            <span class="lucide-mail size-3" aria-hidden="true" />
          </template>
          {{ badge }}
        </Badge>

        <!--
          `-mb-[2.5px]` trims the empty line box that hangs below the last
          line's baseline, so the gap under the time reads as the 10px the
          card has everywhere else instead of 12.5.
        -->
        <div class="-mb-[2.5px] flex flex-col gap-2">
          <p class="truncate text-base-medium text-ink-gray-7">{{ title }}</p>
          <p class="text-base text-ink-gray-6">{{ time }}</p>
        </div>
      </div>

      <AvatarStack class="self-start" :people="people" :initials="initials" />
    </div>
  </div>
</template>
