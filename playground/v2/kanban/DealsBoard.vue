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
// The cards move: press one and carry it to another stage, or above or
// below its neighbours. It lifts off the board — tilted a touch, under a
// deeper shadow — and rides the pointer; where it was, and wherever it
// would land, a plain gray-100 slot its own size stands open, and the
// cards around it slide aside over 220ms. Let go and the card glides into
// the slot; let go off the board, or press Escape, and it glides home.
// Near a column's top or foot, or the board's sides, the lists scroll.
//
// The drag is the pointer's own rather than the browser's drag and drop:
// that one carries a still picture of the card, cannot be tilted or eased,
// and snaps back on a missed drop. The slot's place under the pointer is
// read off the layout, not off cards mid-slide, so it never flickers.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
// the card in the air: where it is drawn, and whether it is lifted (tilted)
// or landing (gliding into its slot)
const air = ref<{
  card: Card
  x: number
  y: number
  w: number
  h: number
  lifted: boolean
  landing: boolean
} | null>(null)
// the card that has just landed takes its place without a fade
const landed = ref<string | null>(null)

const board = ref<HTMLElement | null>(null)
const reduced =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches
const LAND_MS = reduced ? 0 : 220

// A press only becomes a drag past 4px, so a click stays a click
let press: {
  card: Card
  column: number
  x: number
  y: number
  dx: number
  dy: number
  rect: DOMRect
} | null = null
let pointer = { x: 0, y: 0 }
let frame = 0

function down(e: PointerEvent, card: Card, column: number) {
  if (e.button !== 0 || air.value) return
  if ((e.target as HTMLElement).closest('button, a, input')) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  press = {
    card,
    column,
    x: e.clientX,
    y: e.clientY,
    dx: e.clientX - rect.left,
    dy: e.clientY - rect.top,
    rect,
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', cancel)
  window.addEventListener('keydown', key)
}

function move(e: PointerEvent) {
  pointer = { x: e.clientX, y: e.clientY }
  if (!press) return
  if (!air.value) {
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < 4) return
    lift()
  }
  if (!air.value || air.value.landing) return
  air.value.x = e.clientX - press.dx
  air.value.y = e.clientY - press.dy
  track()
}

function lift() {
  if (!press) return
  const { card, column, rect } = press
  const at = columns.value[column].cards.indexOf(card)
  dragging.value = { id: card.id, from: column }
  over.value = { column, index: at }
  air.value = {
    card,
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height,
    lifted: false,
    landing: false,
  }
  document.documentElement.classList.add('kanban-grabbing')
  // tilt on the next frame, so it eases in from flat
  requestAnimationFrame(() => {
    if (air.value) air.value.lifted = true
  })
  frame = requestAnimationFrame(scrollLoop)
}

// Where the pointer is: over a column, the slot goes above the first card
// whose middle is below it, or to the end; off the board, it goes home.
// The cards' places come from the layout (offsetTop), which a card
// sliding under a transform has already left.
function track() {
  if (!dragging.value) return
  const { x, y } = pointer
  const b = board.value?.getBoundingClientRect()
  let next: { column: number; index: number }
  if (!b || x < b.left || x > b.right || y < b.top || y > b.bottom) {
    const from = columns.value[dragging.value.from]
    next = {
      column: dragging.value.from,
      index: from.cards.findIndex((c) => c.id === dragging.value!.id),
    }
  } else {
    const section = [
      ...board.value!.querySelectorAll<HTMLElement>('[data-column]'),
    ].find((el) => {
      const r = el.getBoundingClientRect()
      return x >= r.left && x < r.right
    })
    if (!section) return
    const column = Number(section.dataset.column)
    const list = lists.get(column)
    const base = section.getBoundingClientRect().top - (list?.scrollTop ?? 0)
    const cards = [
      ...section.querySelectorAll<HTMLElement>(
        '[data-card]:not(.kanban-leave-active)',
      ),
    ]
    let index = cards.length
    for (let i = 0; i < cards.length; i++) {
      if (y < base + cards[i].offsetTop + cards[i].offsetHeight / 2) {
        index = i
        break
      }
    }
    next = { column, index }
  }
  if (over.value?.column !== next.column || over.value.index !== next.index)
    over.value = next
}

// near a list's top or foot, or the board's sides, scroll toward the edge
function scrollLoop() {
  if (!air.value || air.value.landing) return
  const { x, y } = pointer
  const EDGE = 48
  const speed = (d: number) => Math.ceil(((EDGE - d) / EDGE) * 14)
  let moved = false
  const scroller = board.value?.parentElement
  if (scroller) {
    const r = scroller.getBoundingClientRect()
    if (x - r.left < EDGE && scroller.scrollLeft > 0) {
      scroller.scrollLeft -= speed(x - r.left)
      moved = true
    } else if (r.right - x < EDGE) {
      const before = scroller.scrollLeft
      scroller.scrollLeft += speed(r.right - x)
      moved ||= scroller.scrollLeft !== before
    }
  }
  if (over.value) {
    const list = lists.get(over.value.column)
    if (list) {
      const r = list.getBoundingClientRect()
      const before = list.scrollTop
      if (y - r.top < EDGE && y > r.top - EDGE)
        list.scrollTop -= speed(Math.max(0, y - r.top))
      else if (r.bottom - y < EDGE && y < r.bottom + EDGE)
        list.scrollTop += speed(Math.max(0, r.bottom - y))
      moved ||= list.scrollTop !== before
    }
  }
  if (moved) track()
  frame = requestAnimationFrame(scrollLoop)
}

function up() {
  if (!air.value) return reset()
  land()
}

function cancel() {
  if (!air.value) return reset()
  if (dragging.value) {
    const from = columns.value[dragging.value.from]
    over.value = {
      column: dragging.value.from,
      index: from.cards.findIndex((c) => c.id === dragging.value!.id),
    }
  }
  nextTick(land)
}

function key(e: KeyboardEvent) {
  if (e.key === 'Escape' && air.value && !air.value.landing) cancel()
}

// Glide the card into the slot, then put it there. The slot's place is
// its layout place, where it is going, not where a slide has it now.
function land() {
  const a = air.value
  if (!a || a.landing || !over.value) return
  cancelAnimationFrame(frame)
  const list = lists.get(over.value.column)
  const slot = list?.querySelector<HTMLElement>('.kanban-slot')
  const section = slot?.offsetParent as HTMLElement | null
  if (slot && section) {
    const r = section.getBoundingClientRect()
    a.x = r.left + slot.offsetLeft
    a.y = r.top + slot.offsetTop - (list?.scrollTop ?? 0)
  }
  a.landing = true
  a.lifted = false
  window.setTimeout(commit, LAND_MS)
}

function commit() {
  if (dragging.value && over.value) {
    const from = columns.value[dragging.value.from]
    const at = from.cards.findIndex((c) => c.id === dragging.value!.id)
    const [card] = from.cards.splice(at, 1)
    columns.value[over.value.column].cards.splice(over.value.index, 0, card)
    landed.value = card.id
    window.setTimeout(() => (landed.value = null), 50)
  }
  reset()
}

function reset() {
  press = null
  air.value = null
  dragging.value = null
  over.value = null
  cancelAnimationFrame(frame)
  document.documentElement.classList.remove('kanban-grabbing')
  window.removeEventListener('pointermove', move)
  window.removeEventListener('pointerup', up)
  window.removeEventListener('pointercancel', cancel)
  window.removeEventListener('keydown', key)
}

onBeforeUnmount(reset)

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
    const rows: ({ kind: 'card'; card: Card } | { kind: 'slot' })[] = col.cards
      .filter((card) => card.id !== dragging.value?.id)
      .map((card) => ({ kind: 'card' as const, card }))
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
      ref="board"
      class="flex w-max"
      :class="dragging && 'is-dragging'"
      role="list"
      aria-label="Deals by stage"
    >
      <!-- the whole column takes the card, its head included, so the slot
           never blinks out while the card crosses the head row -->
      <section
        v-for="(stage, ci) in columns"
        :key="stage.name"
        class="kanban-column relative isolate flex h-[850px] w-[284px] shrink-0 flex-col gap-2.5 rounded-7 p-2"
        role="listitem"
        :aria-label="stage.name"
        :data-column="ci"
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
            :class="
              row.kind === 'card'
                ? [
                    'kanban-card cursor-grab touch-none select-none',
                    landed === row.card.id && 'is-landed',
                  ]
                : 'kanban-slot w-[268px] shrink-0 rounded-7 bg-surface-gray-2'
            "
            :style="
              row.kind === 'slot' ? { height: `${air?.h ?? 172}px` } : undefined
            "
            :aria-hidden="row.kind === 'slot' || undefined"
            @pointerdown="row.kind === 'card' && down($event, row.card, ci)"
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
  <!-- the card in the air rides over everything, outside the lists' masks:
       the outer box follows the pointer, the inner one tilts and lifts -->
  <Teleport to="body">
    <div
      v-if="air"
      class="kanban-air"
      :class="air.landing && 'is-landing'"
      :style="{
        width: `${air.w}px`,
        transform: `translate3d(${air.x}px, ${air.y}px, 0)`,
      }"
      aria-hidden="true"
    >
      <div class="kanban-air-tilt" :class="air.lifted && 'is-lifted'">
        <DealCard :deal="air.card" :photo="air.card.photo" />
      </div>
    </div>
  </Teleport>
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
/* the card that has just landed takes the place the glide brought it to */
.kanban-enter-active.is-landed {
  transition: none;
}
.kanban-enter-from.is-landed {
  opacity: 1;
  transform: none;
}
/* the card in the air: it follows the pointer as is, and eases only into
   its slot. Lifted, it tilts a touch and rises under the lg shadow. */
.kanban-air {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  pointer-events: none;
  will-change: transform;
}
.kanban-air.is-landing {
  transition: transform 220ms cubic-bezier(0.2, 0, 0, 1);
}
.kanban-air-tilt {
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
}
.kanban-air-tilt.is-lifted {
  transform: rotate(-2deg) scale(1.02);
}
.kanban-air-tilt article {
  transition: box-shadow 180ms cubic-bezier(0.2, 0, 0, 1);
}
.kanban-air-tilt.is-lifted article {
  @apply shadow-lg;
}
@media (prefers-reduced-motion: reduce) {
  .kanban-air.is-landing,
  .kanban-air-tilt,
  .kanban-air-tilt article {
    transition: none;
  }
}
/* while a card is in the air the whole page shows the closed hand, and
   no text is picked up on the way */
.kanban-grabbing,
.kanban-grabbing * {
  cursor: grabbing !important;
  user-select: none !important;
}
.kanban-glyph {
  @apply flex size-4 items-center justify-center rounded-2 transition-colors hover:text-ink-gray-9;
}
</style>
