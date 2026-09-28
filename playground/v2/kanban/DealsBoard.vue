<script setup lang="ts">
// The board, as the Frappe CRM deals board draws it (Frappe-CRM ›
// deals-board view, 11527:137169): five 284px columns side by side, each
// padded 8 with 16px corners — a 28px head row, 6px in: the stage glyph in
// the stage's own colour · 8px · the 14 regular gray-700 stage, and on the
// right the ⋯ and + glyphs · 10px · the 268 × 172 cards, 10px apart. The
// column under the pointer — hovered, or with a card in the air over it —
// takes the file's wash, gray-50 at the head fading to the board by its
// foot. The board is wider than the stage, so it scrolls sideways as a
// board does.
//
// The cards move: pick one up and carry it to another stage, or above or
// below its neighbours. While it is in the air a plain gray-100 slot its
// own size opens where it would land, the card it left dims, and dropping
// it there moves it; dropping anywhere else puts it back.
import { computed, ref } from 'vue'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import DealCard from './DealCard.vue'
import { STAGES, type Deal } from './deals'
import av1 from '../assets/cards/lc-av-1.png'
import av2 from '../assets/cards/lc-av-2.png'
import av3 from '../assets/cards/lc-av-3.png'

// the first deal of each stage carries its owner's photo; the rest show
// the owner's initial, as the reference mixes them
const PHOTOS = [av1, av2, av3]

type Card = Deal & { id: string; photo?: string }
interface Column {
  name: string
  tone: string
  cards: Card[]
}

const columns = ref<Column[]>(
  STAGES.map((s, i) => ({
    name: s.name,
    tone: s.tone,
    cards: s.deals.map((d, j) => ({
      ...d,
      id: `${i}-${j}`,
      photo: j === 0 ? PHOTOS[i % PHOTOS.length] : undefined,
    })),
  })),
)

// what is in the air, and the slot it is over
const dragging = ref<{ id: string; from: number } | null>(null)
const over = ref<{ column: number; index: number } | null>(null)

function lift(e: DragEvent, card: Card, column: number) {
  dragging.value = { id: card.id, from: column }
  if (!e.dataTransfer) return
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', card.id)
  // the card in the air rides tilted under a deeper shadow, as the
  // reference carries it: a copy, drawn that way, is the drag image
  const el = e.currentTarget as HTMLElement
  const ghost = el.cloneNode(true) as HTMLElement
  const r = el.getBoundingClientRect()
  ghost.classList.add('kanban-ghost')
  ghost.style.width = `${r.width}px`
  document.body.appendChild(ghost)
  e.dataTransfer.setDragImage(ghost, e.clientX - r.left, e.clientY - r.top)
  requestAnimationFrame(() => ghost.remove())
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
        class="kanban-column relative isolate flex w-[284px] shrink-0 flex-col gap-2.5 rounded-7 p-2"
        :class="over?.column === ci && 'is-over'"
        role="listitem"
        :aria-label="stage.name"
      >
        <header class="flex h-7 items-center gap-2 pl-1.5">
          <EIcon name="stage" class="size-4 shrink-0" :class="stage.tone" />
          <h3
            class="min-w-0 flex-1 truncate text-base leading-4 text-ink-gray-7"
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
              <DealCard :deal="row.card" :photo="row.card.photo" />
            </div>
            <div
              v-else
              class="h-[172px] w-[268px] rounded-7 bg-surface-gray-2"
              aria-hidden="true"
            />
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
/* The file's wash on the column under the pointer: gray-50 at the head,
   the board's own colour by the foot. A gradient cannot fade in, so it sits
   on a layer beneath the cards whose opacity does. */
.kanban-column::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(
    to bottom,
    var(--surface-gray-1),
    var(--surface-base)
  );
  opacity: 0;
  transition: opacity 150ms ease-out;
}
.kanban-column:hover::before,
.kanban-column.is-over::before {
  opacity: 1;
}
/* the card in the air: tilted a touch, under the lg shadow */
.kanban-ghost {
  position: fixed;
  top: -1000px;
  left: -1000px;
  transform: rotate(-2deg);
  opacity: 1 !important;
}
.kanban-ghost article {
  @apply shadow-lg;
}
.kanban-glyph {
  @apply flex size-4 items-center justify-center rounded-2 transition-colors hover:text-ink-gray-9;
}
</style>
