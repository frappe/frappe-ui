<script setup lang="ts">
// The Cards page: every card type, one to a screen. The stage scrolls and
// snaps between them, and the outline on the right names them. (The old
// "Card type" picker — list/ListTypePicker.vue — is parked, not deleted.)
import DefaultCards from './DefaultCards.vue'
import ListCards from './ListCards.vue'
import FileCards from './FileCards.vue'
import NoteCards from './NoteCards.vue'
import KpiCards from './KpiCards.vue'
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections" data-sections>
      <section
        id="default"
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
