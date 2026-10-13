<template>
  <!-- Mail's foot (31304:62143): a section row — "Upcoming events" and the
       count, 14 gray-500 — then the events 6px apart. Each is a 204 × 49
       card: p 8, r8, a 2 × 33 colour bar · 6px · the 12/14 medium time over
       the 13/15 medium title, 4px apart. The file draws the first card
       lifted (0 1 3 · 0 0 1 black with an inner white highlight) — its
       hover; here every card rests flat and lifts on hover.
       The file fills the card with surface-base, which in dark is the very
       #171717 the sidebar shows through to, so the card would vanish there;
       elevation-1 is the same white in light and the first step up in dark. -->
  <div class="flex flex-col gap-1.5">
    <SidebarRow
      :row="{
        type: 'section',
        label: 'Upcoming events',
        hint: String(mailEvents.length),
      }"
    />
    <button
      v-for="event in mailEvents"
      :key="event.title"
      type="button"
      class="flex w-full items-center gap-1.5 rounded-4 bg-surface-elevation-1 p-2 text-left outline-none transition-shadow hover:shadow-sm focus-visible:focus-ring"
    >
      <span
        class="h-[33px] w-0.5 shrink-0 rounded-4"
        :style="{ backgroundColor: event.color }"
      />
      <span class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-xs-medium leading-[14px] text-ink-gray-5">
          {{ event.time }}
        </span>
        <span class="truncate text-sm-medium leading-[15px] text-ink-gray-7">
          {{ event.title }}
        </span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import SidebarRow from './SidebarRow.vue'
import { mailEvents } from './scenarios'
</script>
