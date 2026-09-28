<script setup lang="ts">
// The Notification page, in the Toast page's shape: a controller in the
// middle of the stage, and the notifications it fires dropping in at the
// stage's top-right corner the way a Mac shows them — each slides in from
// the right edge and takes the front, and after a while slides back out.
//
// More than one and they pile up as a Mac piles them: the newest in front,
// the earlier ones peeking out beneath it, two deep, each a step lower and
// a touch smaller. Hovering the pile fans it out into the full list, top to
// bottom, and holds every card while the pointer is there; leaving folds
// it back and lets their time run on. A tap on the pile fans it out too.
// A close, or any of a card's buttons, sends that card away at once.
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { Button, Switch } from '../../../src'
import NotificationCard, {
  type NotificationSpec,
  type NotificationType,
} from './NotificationCard.vue'

const TYPES: { value: NotificationType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'avatar', label: 'Avatar' },
  { value: 'banner', label: 'Banner' },
  { value: 'compact', label: 'Compact' },
]

const withIcon = ref(true)
const withClose = ref(true)
const withActions = ref(true)
const stackedButtons = ref(false)
const piling = ref(true)

// how long a notification stays, and how many stack up before the oldest
// gives way
const STAY = 6000
const MAX = 5
// the pile: how many peek out behind the front card, how far each steps
// down and how much smaller it draws
const PEEK = 2
const STEP = 7
const SHRINK = 0.05
const GAP = 12

interface Shown {
  id: number
  spec: NotificationSpec
  timer?: number
  /** when the stay runs out, in ms; kept while held so it can resume */
  due: number
  left: number
  /** the card's own size, measured once it is in the page */
  w: number
  h: number
}
const shown = ref<Shown[]>([])
let seq = 0

function schedule(item: Shown, ms: number) {
  item.due = Date.now() + ms
  item.timer = window.setTimeout(() => dismiss(item.id), ms)
}

function fire(type: NotificationType) {
  const item: Shown = {
    id: ++seq,
    spec: {
      type,
      icon: withIcon.value,
      close: withClose.value,
      actions: withActions.value,
      stacked: stackedButtons.value,
    },
    due: 0,
    left: STAY,
    w: 0,
    h: 0,
  }
  // the newest takes the front; past the limit, the oldest leaves
  shown.value = [item, ...shown.value]
  for (const old of shown.value.splice(MAX)) clearTimeout(old.timer)
  if (!holding.value) schedule(item, STAY)
}

function dismiss(id: number) {
  const item = shown.value.find((s) => s.id === id)
  if (!item) return
  clearTimeout(item.timer)
  shown.value = shown.value.filter((s) => s.id !== id)
}

// ---- the pile, and fanning it out
const hovered = ref(false)
const tapped = ref(false)
// the pointer on the pile, or a tap on it, fans it out and holds every
// card; with piling off the list is always fanned out but only a hover
// holds it
const holding = computed(
  () => hovered.value || (tapped.value && shown.value.length > 1),
)
const fanned = computed(() => !piling.value || holding.value)
watch(holding, (open) => {
  for (const item of shown.value) {
    if (open) {
      clearTimeout(item.timer)
      item.left = Math.max(800, item.due - Date.now())
    } else {
      schedule(item, item.left)
    }
  }
})
watch(
  () => shown.value.length,
  (n) => {
    if (n < 2) tapped.value = false
  },
)

// Each card's body, so it can be measured once the DOM has laid it out —
// a ref callback fires before that, and would read zero. `offsetWidth` is
// the laid-out size: the slot's scale never reaches it.
const bodies = new Map<number, HTMLElement>()
function bindBody(item: Shown, el: unknown) {
  if (el instanceof HTMLElement) bodies.set(item.id, el)
  else bodies.delete(item.id)
}
function measureAll() {
  for (const item of shown.value) {
    const el = bodies.get(item.id)
    if (!el) continue
    const w = el.offsetWidth
    const h = el.offsetHeight
    if (w && (w !== item.w || h !== item.h)) {
      item.w = w
      item.h = h
    }
  }
}
watch(
  () => shown.value.map((s) => s.id).join(),
  async () => {
    await nextTick()
    measureAll()
    // a second look once the frame has painted, for anything late
    requestAnimationFrame(measureAll)
  },
  { flush: 'post' },
)

const front = computed(() => shown.value[0])

// Every card sits at the corner and is placed by a transform, so folding
// and fanning out are one transition. Fanned: each below the last, 12px
// apart, at its own size. Folded: the front card as it is, the rest behind
// it at its size, each a step lower and a touch smaller, and past PEEK
// hidden. They shrink from their bottom edge, so the step below the front
// card stays a full step whatever the card's height — scaled from the top,
// a tall card's shrink would swallow it.
function slotStyle(item: Shown, i: number) {
  if (fanned.value) {
    let y = 0
    for (let k = 0; k < i; k++) y += shown.value[k].h + GAP
    return {
      width: `${item.w}px`,
      height: `${item.h}px`,
      transform: `translateY(${y}px)`,
      opacity: 1,
    }
  }
  const f = front.value
  const depth = Math.min(i, PEEK)
  return {
    width: `${f.w}px`,
    height: `${f.h}px`,
    transform: `translateY(${depth * STEP}px) scale(${1 - depth * SHRINK})`,
    opacity: i > PEEK ? 0 : 1,
  }
}

// the room the pile takes, so it can be hovered edge to edge
const pileSize = computed(() => {
  if (!shown.value.length) return { width: '0px', height: '0px' }
  if (fanned.value) {
    const w = Math.max(...shown.value.map((s) => s.w))
    const h =
      shown.value.reduce((t, s) => t + s.h, 0) + GAP * (shown.value.length - 1)
    return { width: `${w}px`, height: `${h}px` }
  }
  const f = front.value
  return {
    width: `${f.w}px`,
    height: `${f.h + Math.min(shown.value.length - 1, PEEK) * STEP}px`,
  }
})

onUnmounted(() => shown.value.forEach((s) => clearTimeout(s.timer)))
</script>

<template>
  <div class="relative h-full">
    <div class="absolute inset-0 flex items-center justify-center px-5 py-20">
      <!-- the controller -->
      <div
        class="flex w-[360px] flex-col gap-4 rounded-6 border border-outline-gray-1 bg-surface-elevation-2 p-4 dark:border-outline-gray-2 dark:bg-surface-elevation-1"
      >
        <div class="flex flex-col gap-1">
          <p class="text-lg-medium text-ink-gray-8">Notification</p>
          <p class="text-p-sm text-ink-gray-5">
            Fire a type and it drops in at the top-right corner.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Switch
            v-model="withIcon"
            size="sm"
            label="Icon"
            description="An alert glyph before the title"
          />
          <Switch
            v-model="withClose"
            size="sm"
            label="Close"
            description="A × in the corner"
          />
          <Switch
            v-model="withActions"
            size="sm"
            label="Actions"
            description="Buttons under the text"
          />
          <Switch
            v-model="stackedButtons"
            size="sm"
            label="Stacked"
            description="Compact's two buttons one above the other"
          />
          <Switch
            v-model="piling"
            size="sm"
            label="Stack"
            description="Pile up like a Mac; hover to fan out"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            v-for="t in TYPES"
            :key="t.value"
            :variant="t.value === 'default' ? 'solid' : 'subtle'"
            size="sm"
            @click="fire(t.value)"
          >
            {{ t.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- the pile, pinned to the stage's top-right corner. The stage clips,
         so a card enters from beyond its right edge. Every card sits at the
         corner; its slot's transform is where it shows. -->
    <TransitionGroup
      tag="div"
      name="v2-notif"
      class="v2-notif-pile pointer-events-none absolute right-5 top-5"
      :class="{ 'is-fanned': fanned }"
      :style="pileSize"
      aria-live="polite"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <div
        v-for="(item, i) in shown"
        :key="item.id"
        class="pointer-events-auto absolute right-0 top-0"
        :style="{ zIndex: 100 - i }"
      >
        <div
          class="v2-notif-slot origin-bottom"
          :class="{ 'is-behind': !fanned && i > 0 }"
          :style="slotStyle(item, i)"
          @click="tapped = !fanned"
        >
          <div
            :ref="(el) => bindBody(item, el)"
            class="v2-notif-body w-max transition-opacity duration-200"
            :class="!fanned && i > 0 ? 'opacity-0' : 'opacity-100'"
          >
            <NotificationCard :spec="item.spec" @dismiss="dismiss(item.id)" />
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
/* The slot places a card: a long ease-out carries it between the pile and
   the fanned-out list. Behind the front card it is a silhouette — the
   card's own surface, shadow and corner, its content faded — cut to the
   front card's size. */
.v2-notif-slot {
  transition:
    transform 340ms cubic-bezier(0.32, 0.72, 0, 1),
    width 340ms cubic-bezier(0.32, 0.72, 0, 1),
    height 340ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 220ms ease-out;
}
.v2-notif-slot.is-behind {
  @apply overflow-hidden rounded-6 bg-surface-elevation-1 shadow-md;
}
/* the pile itself takes the pointer only where a card is */
.v2-notif-pile {
  transition:
    width 340ms cubic-bezier(0.32, 0.72, 0, 1),
    height 340ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* In from the right edge on a long ease-out; out the same way. The slot's
   own transform is untouched — the ride in is on the card's outer box. */
.v2-notif-enter-active {
  transition:
    transform 440ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 220ms ease-out;
}
.v2-notif-leave-active {
  transition:
    transform 300ms cubic-bezier(0.4, 0, 1, 1),
    opacity 220ms ease-in;
}
.v2-notif-enter-from,
.v2-notif-leave-to {
  opacity: 0;
  transform: translateX(calc(100% + 40px));
}
@media (prefers-reduced-motion: reduce) {
  .v2-notif-slot,
  .v2-notif-pile,
  .v2-notif-enter-active,
  .v2-notif-leave-active {
    transition-duration: 1ms;
  }
}
</style>
