<script setup lang="ts">
// The Cards page: every card type stacked down one column under a Cards
// title, each under its heading, as the Popovers and List pages lay theirs
// out — without their frames: the cards carry their own edges. The outline on
// the right names them. (The old "Card type" picker —
// list/ListTypePicker.vue — is parked, not deleted.)
import DefaultCards from './DefaultCards.vue'
import ListCards from './ListCards.vue'
import FileCards from './FileCards.vue'
import NoteCards from './NoteCards.vue'
import KpiCards from './KpiCards.vue'
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections is-flow cards-flow" data-sections>
      <header class="v2-flow-head">
        <h1 class="text-4xl-semibold text-ink-gray-9">Cards</h1>
        <p class="text-p-base text-ink-gray-6">
          Every card type, down the page.
        </p>
      </header>
      <section
        id="default"
        class="v2-section"
        data-section
        data-label="Default"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Default</h2>
        <DefaultCards />
      </section>
      <section id="list" class="v2-section" data-section data-label="List">
        <h2 class="text-3xl-semibold text-ink-gray-8">List</h2>
        <ListCards />
      </section>
      <section id="note" class="v2-section" data-section data-label="Note">
        <h2 class="text-3xl-semibold text-ink-gray-8">Note</h2>
        <NoteCards />
      </section>
      <section id="file" class="v2-section" data-section data-label="File">
        <h2 class="text-3xl-semibold text-ink-gray-8">File</h2>
        <FileCards />
      </section>
      <section id="kpi" class="v2-section" data-section data-label="KPI">
        <h2 class="text-3xl-semibold text-ink-gray-8">KPI</h2>
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
</style>
