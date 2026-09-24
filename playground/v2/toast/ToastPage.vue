<script setup lang="ts">
// The Toast page: a controller in the middle of the panel, and the toasts
// it fires stacking up from the panel's bottom-right corner (Figma
// 29790:191548 — see EspressoToast for the card itself).
// Each type fires on tap; the switches decide whether that toast carries a
// description and an action. They dismiss themselves after 5s, or on the ×.
import { ref } from 'vue'
import { Button, Switch } from '../../../src'
import EspressoToast, { type ToastType } from './EspressoToast.vue'

interface Shown {
  id: number
  type: ToastType
  title: string
  description?: string
  action?: string
}

const TYPES: { value: ToastType; label: string; title: string; blurb: string }[] = [
  {
    value: 'success',
    label: 'Success',
    title: 'All changes saved',
    blurb: 'Your ticket layout is live for the team.',
  },
  {
    value: 'error',
    label: 'Error',
    title: 'Could not save changes',
    blurb: 'The connection dropped. Nothing was lost.',
  },
  {
    value: 'warning',
    label: 'Warning',
    title: 'Trial ends in 7 days',
    blurb: 'Add a payment method to keep your apps.',
  },
  {
    value: 'info',
    label: 'Info',
    title: 'A new version is available',
    blurb: 'Reload the page to pick up the release.',
  },
  {
    value: 'plain',
    label: 'Plain',
    title: 'Link copied to clipboard',
    blurb: 'Anyone with the link can view the ticket.',
  },
]

const withDescription = ref(true)
const withAction = ref(true)

const toasts = ref<Shown[]>([])
let next = 1

// the newest sits at the bottom, nearest the corner it came from
const LIMIT = 4

function show(t: (typeof TYPES)[number]) {
  const id = next++
  toasts.value = [
    ...toasts.value.slice(-(LIMIT - 1)),
    {
      id,
      type: t.value,
      title: t.title,
      description: withDescription.value ? t.blurb : undefined,
      action: withAction.value ? 'Undo' : undefined,
    },
  ]
  setTimeout(() => dismiss(id), 5000)
}

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

// A leaving toast keeps its slot while it falls, so it does not jump to the
// corner first; the slot closes underneath it on the same beat, which lets
// the rest of the stack settle toward the corner rather than snap.
function onLeave(el: Element) {
  const toast = el as HTMLElement
  toast.style.marginBottom = `-${toast.offsetHeight + 10}px`
}
</script>

<template>
  <div class="relative h-full">
    <div class="absolute inset-0 flex items-center justify-center px-5 py-20">
      <!-- the controller -->
      <div
        class="flex w-[360px] flex-col gap-4 rounded-6 border border-outline-gray-1 bg-surface-elevation-2 p-4 dark:border-outline-gray-2 dark:bg-surface-elevation-1"
      >
        <div class="flex flex-col gap-1">
          <p class="text-lg-medium text-ink-gray-8">Toast</p>
          <p class="text-p-sm text-ink-gray-5">
            Tap a type and it rises from the bottom-right corner.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Switch
            v-model="withDescription"
            size="sm"
            label="Description"
            description="A second line under the title"
          />
          <Switch
            v-model="withAction"
            size="sm"
            label="Action"
            description="An Undo button beside the close"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            v-for="t in TYPES"
            :key="t.value"
            :variant="t.value === 'success' ? 'solid' : 'subtle'"
            size="sm"
            @click="show(t)"
          >
            {{ t.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- the stack: newest nearest the corner -->
    <TransitionGroup
      tag="div"
      name="v2-toast"
      class="pointer-events-none absolute bottom-5 right-5 z-20 flex flex-col items-end gap-2.5"
      @leave="onLeave"
    >
      <EspressoToast
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto"
        :type="t.type"
        :title="t.title"
        :description="t.description"
        :action="t.action"
        @action="dismiss(t.id)"
        @dismiss="dismiss(t.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style>
/* Each toast rises from below the corner and settles, then drops back the
   same way to leave: a long, decelerating curve in, a shorter accelerating
   one out. The panel clips its bottom edge, so a toast appears to come up
   from off-stage and to fall back off it. */
.v2-toast-enter-active {
  transition:
    opacity 260ms ease-out,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}
.v2-toast-leave-active {
  transition:
    opacity 260ms ease-in 60ms,
    transform 320ms cubic-bezier(0.4, 0, 0.9, 0.6),
    margin-bottom 320ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}
/* the others close the gap on the same curve as the one coming in */
.v2-toast-move {
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}
.v2-toast-enter-from,
.v2-toast-leave-to {
  opacity: 0;
  /* its own height plus the stack's gap: fully below its slot */
  transform: translateY(calc(100% + 10px)) scale(0.98);
}
@media (prefers-reduced-motion: reduce) {
  .v2-toast-enter-active,
  .v2-toast-leave-active,
  .v2-toast-move {
    transition: none;
  }
}
</style>
