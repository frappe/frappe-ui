<script setup lang="ts">
// The board, as the Frappe CRM deals board draws it (Frappe-CRM ›
// deals-board view, 11527:137169): five 284px columns side by side, each
// padded 8 with 16px corners — a 28px head row, 6px in: the stage glyph in
// the stage's own colour · 8px · the 14 regular gray-700 stage, and on the
// right the ⋯ and + glyphs · 10px · the 268 × 172 cards, 10px apart,
// scrolling inside the column's fixed 850px. The column under the pointer — hovered, or with a card in the air over it —
// takes the file's wash, gray-50 at the head fading to the board by its
// foot. The board is wider than the stage, so it scrolls sideways as a
// board does.
//
// The cards move: pick one up and carry it to another stage, or above or
// below its neighbours. While it is in the air a plain gray-100 slot its
// own size opens where it would land — anywhere over the column, its head
// included — the card stays where it was, dimmed, and nothing else on the
// board changes: no wash on the columns, no shuffle. Dropping it on the
// slot moves it; dropping anywhere else puts it back.
//
// Nothing jumps: the slot fades in where it opens, and whenever it opens,
// moves or closes the cards it displaces slide to their new places over
// 220ms; the dropped card settles in with a fade. The slot's place under
// the pointer is read off the layout, not off cards mid-slide, so it
// never flickers.
import { computed, nextTick, onMounted, ref, watch } from 'vue'
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
// it, past the last card's middle means the end. The card in the air still
// stands in its place, so the index counts it like any other. The cards'
// places come from the layout (offsetTop), which a card sliding under a
// transform has already left: read off the slide, the slot would chase it.
function hover(e: DragEvent, column: number) {
  if (!dragging.value) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  const section = e.currentTarget as HTMLElement
  const list = lists.get(column)
  const base = section.getBoundingClientRect().top - (list?.scrollTop ?? 0)
  const cards = [...section.querySelectorAll<HTMLElement>('[data-card]')]
  let index = cards.length
  for (let i = 0; i < cards.length; i++) {
    const top = base + cards[i].offsetTop
    if (e.clientY < top + cards[i].offsetHeight / 2) {
      index = i
      break
    }
  }
  if (over.value?.column !== column || over.value.index !== index)
    over.value = { column, index }
}

// Leaving a column: every element entered inside it fires its own enter
// and leave, and Chrome's leave often names no element it went to, so
// the column counts enters against leaves and is left at nought
const depth = new Map<number, number>()
function enter(e: DragEvent, column: number) {
  if (!dragging.value) return
  e.preventDefault()
  depth.set(column, (depth.get(column) ?? 0) + 1)
}
function leave(column: number) {
  if (!dragging.value) return
  const d = Math.max(0, (depth.get(column) ?? 1) - 1)
  depth.set(column, d)
  if (d === 0 && over.value?.column === column) over.value = null
}

function drop(e: DragEvent, column: number) {
  e.preventDefault()
  if (!dragging.value || !over.value) return settle()
  const from = columns.value[dragging.value.from]
  const at = from.cards.findIndex((c) => c.id === dragging.value!.id)
  let index = over.value.index
  // within its own column the card counted itself in the index
  if (column === dragging.value.from && at < index) index -= 1
  const [card] = from.cards.splice(at, 1)
  columns.value[column].cards.splice(index, 0, card)
  settle()
}

function settle() {
  dragging.value = null
  over.value = null
  depth.clear()
}

// ---- the lists' edges: where there is more to scroll, the cards fade out
// under the head or into the foot rather than being cut flat
const lists = new Map<number, HTMLElement>()
const fades = ref(columns.value.map(() => ({ top: false, bottom: false })))

function bindList(ci: number, el: unknown) {
  // the list is a TransitionGroup: its element is the instance's $el
  const dom =
    el && typeof el === 'object' && '$el' in el
      ? (el as { $el: unknown }).$el
      : el
  if (dom instanceof HTMLElement) lists.set(ci, dom)
  else lists.delete(ci)
}

function measureFade(ci: number) {
  const el = lists.get(ci)
  if (!el) return
  const top = el.scrollTop > 0
  const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1
  const f = fades.value[ci]
  if (f.top !== top || f.bottom !== bottom) fades.value[ci] = { top, bottom }
}

function measureFades() {
  columns.value.forEach((_, ci) => measureFade(ci))
}

onMounted(() => nextTick(measureFades))

// each column's cards with the open slot in place, as the list draws them
const laid = computed(() =>
  columns.value.map((col, ci) => {
    const rows: ({ kind: 'card'; card: Card } | { kind: 'slot' })[] =
      col.cards.map((card) => ({ kind: 'card' as const, card }))
    if (over.value?.column === ci)
      rows.splice(over.value.index, 0, { kind: 'slot' })
    return rows
  }),
)
watch(laid, () => nextTick(measureFades), { flush: 'post' })
</script>

<template>
  <div class="v2-scroll w-full overflow-x-auto">
    <div
      class="flex w-max"
      :class="dragging && 'is-dragging'"
      role="list"
      aria-label="Deals by stage"
    >
      <!-- the whole column takes the drop, its head included, so the slot
           never blinks out while the card crosses the head row -->
      <section
        v-for="(stage, ci) in columns"
        :key="stage.name"
        class="kanban-column relative isolate flex h-[850px] w-[284px] shrink-0 flex-col gap-2.5 rounded-7 p-2"
        role="listitem"
        :aria-label="stage.name"
        @dragenter="enter($event, ci)"
        @dragover="hover($event, ci)"
        @dragleave="leave(ci)"
        @drop="drop($event, ci)"
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
        <!-- the list scrolls inside the column's 850px, and takes the drop
             across its whole height, an empty stage included. A scrolling
             box clips at its edges, so it reaches into the column's padding
             and pads itself back — the cards sit where they did, and their
             shadows have room on every side. -->
        <!-- a TransitionGroup: the cards slide to their places when the
             slot opens, moves or closes, and a card lands with a fade -->
        <TransitionGroup
          :ref="(el) => bindList(ci, el)"
          tag="div"
          name="kanban"
          class="kanban-list v2-scroll -mx-2 -my-1 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-2 py-1"
          :style="{
            '--fade-top': fades[ci].top ? '24px' : '0px',
            '--fade-bottom': fades[ci].bottom ? '24px' : '0px',
          }"
          @scroll.passive="measureFade(ci)"
        >
          <div
            v-for="row in laid[ci]"
            :key="row.kind === 'card' ? row.card.id : 'slot'"
            :data-card="row.kind === 'card' ? row.card.id : undefined"
            :draggable="row.kind === 'card'"
            :class="
              row.kind === 'card'
                ? [
                    'cursor-grab transition-opacity duration-150 active:cursor-grabbing',
                    dragging?.id === row.card.id && 'opacity-40',
                  ]
                : 'kanban-slot h-[172px] w-[268px] rounded-7 bg-surface-gray-2'
            "
            :aria-hidden="row.kind === 'slot' || undefined"
            @dragstart="row.kind === 'card' && lift($event, row.card, ci)"
            @dragend="settle"
          >
            <DealCard
              v-if="row.kind === 'card'"
              :deal="row.card"
              :photo="row.card.photo"
            />
          </div>
        </TransitionGroup>
      </section>
    </div>
  </div>
</template>

<style>
/* Where a list has more above or below, its edge fades over 24px instead
   of cutting the cards flat. A mask, so the fade needs no colour of its
   own and works over the column's wash. */
.kanban-list {
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade-top, 0px),
    #000 calc(100% - var(--fade-bottom, 0px)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade-top, 0px),
    #000 calc(100% - var(--fade-bottom, 0px)),
    transparent 100%
  );
}
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
.kanban-column:hover::before {
  opacity: 1;
}
/* with a card in the air, no column washes: only the card shows a state */
.is-dragging .kanban-column::before {
  opacity: 0;
}
/* the slides: a card or the slot moving to a new place takes 220ms on
   the file's ease; a card landing, or the slot opening, fades in over
   it. A row leaving goes at once, so the rows behind it slide, not jump */
.kanban-move,
.kanban-enter-active {
  transition:
    transform 220ms cubic-bezier(0.2, 0, 0, 1),
    opacity 220ms cubic-bezier(0.2, 0, 0, 1);
}
.kanban-enter-from {
  opacity: 0;
}
.kanban-enter-from[data-card] {
  transform: scale(0.97);
}
.kanban-leave-active {
  position: absolute;
  visibility: hidden;
  transition: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .kanban-move,
  .kanban-enter-active {
    transition: none;
  }
}
/* the card in the air: tilted a touch, under the md shadow */
.kanban-ghost {
  position: fixed;
  top: -1000px;
  left: -1000px;
  transform: rotate(-2deg);
  opacity: 1 !important;
}
.kanban-ghost article {
  @apply shadow-md;
}
.kanban-glyph {
  @apply flex size-4 items-center justify-center rounded-2 transition-colors hover:text-ink-gray-9;
}
</style>
