<script setup lang="ts">
import { Button } from '../../../src'

defineProps<{
  /** "June", "May", "Jun". */
  label: string
}>()

// Open or folded away. The chevron follows it, and so does the section below.
const open = defineModel<boolean>({ default: true })
</script>

<template>
  <!--
    The month a section belongs to, and the control that folds it away. A
    Button at `xs` (24px) — Espresso drew it as a badge, but a badge is not
    something you press — carrying the badge's fully rounded corners, which is
    how the design reads. `!` because `rounded-3` comes with the size.

    `relative` so it paints over the feed's hairline: the chip is opaque, so
    the line meets its top and bottom edges and is never seen inside it.
    `data-rail-cap` tells the feed to start its line at this chip's bottom
    edge when the chip opens the feed. `!gap-1` is the design's 4px between
    the label and the chevron — the button's own 8 reads as a hole, the more
    so because a lucide glyph carries ~3.5px of bearing inside its box.
  -->
  <Button
    data-rail-cap
    class="relative !gap-1 !rounded-full self-start"
    size="xs"
    variant="outline"
    :label="label"
    :icon-right="open ? 'lucide-chevron-up' : 'lucide-chevron-down'"
    :aria-expanded="open"
    @click="open = !open"
  />
</template>
