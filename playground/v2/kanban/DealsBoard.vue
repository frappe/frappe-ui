<script setup lang="ts">
// The board (deals-kanban, 31739:28633): five 268px columns side by side,
// each padded 8 — a 16px head row (the stages glyph · 8px · the 14 medium
// gray-700 stage, and on the right the ⋯ and + glyphs 8px apart) · 14px ·
// the cards, 10px apart. The board is wider than the stage, so it scrolls
// sideways as a board does.
import EIcon from '../../espresso-sidebar/EIcon.vue'
import DealCard from './DealCard.vue'
import { STAGES } from './deals'
</script>

<template>
  <div class="v2-scroll w-full overflow-x-auto">
    <div class="flex w-max" role="list" aria-label="Deals by stage">
      <section
        v-for="stage in STAGES"
        :key="stage.name"
        class="flex w-[268px] shrink-0 flex-col gap-3.5 p-2"
        role="listitem"
        :aria-label="stage.name"
      >
        <header class="flex h-4 items-center gap-2">
          <EIcon name="stages" class="size-4 shrink-0" />
          <h3
            class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-7"
          >
            {{ stage.name }}
          </h3>
          <span class="flex shrink-0 gap-2 text-ink-gray-7">
            <button type="button" class="kanban-glyph" aria-label="More">
              <EIcon name="dot-horizontal" class="size-4" />
            </button>
            <button type="button" class="kanban-glyph" aria-label="Add deal">
              <EIcon name="small-add" class="size-4" />
            </button>
          </span>
        </header>
        <div class="flex flex-col gap-2.5">
          <DealCard v-for="deal in stage.deals" :key="deal.org" :deal="deal" />
        </div>
      </section>
    </div>
  </div>
</template>

<style>
.kanban-glyph {
  @apply flex size-4 items-center justify-center rounded-2 transition-colors hover:text-ink-gray-9;
}
</style>
