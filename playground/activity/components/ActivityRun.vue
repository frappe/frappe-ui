<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Space between the entries in this run. Espresso: 20. */
    gap?: number
    /** Whether the month this run belongs to is open. */
    open?: boolean
    /** The feed's own gap, which the run takes back as it folds away. */
    feedGap?: number
  }>(),
  { gap: 20, open: true, feedGap: 16 },
)
</script>

<template>
  <!--
    A stretch of entries that belong to the same month, and the fold. The row
    grows from `0fr` to `1fr`, so it takes the height it needs without anyone
    measuring it, and the negative margin swallows the feed's own gap on the
    way out — otherwise two chips would sit 32 apart with nothing between them.
  -->
  <div
    class="grid transition-[grid-template-rows,margin-top,opacity] duration-200 ease-out"
    :class="open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    :style="{ marginTop: open ? undefined : `-${feedGap}px` }"
  >
    <!--
      `data-clip` tells the feed how much of a mark is actually showing.

      The 3px of padding grows the clipping box, and the negative margin on
      the same element takes those 3px back out of the layout — so the run
      ends where it always did, but whatever closes it sits 3px clear of the
      edge. Without that, `overflow-hidden` slices the focus ring off the
      bottom of the last thing in the run. The margin has to sit on the
      clipping box itself: on the child it only shrinks what the child
      occupies, and the content still ends flush.
    -->
    <div data-clip class="-mb-[3px] overflow-hidden pb-[3px]">
      <div class="flex flex-col" :style="{ gap: `${gap}px` }">
        <slot />
      </div>
    </div>
  </div>
</template>
