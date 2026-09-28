<script setup lang="ts">
// The Notification page, in the Toast page's shape: a controller in the
// middle of the stage, and the notifications it fires dropping in at the
// stage's top-right corner the way a Mac shows them — each slides in from
// the right edge and takes the top, the earlier ones move down beneath it,
// and after a while it slides back out. Hovering one holds it; its close or
// any of its buttons sends it away at once.
import { onUnmounted, ref } from 'vue'
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
const stacked = ref(false)

// how long a notification stays, and how many stack up before the oldest
// gives way
const STAY = 6000
const MAX = 5

interface Shown {
  id: number
  spec: NotificationSpec
  timer?: number
  /** when the stay runs out, in ms; kept while hovered so it can resume */
  due: number
  left: number
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
      stacked: stacked.value,
    },
    due: 0,
    left: STAY,
  }
  // the newest takes the top; past the limit, the oldest leaves
  shown.value = [item, ...shown.value]
  for (const old of shown.value.splice(MAX)) clearTimeout(old.timer)
  schedule(item, STAY)
}

function dismiss(id: number) {
  const item = shown.value.find((s) => s.id === id)
  if (!item) return
  clearTimeout(item.timer)
  shown.value = shown.value.filter((s) => s.id !== id)
}

// hovering holds the notification; leaving lets the rest of its stay run
function hold(item: Shown) {
  clearTimeout(item.timer)
  item.left = Math.max(800, item.due - Date.now())
}
function release(item: Shown) {
  schedule(item, item.left)
}

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
            v-model="stacked"
            size="sm"
            label="Stacked"
            description="Compact's two buttons one above the other"
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

    <!-- the stack, pinned to the stage's top-right corner. The stage clips,
         so a card enters from beyond its right edge. -->
    <TransitionGroup
      tag="div"
      name="v2-notif"
      class="pointer-events-none absolute right-5 top-5 flex flex-col items-end gap-3"
      aria-live="polite"
    >
      <div
        v-for="item in shown"
        :key="item.id"
        class="pointer-events-auto"
        @mouseenter="hold(item)"
        @mouseleave="release(item)"
      >
        <NotificationCard :spec="item.spec" @dismiss="dismiss(item.id)" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
/* In from the right edge on a long ease-out, the stack shuffling down to
   make room; out the same way. A leaving card comes out of the flow so the
   ones below it glide up rather than jump. */
.v2-notif-enter-active {
  transition:
    transform 440ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 220ms ease-out;
}
.v2-notif-leave-active {
  position: absolute;
  right: 0;
  transition:
    transform 300ms cubic-bezier(0.4, 0, 1, 1),
    opacity 220ms ease-in;
}
.v2-notif-enter-from,
.v2-notif-leave-to {
  opacity: 0;
  transform: translateX(calc(100% + 40px)) scale(0.96);
}
.v2-notif-move {
  transition: transform 340ms cubic-bezier(0.32, 0.72, 0, 1);
}
@media (prefers-reduced-motion: reduce) {
  .v2-notif-enter-active,
  .v2-notif-leave-active,
  .v2-notif-move {
    transition-duration: 1ms;
  }
}
</style>
