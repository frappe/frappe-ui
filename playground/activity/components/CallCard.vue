<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Button } from '../../../src'
import AvatarStack from './AvatarStack.vue'
import CallRecording from './CallRecording.vue'

/** What the call was: a date, a duration. Read-only, so a Badge. */
export type CallFact = { icon: string; label: string }

/** What you can do with it: listen, read the notes. Pressed, so a Button. */
export type CallAction = { icon: string; label: string }

const props = withDefaults(
  defineProps<{
    /** "Inbound Call" / "Outbound Call". */
    title: string
    /** The red second line — "Missed call", "Rejected". */
    status?: string
    /** Date and duration, in the order the design lists them. */
    facts?: CallFact[]
    /** Listen, Notes — they sit in the same row, right after the facts. */
    actions?: CallAction[]
    /** Who was on the call. */
    people?: string[]
    initials?: string[]
    /** The design shows the recording opened out on one call. */
    player?: boolean
  }>(),
  { facts: () => [], actions: () => [], people: () => [], initials: () => [] },
)

/**
 * An action is a Button so it can be pressed, wearing the badge's clothes so
 * the row reads as one set of pills: the badge's corners, its 8px sides and
 * its 13px label, none of which `xs` gives you.
 */
const actionClasses = '!rounded-full !px-2 !text-sm !text-ink-gray-6'

/**
 * The card's four gaps have to *look* the same, which isn't the same as
 * measuring the same. Against the 1px border, `px-3` puts the text 14.1px in
 * from either side and `pt-2.5` puts the title's ascender 14.2px down — the
 * 3.2px of empty line box above it does the rest.
 *
 * The bottom is the odd one out. Anything that ends in a box (the facts row,
 * the player) stops at the padding, so it needs 13 to land in the same place
 * — hence `pb-[13px]`. Anything that ends in text carries 2.5px of line box
 * past the baseline instead. That tail is pulled back here, so text bottoms
 * out on its baseline the way a box bottoms out on its edge.
 *
 * Nothing is trimmed when something follows the text — the 4px between it and
 * the facts row is its own measurement — and when the avatars are the taller
 * side of the row the trim simply doesn't apply.
 */
const tailTrim = computed(() =>
  props.player || props.facts.length || props.actions.length
    ? ''
    : '-mb-[2.5px]',
)
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-6 border border-outline-gray-1 bg-surface-elevation-1 px-3 pb-[13px] pt-2.5"
  >
    <div class="flex flex-col gap-1">
      <div class="flex items-start gap-3">
        <!--
          2px between the two lines, as the design sets it for this card — the
          event card's own pair sits 8 apart, so this number is the call
          card's alone. Both lines are on the same 16.1px line height so the
          2 is the whole gap: the status used to be `text-p-base`, whose 21px
          line stood in for the spacing with the boxes flush against each
          other, which left it at the mercy of the type style.
        -->
        <div class="flex min-w-0 flex-1 flex-col gap-[2px]" :class="tailTrim">
          <p class="text-base-medium text-ink-gray-7">{{ title }}</p>
          <p v-if="status" class="text-base text-ink-red-5">{{ status }}</p>
        </div>
        <AvatarStack :people="people" :initials="initials" />
      </div>

      <div
        v-if="facts.length || actions.length"
        class="flex items-center gap-[5px]"
      >
        <Badge
          v-for="fact in facts"
          :key="fact.label"
          theme="gray"
          variant="subtle"
          size="lg"
        >
          <template #prefix>
            <span
              :class="[fact.icon, 'size-3 text-ink-gray-5']"
              aria-hidden="true"
            />
          </template>
          {{ fact.label }}
        </Badge>

        <Button
          v-for="action in actions"
          :key="action.label"
          size="xs"
          variant="subtle"
          :class="actionClasses"
        >
          <template #prefix>
            <span
              :class="[action.icon, 'size-3 text-ink-gray-5']"
              aria-hidden="true"
            />
          </template>
          {{ action.label }}
        </Button>
      </div>
    </div>

    <!-- The recording, open: play, scrubber, elapsed, volume, more. -->
    <CallRecording v-if="player" />
  </div>
</template>
