<script setup lang="ts">
// The Kanban card page: the deals board from the file's core screen, then
// the kanban item usage pattern from the cards page — one to a screen, the
// outline on the right naming them.
import DealsBoard from './DealsBoard.vue'
import KanbanItems from './KanbanItems.vue'
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections" data-sections>
      <section
        id="board"
        class="v2-section !items-start"
        data-section
        data-label="Deals board"
      >
        <DealsBoard />
      </section>
      <section
        id="item"
        class="v2-section"
        data-section
        data-label="Kanban item"
      >
        <KanbanItems />
      </section>
    </div>
  </div>
</template>
