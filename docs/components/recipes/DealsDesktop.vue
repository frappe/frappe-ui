<script setup>
import { reactive, ref, onBeforeUnmount, useTemplateRef } from 'vue'
import {
  Badge,
  Button,
  DesktopShell,
  PageHeader,
  PageHeaderTitle,
  ScrollArea,
  Sidebar,
  SidebarCollapseToggle,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  TabButtons,
} from 'frappe-ui'
import DealCard from './DealCard.vue'

const nav = [
  { label: 'Notifications', icon: 'lucide-inbox', count: 4 },
  { label: 'Leads', icon: 'lucide-users' },
  { label: 'Deals', icon: 'lucide-handshake' },
  { label: 'Contacts', icon: 'lucide-contact' },
  { label: 'Organizations', icon: 'lucide-building-2' },
  { label: 'Notes', icon: 'lucide-notebook-pen' },
  { label: 'Tasks', icon: 'lucide-list-todo' },
]
const activeNav = ref('Deals')
const view = ref('Board')

const owners = {
  evan: {
    name: 'Evan You',
    title: 'Account Executive',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
    deals: 8,
  },
  priya: {
    name: 'Priya Nair',
    title: 'Sales Manager',
    image: 'https://i.pravatar.cc/150?img=5',
    deals: 12,
  },
  sam: {
    name: 'Sam Rivera',
    title: 'Account Executive',
    image: 'https://i.pravatar.cc/150?img=12',
    deals: 5,
  },
  ana: {
    name: 'Ana Costa',
    title: 'SDR',
    image: 'https://i.pravatar.cc/150?img=9',
    deals: 9,
  },
}

const logo = (org) =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(org)}`

const statusDot = {
  gray: 'bg-surface-gray-7',
  amber: 'bg-surface-amber-7',
  blue: 'bg-surface-blue-7',
  green: 'bg-surface-green-7',
}

const columns = ref([
  {
    status: 'Qualification',
    theme: 'gray',
    deals: [
      {
        org: 'Globex',
        value: '$ 45,000',
        owner: 'priya',
        due: 'Jul 18',
        tag: 'Inbound',
      },
      {
        org: 'Stark Industries',
        value: '$ 1,10,000',
        owner: 'ana',
        due: 'Jul 22',
        tag: 'Referral',
      },
      {
        org: 'Wayne Corp',
        value: '$ 32,000',
        owner: 'sam',
        due: 'Aug 2',
        tag: 'Outbound',
      },
      {
        org: 'Cyberdyne',
        value: '$ 76,000',
        owner: 'evan',
        due: 'Aug 9',
        tag: 'Outbound',
      },
      {
        org: 'Vandelay',
        value: '$ 28,500',
        owner: 'priya',
        due: 'Aug 14',
        tag: 'Inbound',
      },
    ],
  },
  {
    status: 'Negotiation',
    theme: 'amber',
    deals: [
      {
        org: 'Acme Corp',
        value: '$ 1,20,000',
        owner: 'evan',
        due: 'Jul 12',
        tag: 'Inbound',
      },
      {
        org: 'Umbrella Labs',
        value: '$ 88,000',
        owner: 'ana',
        due: 'Jul 15',
        tag: 'Partner',
      },
      {
        org: 'Wonka Industries',
        value: '$ 54,000',
        owner: 'sam',
        due: 'Jul 21',
        tag: 'Outbound',
      },
      {
        org: 'Duff Co',
        value: '$ 39,000',
        owner: 'priya',
        due: 'Jul 25',
        tag: 'Referral',
      },
    ],
  },
  {
    status: 'Ready to Close',
    theme: 'blue',
    deals: [
      {
        org: 'Hooli',
        value: '$ 2,05,000',
        owner: 'evan',
        due: 'Jul 9',
        tag: 'Expansion',
      },
      {
        org: 'Pied Piper',
        value: '$ 64,000',
        owner: 'priya',
        due: 'Jul 11',
        tag: 'Inbound',
      },
      {
        org: 'Massive Dynamic',
        value: '$ 1,75,000',
        owner: 'ana',
        due: 'Jul 14',
        tag: 'Partner',
      },
    ],
  },
  {
    status: 'Won',
    theme: 'green',
    deals: [
      {
        org: 'Initech',
        value: '$ 2,40,000',
        owner: 'sam',
        due: 'Closed Jul 1',
        tag: 'Renewal',
      },
      {
        org: 'Soylent Corp',
        value: '$ 96,000',
        owner: 'evan',
        due: 'Closed Jun 28',
        tag: 'Expansion',
      },
      {
        org: 'Tyrell Corp',
        value: '$ 1,32,000',
        owner: 'priya',
        due: 'Closed Jun 20',
        tag: 'Referral',
      },
    ],
  },
])

/* -- Drag and drop (pointer events) ---------------------------------------
   A mouse lifts a card after 4px of movement; a touch lifts after holding
   still for 250ms (drifting earlier stays a native scroll).

   The dragged deal NEVER leaves the data model — once lifted it's rendered as
   an empty slot in place while a ghost follows the pointer. Dragging live-
   reorders the deal into the slot under the pointer, so the *same* element
   glides (FLIP) instead of a placeholder fading in and out. Dropping only
   stops the drag; the deal is already where it belongs, so releasing it in the
   same spot animates nothing. */

const LIFT_DELAY = 250 // ms a touch must hold still before it becomes a drag
const DRIFT_TOLERANCE = 8 // px a held touch may drift before we call it a scroll
const MOUSE_THRESHOLD = 4 // px a mouse must move before the drag starts
const EDGE = 48 // px-wide edge zones that trigger auto-scroll
const SETTLE_MS = 150 // ms the ghost glides onto the slot on release

const boardRef = useTemplateRef('boardRef')
const columnRefs = [] // per-column ScrollArea instances, indexed by column
const boardEl = () => boardRef.value
const columnEl = (col) => columnRefs[col]?.viewportElement

const pointer = { x: 0, y: 0 }
let pending = null // pointerdown that may still become a drag
let rafId = 0
let settleTimer = 0 // the release "settle" animation timer

const drag = reactive({
  active: false,
  settling: false, // release animation: ghost gliding onto its slot
  deal: null, // the deal being dragged — stays inside `columns` the whole time
  from: null, // { col, index } — restore point if the drag is cancelled
  overCol: 0, // column under the pointer, drives vertical auto-scroll
  width: 0,
  height: 0,
  offsetX: 0,
  offsetY: 0,
  x: 0,
  y: 0,
})

// Where the dragged deal currently sits in the data model.
function locate() {
  for (let col = 0; col < columns.value.length; col++) {
    const index = columns.value[col].deals.indexOf(drag.deal)
    if (index !== -1) return { col, index }
  }
  return null
}

function onCardPointerDown(event, col, deal) {
  if (drag.active || pending) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  // Grabbing a control inside the card (dropdown, owner hover card) is a
  // click, not a drag.
  if (event.target.closest('button')) return
  pointer.x = event.clientX
  pointer.y = event.clientY
  const mouse = event.pointerType === 'mouse'
  pending = {
    col,
    deal,
    el: event.currentTarget,
    startX: event.clientX,
    startY: event.clientY,
    mouse,
    timer: mouse ? 0 : window.setTimeout(lift, LIFT_DELAY),
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

function lift() {
  const { col, deal, el, timer } = pending
  clearTimeout(timer)
  pending = null
  const rect = el.getBoundingClientRect()
  drag.deal = deal
  drag.from = { col, index: columns.value[col].deals.indexOf(deal) }
  drag.overCol = col
  drag.width = rect.width
  drag.height = rect.height
  drag.offsetX = pointer.x - rect.left
  drag.offsetY = pointer.y - rect.top
  drag.x = rect.left
  drag.y = rect.top
  drag.active = true
  // The gesture is ours now: a passive:false touchmove listener is the only
  // way to stop the browser from starting a scroll (which would fire
  // pointercancel and kill the drag).
  window.addEventListener('touchmove', preventScroll, { passive: false })
  navigator.vibrate?.(10)
  rafId = requestAnimationFrame(tick)
}

function onPointerMove(event) {
  pointer.x = event.clientX
  pointer.y = event.clientY
  if (!pending) return
  const drift = Math.hypot(
    event.clientX - pending.startX,
    event.clientY - pending.startY,
  )
  if (pending.mouse) {
    if (drift > MOUSE_THRESHOLD) lift()
  } else if (drift > DRIFT_TOLERANCE) {
    cancelPending() // the finger is scrolling, not holding
  }
}

// Runs every frame while dragging — pointermove alone isn't enough because a
// pointer held still at an edge keeps auto-scrolling, moving the containers
// (and slots) under it.
function tick() {
  drag.x = pointer.x - drag.offsetX
  drag.y = pointer.y - drag.offsetY
  autoscroll()
  updateDropSlot()
  rafId = requestAnimationFrame(tick)
}

// Move the dragged deal into the slot the pointer is over. The insertion index
// is counted over the OTHER cards only (the dragged slot is skipped), which
// makes it a no-op when nothing changed and self-stabilising otherwise:
// inserting pushes the boundary card away from the pointer, so the choice never
// oscillates between two neighbours.
function updateDropSlot() {
  for (let col = 0; col < columns.value.length; col++) {
    const el = columnEl(col)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (pointer.x < rect.left || pointer.x > rect.right) continue
    drag.overCol = col
    let index = 0
    for (const card of el.querySelectorAll(
      '[data-deal-card]:not([data-dragging])',
    )) {
      const r = card.getBoundingClientRect()
      if (pointer.y > r.top + r.height / 2) index++
    }
    moveDealTo(col, index)
    return
  }
  // Pointer is in a gap between columns: leave the deal where it is.
}

function moveDealTo(col, index) {
  const cur = locate()
  if (!cur || (cur.col === col && cur.index === index)) return
  columns.value[cur.col].deals.splice(cur.index, 1)
  columns.value[col].deals.splice(index, 0, drag.deal)
}

function autoscroll() {
  const scrollSpeed = (overshoot) =>
    Math.ceil((Math.min(overshoot, EDGE) / EDGE) * 14)
  const b = boardEl()
  if (b) {
    const r = b.getBoundingClientRect()
    if (pointer.x < r.left + EDGE)
      b.scrollLeft -= scrollSpeed(r.left + EDGE - pointer.x)
    else if (pointer.x > r.right - EDGE)
      b.scrollLeft += scrollSpeed(pointer.x - (r.right - EDGE))
  }
  const colEl = columnEl(drag.overCol)
  if (colEl) {
    const r = colEl.getBoundingClientRect()
    if (pointer.y < r.top + EDGE)
      colEl.scrollTop -= scrollSpeed(r.top + EDGE - pointer.y)
    else if (pointer.y > r.bottom - EDGE)
      colEl.scrollTop += scrollSpeed(pointer.y - (r.bottom - EDGE))
  }
}

// Land the ghost on the slot, then reveal the real card. The slot is the same
// element that has held the deal's place all along, so revealing it just swaps
// dashed → card with no enter animation and nothing else moves.
function onPointerUp() {
  if (pending) return cancelPending()
  if (!drag.active || drag.settling) return
  cancelAnimationFrame(rafId)
  removeGestureListeners()
  const slot = document.querySelector('[data-dragging]')
  if (!slot) return endDrag()
  const rect = slot.getBoundingClientRect()
  drag.settling = true
  drag.x = rect.left
  drag.y = rect.top
  settleTimer = window.setTimeout(endDrag, SETTLE_MS)
}

function onPointerCancel() {
  if (pending) return cancelPending()
  if (!drag.active) return
  const cur = locate()
  if (cur && (cur.col !== drag.from.col || cur.index !== drag.from.index)) {
    columns.value[cur.col].deals.splice(cur.index, 1)
    columns.value[drag.from.col].deals.splice(drag.from.index, 0, drag.deal)
  }
  endDrag()
}

function cancelPending() {
  clearTimeout(pending?.timer)
  pending = null
  removeGestureListeners()
}

function endDrag() {
  cancelAnimationFrame(rafId)
  clearTimeout(settleTimer)
  removeGestureListeners()
  drag.active = false
  drag.settling = false
  drag.deal = null
  drag.from = null
}

function removeGestureListeners() {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
  window.removeEventListener('touchmove', preventScroll)
}

function preventScroll(event) {
  event.preventDefault()
}

onBeforeUnmount(() => {
  clearTimeout(pending?.timer)
  clearTimeout(settleTimer)
  cancelAnimationFrame(rafId)
  removeGestureListeners()
})
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell :scroll="false">
      <template #sidebar>
        <Sidebar width="14rem" class="border-r">
          <SidebarHeader
            title="Deals"
            subtitle="brightloom.frappe.cloud"
            logo="https://api.dicebear.com/10.x/disco/svg?seed=Brightloom"
            :menu-items="[
              { label: 'Switch team', icon: 'lucide-arrow-left-right' },
              { label: 'Log out', icon: 'lucide-log-out' },
            ]"
          />

          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <nav class="space-y-0.5">
              <SidebarItem
                v-for="item in nav"
                :key="item.label"
                :active="activeNav === item.label"
                @click="activeNav = item.label"
              >
                <template #prefix>
                  <span :class="item.icon" class="size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">{{ item.label }}</span>
                <template #suffix>
                  <Badge
                    v-if="item.count"
                    variant="ghost"
                    :label="String(item.count)"
                  />
                </template>
              </SidebarItem>
            </nav>

            <div class="mt-4 flex h-7 items-center">
              <SidebarLabel>Pinned views</SidebarLabel>
            </div>
            <nav class="mt-0.5 space-y-0.5">
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-star size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">My open deals</span>
              </SidebarItem>
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-star size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">Closing this month</span>
              </SidebarItem>
            </nav>
          </ScrollArea>

          <div class="mt-auto px-2 pb-2">
            <SidebarCollapseToggle />
          </div>
        </Sidebar>
      </template>

      <PageHeader>
        <PageHeaderTitle title="Deals" />
        <div class="flex items-center gap-2">
          <TabButtons
            v-model="view"
            :options="[{ label: 'Board' }, { label: 'List' }]"
          />
          <Button label="Filter" icon-left="lucide-list-filter" />
          <Button label="Sort" icon-left="lucide-arrow-down-up" />
          <Button variant="solid" label="New deal" icon-left="lucide-plus" />
        </div>
      </PageHeader>

      <!-- DesktopShell `:scroll="false"` makes the content area fill the height
           below the header without page-scrolling. The board itself owns
           horizontal overflow while each column owns vertical overflow. -->
      <div
        ref="boardRef"
        class="min-h-0 flex-1 overflow-x-auto overflow-y-hidden"
      >
        <div class="flex h-full select-none gap-3 p-4">
          <div
            v-for="(column, ci) in columns"
            :key="column.status"
            class="flex min-h-0 w-72 shrink-0 flex-col rounded-lg bg-surface-gray-1 dark:bg-transparent dark:border"
          >
            <div class="flex items-center justify-between pl-3 pr-1 pt-1">
              <div class="flex items-center gap-2">
                <span
                  class="size-2 rounded-full"
                  :class="statusDot[column.theme]"
                  aria-hidden="true"
                />
                <span class="text-sm font-medium text-ink-gray-8">
                  {{ column.status }}
                </span>
                <span class="text-sm text-ink-gray-5">
                  {{ column.deals.length }}
                </span>
              </div>
              <Button variant="ghost" icon="lucide-plus" label="Add deal" />
            </div>

            <!-- The card list carries its own padding (instead of the column)
                 so card shadows aren't clipped by the viewport's edge. -->
            <ScrollArea
              :ref="(r) => (columnRefs[ci] = r)"
              class="min-h-0 flex-1"
            >
              <TransitionGroup
                name="deals"
                tag="div"
                class="flex flex-col gap-2 p-2"
              >
                <div
                  v-for="deal in column.deals"
                  :key="deal.org"
                  class="shrink-0"
                  data-deal-card
                  :data-dragging="deal === drag.deal ? '' : null"
                  @pointerdown="onCardPointerDown($event, ci, deal)"
                  @dragstart.prevent
                  @contextmenu="drag.active && $event.preventDefault()"
                >
                  <!-- The dragged card leaves an empty slot in place; the ghost
                       carries its content while it's lifted. -->
                  <div
                    v-if="deal === drag.deal"
                    class="rounded-lg border-2 border-dashed border-outline-gray-2 bg-surface-gray-2"
                    :style="{ height: drag.height + 'px' }"
                  />
                  <div
                    v-else
                    class="group cursor-grab rounded-lg border bg-surface-elevation-1 p-3 transition hover:shadow-sm"
                  >
                    <DealCard :deal="deal" :owners="owners" :logo="logo" />
                  </div>
                </div>
              </TransitionGroup>
            </ScrollArea>
          </div>
        </div>
      </div>
    </DesktopShell>

    <!-- The lifted card: a fixed-position ghost that tracks the pointer. It
         ignores pointer events so hit-testing sees the board beneath it. -->
    <Teleport to="body">
      <div
        v-if="drag.active"
        class="pointer-events-none fixed left-0 top-0 z-50 will-change-transform"
        :class="
          drag.settling ? 'transition-transform duration-150 ease-out' : ''
        "
        :style="{
          width: drag.width + 'px',
          transform: `translate(${drag.x}px, ${drag.y}px)`,
        }"
      >
        <div
          class="drag-ghost rounded-lg border bg-surface-elevation-1 p-3 transition-[transform,box-shadow] duration-150 ease-out"
          :class="drag.settling ? '' : 'rotate-2 scale-[1.02] shadow-xl'"
        >
          <DealCard :deal="drag.deal" :owners="owners" :logo="logo" ghost />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* The only in-list motion is FLIP: as the dragged deal is reordered, the slot
   and the cards around it slide to their new positions. The lifted ghost pops
   up on grab. No enter/leave — the dragged card never leaves the list, so
   there's nothing to fade in or out. */
.deals-move {
  transition: transform 0.2s ease;
}
.drag-ghost {
  animation: drag-lift 0.15s ease-out;
}
@keyframes drag-lift {
  from {
    transform: none;
    box-shadow: none;
  }
}
</style>
