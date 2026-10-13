<script setup lang="ts">
// Figma: espresso-2.0 › List › Event (30989:24929). A 449px bordered card
// (12px radius) of event "cells", ruled between:
//   row     p 10 · py 10.5, 44px date tile · 8px · body · 8px · RSVP;
//           surface-gray-1 hover
//   tile    44 × 44, 9px radius, outline-gray-2 border: 11 medium red month
//           over the 16 medium gray-900 day
//   body    14 medium gray-500 time · 4px · 14/21 medium gray-800 title,
//           truncated
//   RSVP    sm buttons 4px apart: ghost No, ghost Maybe, subtle Accept; the
//           chosen answer takes the subtle fill
import { ref } from 'vue'
import { Button } from '../../../src'

type Rsvp = 'no' | 'maybe' | 'accept'

interface CalendarEvent {
  id: number
  month: string
  day: string
  time: string
  title: string
  rsvp: Rsvp | null
}

const events = ref<CalendarEvent[]>([
  { id: 1, month: 'Mar', day: '30', time: '1:15 - 1:45PM', title: 'Rebranding Strategies', rsvp: null },
  { id: 2, month: 'Mar', day: '31', time: '2:30 - 3:00 PM', title: 'Rebranding Strategies', rsvp: null },
  { id: 3, month: 'Mar', day: '03', time: '4:00 - 4:30 PM', title: 'Discussion on Product refresh', rsvp: null },
  { id: 4, month: 'Mar', day: '04', time: '5:15 - 5:45 PM', title: 'Product Evolution Meeting', rsvp: null },
  { id: 5, month: 'Mar', day: '07', time: '6:30 - 7:00 PM', title: 'Branding Transformation', rsvp: null },
])

const ANSWERS: { value: Rsvp; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'accept', label: 'Accept' },
]

// Unanswered, Accept carries the fill (as in the design); once answered,
// the fill follows the answer.
function variantOf(event: CalendarEvent, answer: Rsvp) {
  return (event.rsvp ?? 'accept') === answer ? 'subtle' : 'ghost'
}

function respond(event: CalendarEvent, answer: Rsvp) {
  event.rsvp = event.rsvp === answer ? null : answer
}
</script>

<template>
  <ul
    class="w-[449px] max-w-full overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-base dark:border-outline-gray-2"
    aria-label="Events"
  >
    <li
      v-for="event in events"
      :key="event.id"
      class="flex items-center gap-2 border-b border-outline-gray-1 px-2.5 py-[10.5px] transition-colors last:border-b-0 hover:bg-surface-gray-1 dark:border-outline-gray-2 dark:hover:bg-surface-gray-2"
    >
      <!-- date tile -->
      <div
        class="flex size-11 shrink-0 flex-col items-center justify-center rounded-[9px] border border-outline-gray-2 bg-surface-base"
        :aria-label="`${event.month} ${event.day}`"
      >
        <span class="text-2xs-medium uppercase leading-[18px] text-ink-red-5">
          {{ event.month }}
        </span>
        <span class="text-lg-medium leading-[18px] text-ink-gray-9">{{ event.day }}</span>
      </div>

      <div class="flex min-w-0 flex-1 items-center gap-2">
        <!-- time · title -->
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <p class="truncate text-base-medium text-ink-gray-5">{{ event.time }}</p>
          <p class="truncate text-p-base font-medium text-ink-gray-8">{{ event.title }}</p>
        </div>

        <!-- RSVP -->
        <div class="flex shrink-0 items-center gap-1" role="group" :aria-label="`RSVP to ${event.title}`">
          <Button
            v-for="a in ANSWERS"
            :key="a.value"
            size="sm"
            :variant="variantOf(event, a.value)"
            :aria-pressed="event.rsvp === a.value"
            @click="respond(event, a.value)"
          >
            {{ a.label }}
          </Button>
        </div>
      </div>
    </li>
  </ul>
</template>
