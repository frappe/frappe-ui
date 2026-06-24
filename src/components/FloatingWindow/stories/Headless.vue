<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFloatingWindow, Button } from 'frappe-ui'

const panel = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)

// The composable owns geometry, the mode state machine, dragging, resizing, and
// persistence; the markup is entirely yours. This shell reads the live `width`
// it tracks to drive a responsive layout, which the boxed component can't do:
// pop the panel out, drag it wider, and a reading pane opens beside the list.
const { mode, width, style, dock, float, minimize, expandFromTray, startResize } =
  useFloatingWindow(panel, handle, {
    initialWidth: 620,
    initialHeight: 460,
    minWidth: 320,
  })

// Below this the panel is a single column; above it the reading pane appears.
const TWO_PANE_WIDTH = 540
const twoPane = computed(
  () => mode.value === 'floating' && width.value >= TWO_PANE_WIDTH,
)

interface Ticket {
  id: number
  subject: string
  requester: string
  status: 'Open' | 'Replied' | 'Resolved'
  body: string
}

const tickets: Ticket[] = [
  {
    id: 512,
    subject: 'Refund not received',
    requester: 'Amara Okafor',
    status: 'Open',
    body: 'It has been five business days since the refund was approved and nothing has landed in my account yet.',
  },
  {
    id: 508,
    subject: 'Cannot reset password',
    requester: 'Lucas Meyer',
    status: 'Replied',
    body: 'The reset link keeps saying it has expired, even right after I request a fresh one.',
  },
  {
    id: 501,
    subject: 'Export missing rows',
    requester: 'Priya Nair',
    status: 'Open',
    body: 'My CSV export stops at 1,000 rows, but the report itself shows just over 4,000.',
  },
  {
    id: 488,
    subject: 'Double charged for May',
    requester: 'Diego Santos',
    status: 'Resolved',
    body: 'I was billed twice on the same card for the May subscription and need one charge reversed.',
  },
]

const selectedId = ref(tickets[0].id)
const selected = computed(
  () => tickets.find((ticket) => ticket.id === selectedId.value) ?? tickets[0],
)

const statusDot: Record<Ticket['status'], string> = {
  Open: 'bg-surface-amber-3',
  Replied: 'bg-surface-blue-3',
  Resolved: 'bg-surface-green-3',
}
</script>

<template>
  <div
    ref="panel"
    class="flex w-[420px] flex-col rounded-lg border border-outline-gray-2 bg-surface-elevation-1"
    :class="mode === 'docked' ? '' : 'shadow-2xl'"
    :style="style"
  >
    <!-- Title bar, doubles as the drag handle while floating. -->
    <div
      ref="handle"
      class="flex select-none items-center justify-between border-b border-outline-gray-1 px-3 py-2"
      :class="mode === 'floating' ? 'cursor-move' : ''"
    >
      <div class="flex items-baseline gap-2">
        <span class="text-p-sm font-medium text-ink-gray-8">Tickets</span>
      </div>
      <div class="flex items-center gap-1">
        <Button
          v-if="mode === 'minimized'"
          variant="ghost"
          tooltip="Expand"
          @click="expandFromTray"
        >
          <template #icon><LucideMaximize2 class="h-4 w-4" /></template>
        </Button>
        <Button v-else variant="ghost" tooltip="Minimize" @click="minimize">
          <template #icon><LucideMinus class="h-4 w-4" /></template>
        </Button>
        <!-- Pop out when docked; close (dock back) once detached. The close (X)
             action always sits last. -->
        <Button
          variant="ghost"
          :tooltip="mode === 'docked' ? 'Pop out' : 'Close'"
          @click="mode === 'docked' ? float() : dock()"
        >
          <template #icon>
            <LucideMaximize2 v-if="mode === 'docked'" class="h-4 w-4" />
            <LucideX v-else class="h-4 w-4" />
          </template>
        </Button>
      </div>
    </div>

    <!-- Body, collapsed in the tray. Splits into list + reading pane once the
         floating window is dragged past TWO_PANE_WIDTH. -->
    <div v-show="mode !== 'minimized'" class="flex min-h-0 flex-1">
      <ul
        class="min-h-0 flex-1 divide-y divide-outline-gray-1 overflow-auto"
        :class="twoPane ? 'max-w-[260px] border-r border-outline-gray-1' : ''"
      >
        <li v-for="ticket in tickets" :key="ticket.id">
          <button
            type="button"
            class="flex w-full flex-col gap-1 px-3 py-2 text-left transition-colors hover:bg-surface-gray-2"
            :class="twoPane && ticket.id === selectedId ? 'bg-surface-gray-2' : ''"
            @click="selectedId = ticket.id"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 shrink-0 rounded-full"
                :class="statusDot[ticket.status]"
              />
              <span class="truncate text-p-sm font-medium text-ink-gray-8">
                {{ ticket.subject }}
              </span>
            </div>
            <span class="pl-4 text-p-xs text-ink-gray-5">
              #{{ ticket.id }} · {{ ticket.requester }}
            </span>
          </button>
        </li>
      </ul>

      <!-- Reading pane, only when the window is wide enough to hold it. -->
      <div
        v-if="twoPane"
        class="flex min-w-0 flex-1 flex-col gap-2 overflow-auto p-4"
      >
        <span class="text-p-xs tracking-wide text-ink-gray-4 capitalize">
          #{{ selected.id }} · {{ selected.status }}
        </span>
        <h3 class="text-base font-medium text-ink-gray-8">
          {{ selected.subject }}
        </h3>
        <p class="text-p-sm text-ink-gray-5">From {{ selected.requester }}</p>
        <p class="text-p-sm text-ink-gray-7">{{ selected.body }}</p>
      </div>
    </div>

    <!-- Hint shown while floating but still too narrow for the reading pane. -->
    <p
      v-if="mode === 'floating' && !twoPane"
      class="border-t border-outline-gray-1 px-3 py-1.5 text-p-xs text-ink-gray-4"
    >
      Drag the panel wider to open the reading pane.
    </p>

    <!-- Bottom-right resize grip (floating only; the fixed panel anchors it). -->
    <div
      v-if="mode === 'floating'"
      class="absolute bottom-0 right-0 size-4 cursor-nwse-resize"
      @pointerdown.prevent="startResize"
    />
  </div>
</template>
