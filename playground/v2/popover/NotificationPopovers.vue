<script setup lang="ts">
// Figma: espresso-2.0 › Popover › notification — side by side on the raised
// popover surface, lg shadow:
//   default  (30869:37765) 391px, 16px radius, pt 14 · px 16 · pb 16, 18px
//            gaps: 16 medium "Notifications" + ghost xs ✓✓ (mark all
//            read) · 16px · a full-width All / Events switch (gray-2
//            track, p 1, the pick raised) · rows ruled apart (14px gaps):
//            32px avatar · 8px · 14/21 message — actor and object gray-800,
//            the action gray-500, two lines at most — with the 13 gray-500
//            time on the right; a ghost sm "See all activity" at the foot
//   compact  (30869:37764) 413px, 12px radius, p 16, rows ruled apart
//            (14px gaps): 32px avatar · 8px · a 14/500 name with "in ⌗
//            channel" in 14 regular (gray-700) and the 13 gray-500 time,
//            over the 14/21 gray-600 message, two lines at most
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Button } from '../../../src'
import asif from '../assets/popover/av-asif.png'
import faris from '../assets/popover/av-faris.png'
import jake from '../assets/popover/av-jake.png'
import janet from '../assets/popover/av-janet.png'
import michelle from '../assets/popover/av-michelle.png'
import rushabh from '../assets/popover/av-rushabh.png'
import safwan from '../assets/popover/av-safwan.png'
import shariq from '../assets/popover/av-shariq.png'
import you from '../assets/popover/av-you.png'

const emit = defineEmits<{ open: [id: number]; markAllRead: []; seeAll: [] }>()

// ---- default: notifications
type Run = { text: string; strong?: boolean }

interface Note {
  id: number
  avatar: string
  kind: 'mention' | 'event'
  message: Run[]
  time: string
}

const mention = (who: string, lead: string): Run[] => [
  { text: who, strong: true },
  { text: ' mentioned you in lead ' },
  { text: lead, strong: true },
]
const whatsapp = (who: string, lead: string, verb = 'mentioned a Whatsapp message'): Run[] => [
  { text: who, strong: true },
  { text: ` ${verb} in lead ` },
  { text: lead, strong: true },
]
const activity = (who: string, verb: string, lead: string): Run[] => [
  { text: who, strong: true },
  { text: ` ${verb} ` },
  { text: lead, strong: true },
]

const notes: Note[] = [
  { id: 1, avatar: michelle, kind: 'mention', message: mention('Michelle Alva', 'Anwar Ansari'), time: '3h ago' },
  { id: 2, avatar: michelle, kind: 'mention', message: mention('Michelle Alva', 'Ms Darlene Robertson'), time: '7h ago' },
  { id: 3, avatar: michelle, kind: 'mention', message: mention('Michelle Alva', 'Mrs Leslie Alexander'), time: '1d ago' },
  { id: 4, avatar: asif, kind: 'mention', message: mention('Asif Mulani', 'Timeless'), time: '3d ago' },
  { id: 5, avatar: shariq, kind: 'mention', message: mention('Shariq Ansari', 'CRM-DEAL-2024-00018'), time: '21 Jun' },
  { id: 6, avatar: janet, kind: 'event', message: whatsapp('Janet Cooper', 'CRM-DEAL-2024-00057'), time: '1 Jun' },
  { id: 7, avatar: janet, kind: 'event', message: whatsapp('Janet Cooper', 'CRM-DEAL-2024-00061', 'mentioned a WhatsApp message'), time: '31 May' },
  { id: 8, avatar: you, kind: 'event', message: whatsapp('You', 'CRM-DEAL-2024-00011', 'received a Whatsapp message'), time: '11 May' },
  { id: 9, avatar: jake, kind: 'event', message: whatsapp('Jake Andrews', 'CRM-DEAL-2024-00072'), time: '10 Apr' },
  { id: 10, avatar: shariq, kind: 'event', message: activity('Shariq Ansari', 'logged a call in lead', 'CRM-DEAL-2024-00018'), time: '2 Apr' },
  { id: 11, avatar: asif, kind: 'event', message: activity('Asif Mulani', 'sent an email in lead', 'Timeless'), time: '28 Mar' },
  { id: 12, avatar: michelle, kind: 'event', message: activity('Michelle Alva', 'scheduled a meeting in lead', 'Anwar Ansari'), time: '21 Mar' },
  { id: 13, avatar: janet, kind: 'event', message: activity('Janet Cooper', 'changed the status of', 'CRM-DEAL-2024-00057'), time: '14 Mar' },
]

// both tabs show the latest eight
const LIMIT = 8

type Tab = 'all' | 'events'
const tab = ref<Tab>('all')
const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'events', label: 'Events' },
]

// The raised chip is one element that glides to the picked tab, as the
// other segmented controls here do.
const tabRow = ref<HTMLElement | null>(null)
const tabChip = ref<{ left: number; top: number; width: number; height: number } | null>(null)

async function placeTabChip() {
  await nextTick()
  const el = tabRow.value?.querySelector<HTMLElement>('[aria-selected="true"]')
  tabChip.value = el
    ? { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }
    : null
}

watch(tab, placeTabChip)
onMounted(placeTabChip)

const shown = computed(() =>
  (tab.value === 'all' ? notes : notes.filter((n) => n.kind === 'event')).slice(0, LIMIT),
)
const plain = (runs: Run[]) => runs.map((r) => r.text).join('')

// ---- compact: comments
const CHANNEL_ICON = { thread: 'lucide-message-square-text', general: 'lucide-globe', design: 'lucide-hash' }

const comments = [
  { id: 1, avatar: safwan, name: 'Safwan', channel: 'thread', time: '2h ago', text: 'Is it 3 or right now? @Sagar Sharma @Sadiq Ansari' },
  { id: 2, avatar: rushabh, name: 'Rushabh Mehta', channel: 'thread', time: '8h ago', text: 'Isn’t @Sadiq Ansari working on this?' },
  { id: 3, avatar: rushabh, name: 'Rushabh Mehta', channel: 'general', time: '2d ago', text: 'Product review for Suite tomorrow, since @Sagar Sharma Ansari is already here - @Sadiq Ansari can you join in too?' },
  { id: 4, avatar: faris, name: 'Faris Ansari', channel: 'general', time: '10 Jun', text: '@Sadiq Ansari Logo for Frappe Suite raven workspace? Doesn’t need to be the official logo, just something to start with.' },
  { id: 5, avatar: faris, name: 'Faris Ansari', channel: 'design', time: '9 Jun', text: '@Sadiq Ansari @Pragati Kandoi @Jacob Salvi' },
] as const

</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-10">
    <!-- default: notifications -->
    <div
      class="flex w-[391px] flex-col gap-[18px] rounded-7 bg-surface-elevation-2 px-4 pb-4 pt-3.5 shadow-lg"
      role="dialog"
      aria-label="Notifications"
    >
      <div class="flex flex-col gap-4">
        <div class="flex h-6 items-center gap-2">
          <p class="flex-1 text-lg-medium text-ink-gray-7">Notifications</p>
          <Button
            variant="ghost"
            size="xs"
            label="Mark all as read"
            title="Mark all as read"
            @click="emit('markAllRead')"
          >
            <template #icon><span class="lucide-check-check size-3.5 text-ink-gray-7" /></template>
          </Button>
        </div>

        <div
          ref="tabRow"
          class="relative flex h-7 gap-1 rounded-4 bg-surface-gray-2 p-px dark:bg-surface-gray-1"
          role="tablist"
          aria-label="Notification filter"
        >
          <span
            v-if="tabChip"
            class="v2-glide-chip absolute rounded-[7px] bg-surface-elevation-3 shadow-sm"
            :style="{
              left: `${tabChip.left}px`,
              top: `${tabChip.top}px`,
              width: `${tabChip.width}px`,
              height: `${tabChip.height}px`,
            }"
            aria-hidden="true"
          />
          <button
            v-for="t in TABS"
            :key="t.value"
            type="button"
            role="tab"
            :aria-selected="tab === t.value"
            class="relative flex-1 rounded-[7px] text-base transition-colors duration-200"
            :class="tab === t.value ? 'text-ink-gray-8' : 'text-ink-gray-5 hover:text-ink-gray-7'"
            @click="tab = t.value"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- rows run into the 18px gaps around them (-my-3.5), so the hover
           fill has room; their own py-3.5 keeps the content where it was -->
      <ul class="-mx-2 -my-3.5 flex flex-col" aria-label="Notifications">
        <li v-for="n in shown" :key="n.id" class="notif-row relative">
          <button
            type="button"
            class="flex w-full items-start gap-2 rounded-5 px-2 py-3.5 text-left transition-colors hover:bg-surface-gray-1 dark:hover:bg-surface-gray-2"
            :aria-label="`${plain(n.message)}, ${n.time}`"
            @click="emit('open', n.id)"
          >
            <img :src="n.avatar" alt="" class="size-8 shrink-0 rounded-full object-cover" />
            <p class="line-clamp-2 min-w-0 flex-1 text-p-base text-ink-gray-5">
              <template v-for="(r, i) in n.message" :key="i">
                <span v-if="r.strong" class="text-ink-gray-8">{{ r.text }}</span>
                <template v-else>{{ r.text }}</template>
              </template>
            </p>
            <span class="shrink-0 pt-0.5 text-sm text-ink-gray-5">{{ n.time }}</span>
          </button>
        </li>
      </ul>

      <Button variant="ghost" size="sm" class="w-full" @click="emit('seeAll')">
        See all activity
      </Button>
    </div>

    <!-- compact: comments -->
    <div
      class="flex w-[413px] flex-col rounded-6 bg-surface-elevation-2 p-4 shadow-lg"
      role="dialog"
      aria-label="Comments"
    >
      <ul class="flex flex-col" aria-label="Recent comments">
        <li
          v-for="c in comments"
          :key="c.id"
          class="flex gap-2 border-b border-outline-gray-1 py-3.5 first:pt-0 last:border-b-0 last:pb-0 dark:border-outline-gray-2"
        >
          <img :src="c.avatar" alt="" class="size-8 shrink-0 rounded-full object-cover" />
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="flex h-4 items-center gap-2">
              <p class="flex min-w-0 flex-1 items-center gap-1 text-base text-ink-gray-7">
                <!-- the name is medium, "in" and the channel regular -->
                <span class="truncate font-medium">{{ c.name }}</span>
                <span class="shrink-0">in</span>
                <span :class="CHANNEL_ICON[c.channel]" class="size-4 shrink-0" />
                <span class="truncate">{{ c.channel }}</span>
              </p>
              <span class="shrink-0 text-sm text-ink-gray-5">{{ c.time }}</span>
            </div>
            <!-- the file keeps the whole message one ink; @names are not marked -->
            <p class="line-clamp-2 text-p-base text-ink-gray-6">{{ c.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
/* Rules are straight lines under each row, inset to the content (a border
   would follow the hover fill's rounded corners). The hovered row reads as
   one rounded block: its rule and the one above it drop away. */
.notif-row::after {
  @apply pointer-events-none absolute inset-x-2 bottom-0 border-b border-outline-gray-1 transition-opacity content-[''] dark:border-outline-gray-2;
}
.notif-row:last-child::after,
.notif-row:hover::after,
.notif-row:has(+ .notif-row:hover)::after {
  @apply opacity-0;
}
</style>
