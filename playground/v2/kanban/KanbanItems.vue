<script setup lang="ts">
// Figma: espresso-2.0 › cards › Card usage patterns › Kanban item — default
// card (34522:44305): three 300 × 94 default cards 8px apart, each p 12 on
// elevation-1 with the gray-100 hairline and 12px corners — a 20px title
// row of the 14 regular gray-700 name with a 20px avatar on the right, 4px
// over the 14 regular gray-800 dates, and 10px over a 20px footer slot the
// pattern leaves empty. The hairline sits inside the file's 12px, so 11px
// plus the line keeps the card 300 × 94.
import av1 from '../assets/kanban/av-item-1.png'
import av2 from '../assets/kanban/av-item-2.png'
import av3 from '../assets/kanban/av-item-3.png'

const ITEMS = [
  {
    title: 'Redefine impactful systems',
    dates: 'Jan 13 - Jun 26, 2026',
    avatar: av1,
  },
  {
    title: 'Generate frictionless communities',
    dates: 'Feb 24 - Oct 30, 2026',
    avatar: av2,
  },
  {
    title: 'Embrace efficient infrastructures',
    dates: 'May 9 - Jun 1, 2026',
    avatar: av3,
  },
]
</script>

<template>
  <div class="flex flex-col gap-2">
    <article
      v-for="item in ITEMS"
      :key="item.title"
      class="flex w-[300px] flex-col gap-2.5 rounded-6 border border-outline-gray-1 bg-surface-elevation-1 p-[11px]"
    >
      <div class="flex flex-col gap-1">
        <p class="flex h-5 items-center gap-2">
          <span
            class="min-w-0 flex-1 truncate text-base leading-4 text-ink-gray-7"
          >
            {{ item.title }}
          </span>
          <img
            :src="item.avatar"
            alt=""
            class="size-5 shrink-0 rounded-full object-cover"
          />
        </p>
        <p class="text-base leading-4 text-ink-gray-8">{{ item.dates }}</p>
      </div>
      <!-- the footer slot: 20px the pattern keeps for what a board adds -->
      <div class="h-5" aria-hidden="true" />
    </article>
  </div>
</template>
