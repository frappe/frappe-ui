<script setup lang="ts">
// The board (deals-kanban, 31739:28633): five columns side by side, each
// padded 8 — a 16px head row (the stages glyph · 8px · the 14 medium
// gray-700 stage, and on the right the ⋯ and + glyphs 8px apart) · 14px ·
// the cards, 10px apart. The cards are the file's list card at its own
// 268px, so a column is 284 wide. The board is wider than the stage, so it
// scrolls sideways as a board does.
//
// The cards move: pick one up and carry it to another stage, or above or
// below its neighbours. While it is in the air a slot its own height opens
// where it would land, the card it left dims, and dropping it there moves
// it; dropping anywhere else puts it back.
import { computed, ref } from 'vue'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import DealCard from './DealCard.vue'
import { STAGES, type Deal } from './deals'

type Card = Deal & { id: string }
interface Column {
  name: string
  cards: Card[]
}

const columns = ref<Column[]>(
  STAGES.map((s, i) => ({
    name: s.name,
    cards: s.deals.map((d, j) => ({ ...d, id: `${i}-${j}` })),
  })),
)

// what is in the air, and the slot it is over
const dragging = ref<{ id: string; from: number } | null>(null)
const over = ref<{ column: number; index: number } | null>(null)

function lift(e: DragEvent, card: Card, column: number) {
  dragging.value = { id: card.id, from: column }
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', card.id)
  }
}

// Where in the column the pointer is: above a card's middle means before
// it, past the last card's middle means the end.
function hover(e: DragEvent, column: number) {
  if (!dragging.value) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  const list = e.currentTarget as HTMLElement
  const cards = [...list.querySelectorAll<HTMLElement>('[data-card]')].filter(
    (el) => el.dataset.card !== dragging.value!.id,
  )
  let index = cards.length
  for (let i = 0; i < cards.length; i++) {
    const r = cards[i].getBoundingClientRect()
    if (e.clientY < r.top + r.height / 2) {
      index = i
      break
    }
  }
  if (over.value?.column !== column || over.value.index !== index)
    over.value = { column, index }
}

function leave(e: DragEvent) {
  // leaving for a child of the same list is not leaving the list
  const list = e.currentTarget as HTMLElement
  if (e.relatedTarget instanceof Node && list.contains(e.relatedTarget)) return
  if (over.value) over.value = null
}

function drop(e: DragEvent, column: number) {
  e.preventDefault()
  if (!dragging.value || !over.value) return settle()
  const from = columns.value[dragging.value.from]
  const at = from.cards.findIndex((c) => c.id === dragging.value!.id)
  const [card] = from.cards.splice(at, 1)
  columns.value[column].cards.splice(over.value.index, 0, card)
  settle()
}

function settle() {
  dragging.value = null
  over.value = null
}

// each column's cards with the open slot in place, as the list draws them
const laid = computed(() =>
  columns.value.map((col, ci) => {
    const rows: ({ kind: 'card'; card: Card } | { kind: 'slot' })[] = col.cards
      .filter(
        (c) =>
          !(
            dragging.value &&
            over.value &&
            c.id === dragging.value.id &&
            over.value.column === ci
          ),
      )
      .map((card) => ({ kind: 'card' as const, card }))
    if (over.value?.column === ci)
      rows.splice(over.value.index, 0, { kind: 'slot' })
    return rows
  }),
)
</script>

<template>
  <div class="v2-scroll w-full overflow-x-auto">
    <div class="flex w-max" role="list" aria-label="Deals by stage">
      <section
        v-for="(stage, ci) in columns"
        :key="stage.name"
        class="flex w-[284px] shrink-0 flex-col gap-3.5 p-2"
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
        <!-- the list takes the drop across its whole height, an empty stage
             included -->
        <div
          class="flex min-h-[168px] flex-1 flex-col gap-2.5"
          @dragover="hover($event, ci)"
          @dragleave="leave"
          @drop="drop($event, ci)"
        >
          <template
            v-for="(row, i) in laid[ci]"
            :key="row.kind === 'card' ? row.card.id : `slot-${i}`"
          >
            <div
              v-if="row.kind === 'card'"
              :data-card="row.card.id"
              draggable="true"
              class="cursor-grab active:cursor-grabbing"
              :class="dragging?.id === row.card.id && 'opacity-40'"
              @dragstart="lift($event, row.card, ci)"
              @dragend="settle"
            >
              <DealCard :deal="row.card" />
            </div>
            <div
              v-else
              class="h-[168px] w-[268px] rounded-7 border border-dashed border-outline-gray-3 bg-surface-gray-2"
              aria-hidden="true"
            />
          </template>
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
