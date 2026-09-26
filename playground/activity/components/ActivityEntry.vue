<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '../../../src'
import { faceFor } from '../../components/patterns/designAssets'

const props = defineProps<{
  /** A lucide class for the rail, e.g. `lucide-phone-missed`. */
  icon?: string
  /** Tint for that icon. Espresso uses ink-gray-5, red for a missed call. */
  iconClass?: string
  /** An email entry puts the sender's face on the rail instead of an icon. */
  person?: string
  /** A change entry puts a small amber dot there. */
  dot?: boolean
  /**
   * How far down the rail mark sits, so it lines up with the first line of
   * whatever the entry holds: a card's own header sits lower than a bare row.
   * Left out, an icon entry gets 2 — the 28px mark centred on the 32px
   * header row above the card, so the mark and the avatar share a centre —
   * and everything else gets 0, which is already centred on its own row.
   */
  offset?: number
}>()

// The mark hangs from the entry's top; where that lines up depends on what
// the entry holds, so an icon entry is nudged onto the header's centre.
const padTop = computed(() => props.offset ?? (props.icon ? 2 : 0))
</script>

<template>
  <!-- 28px rail, 16px gap, and the rest of the row is the entry itself. -->
  <div class="flex gap-4">
    <div class="w-7 shrink-0" :style="{ paddingTop: `${padTop}px` }">
      <!--
        The mark sits on the feed's hairline and is opaque, so the line is
        interrupted at it rather than drawn around it. `data-rail-mark` is
        what the feed measures to find where the line starts and stops.
      -->
      <div
        data-rail-mark
        class="relative flex size-7 items-center justify-center rounded-full bg-surface-base"
      >
        <Avatar
          v-if="person"
          size="lg"
          :image="faceFor(person)"
          :label="person"
        />
        <span
          v-else-if="dot"
          class="size-1.5 rounded-full bg-surface-amber-6"
          aria-hidden="true"
        />
        <span
          v-else
          :class="[icon, 'size-4', iconClass || 'text-ink-gray-5']"
          aria-hidden="true"
        />
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
