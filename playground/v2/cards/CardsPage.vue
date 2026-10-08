<script setup lang="ts">
// The Cards page: every card type stacked down one column under a Cards
// title, as the Popovers and List pages lay theirs out — without their frames
// or headings: the cards carry their own edges, a hairline parts one type from
// the next, and the outline on the right names them. (The old "Card type" picker —
// list/ListTypePicker.vue — is parked, not deleted.)
import DefaultCards from './DefaultCards.vue'
import ListCards from './ListCards.vue'
import FileCards from './FileCards.vue'
import NoteCards from './NoteCards.vue'
import KpiCards from './KpiCards.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * The title starts where the first card does. The default row is centred and
 * wraps as the stage narrows — four across at 1146, three at 914 — so its left
 * edge moves with the width, and the title is indented to it whenever the row
 * re-lays itself rather than held to one number.
 */
const firstRow = ref<HTMLElement>()
const titleInset = ref(0)
let rowObserver: ResizeObserver | undefined
function alignTitle() {
  const section = firstRow.value
  const card = section?.firstElementChild?.firstElementChild as
    | HTMLElement
    | null
    | undefined
  if (!section || !card) return
  // From the section, which spans the column: the row itself shrinks to its
  // cards when they fit on one line, so its own edge is the first card's.
  // Layout offsets, not client rects: the page arrives through a transition
  // that moves and scales it, and a rect read then is off by that much.
  titleInset.value = Math.max(0, card.offsetLeft - section.offsetLeft)
}
let settle: number | undefined
onMounted(() => {
  alignTitle()
  rowObserver = new ResizeObserver(alignTitle)
  if (firstRow.value) rowObserver.observe(firstRow.value)
  // once more after the page's entry transition has let go of it
  settle = window.setTimeout(alignTitle, 400)
})
onBeforeUnmount(() => {
  rowObserver?.disconnect()
  clearTimeout(settle)
})
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections is-flow cards-flow" data-sections>
      <header
        class="v2-flow-head"
        :style="{ paddingInlineStart: `${titleInset}px` }"
      >
        <h1 class="text-4xl-semibold text-ink-gray-9">Cards</h1>
        <p class="text-p-base text-ink-gray-6">
          Every card type, down the page.
        </p>
      </header>
      <section
        id="default"
        ref="firstRow"
        class="v2-section"
        data-section
        data-label="Default"
      >
        <DefaultCards />
      </section>
      <section id="list" class="v2-section" data-section data-label="List">
        <ListCards />
      </section>
      <section id="note" class="v2-section" data-section data-label="Note">
        <NoteCards />
      </section>
      <section id="file" class="v2-section" data-section data-label="File">
        <FileCards />
      </section>
      <section id="kpi" class="v2-section" data-section data-label="KPI">
        <KpiCards />
      </section>
    </div>
  </div>
</template>

<style>
/* The cards keep the widths they had as screens of their own: the column runs
   the stage's whole width (the KPI row is fluid and the default row 1146
   across), at the 20 a screen held off the stage's sides, rather than the
   900 the other flow pages keep. The flow layout centres a section's text,
   which the cards would inherit; they read from the start, as they did. */
.v2-sections.is-flow.cards-flow {
  padding-inline: 20px;
}
.v2-sections.is-flow.cards-flow > .v2-flow-head,
.v2-sections.is-flow.cards-flow > .v2-section {
  max-width: none;
}
.v2-sections.is-flow.cards-flow > .v2-section {
  text-align: start;
}
/* a hairline between one card type and the next, 64 from the cards on either
   side: the column's own 64 above it, as much again below */
.v2-sections.is-flow.cards-flow > .v2-section + .v2-section {
  @apply border-t border-outline-gray-1 pt-16;
}
</style>
