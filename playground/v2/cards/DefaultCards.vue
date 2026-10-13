<script setup lang="ts">
// Figma: espresso-2.0 › card › type=default, variant=outline — the four
// sizes. All on the raised surface the popovers use, behind a 1px
// outline-gray-1 border, each at the size the design fixes (the border
// sits inside it). Colours read from the file's variables: titles
// and names gray-700, body gray-600, counts and the old price gray-500,
// the xl title and price gray-800.
//   sm  (31507:70764) 210 × 88, 12px radius, p 12, 10px gaps: 14 medium
//       title (16px line) · 4px · 12 gray-600 line (14px), then a 20px avatar group (4px
//       overlap, each ringed in the card colour) beside a gray-2 count
//   md  (31286:71006) 280 × 128, 10px radius, p 16, 12px gaps: 16 medium
//       title · 4px · 14/21 gray-600 body · a footer of 20px avatar · 6px ·
//       name, with the 👍 9 · 👎 11 counts on the right — each 14px icon 6
//       from its number, the groups and the rule 8 apart
//   lg  (31507:70815) 280 × 215, 12px radius, p 14, 14px gaps: 17 semibold
//       title (20px line) · a 40px avatar 8px from the 14 medium name, 4px
//       over the 14 gray-600 role · 14/21 gray-600 text
//   xl  (31637:20349) 280 × 240, 12px radius, p 16, 14px gaps: a 14
//       gray-600 meta line of two cells (16px icon · 6 · text) with the dot
//       2 from either side · 12px · 18 semibold title · 8px · stars
//       with the 14 rating · 16px · the 20 semibold price beside the 14
//       struck-through list price ·
//       the author pinned to the bottom
import { Avatar } from '../../../src'
// the design's own icons (icon/line/like · dislike · people · dot,
// icon/solid/star · star half), exported from the file
import dislikeIcon from '../assets/cards/icons/dislike.svg?raw'
import dotIcon from '../assets/cards/icons/dot.svg?raw'
import likeIcon from '../assets/cards/icons/like.svg?raw'
import peopleIcon from '../assets/cards/icons/people.svg?raw'
import starHalfIcon from '../assets/cards/icons/star-half.svg?raw'
import starIcon from '../assets/cards/icons/star.svg?raw'
import av1 from '../assets/cards/card-av-1.png'
import av2 from '../assets/cards/card-av-2.png'
import matt from '../assets/cards/card-av-matt.png'
import sally from '../assets/cards/card-av-sally.png'
import stuart from '../assets/cards/card-av-stuart.png'

// 4.0 of 5: three filled, one half, one empty — as the design draws it
const STARS = [
  { icon: starIcon, tone: 'text-ink-amber-5' },
  { icon: starIcon, tone: 'text-ink-amber-5' },
  { icon: starIcon, tone: 'text-ink-amber-5' },
  { icon: starHalfIcon, tone: '' },
  { icon: starIcon, tone: 'text-ink-gray-2' },
]

const group = [
  { image: av1, label: 'Priya' },
  { image: av2, label: 'Mei' },
]
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-8">
    <!-- sm -->
    <article class="espresso-card h-[88px] w-[210px] gap-2.5 rounded-6 p-3">
      <div class="flex flex-col gap-1">
        <p class="truncate text-base-medium text-ink-gray-7">General</p>
        <p class="truncate text-xs text-ink-gray-6">🪝 Open FLC</p>
      </div>
      <div class="flex items-center">
        <Avatar
          v-for="(a, i) in group"
          :key="a.label"
          size="sm"
          shape="circle"
          class="shadow-[0_0_0_2px_var(--card-surface)]"
          :class="i > 0 ? '-ml-1' : ''"
          :image="a.image"
          :label="a.label"
        />
        <span
          class="-ml-1 flex size-5 items-center justify-center rounded-full bg-surface-gray-2 text-sm-medium text-ink-gray-7 shadow-[0_0_0_2px_var(--card-surface)]"
        >
          3
        </span>
      </div>
    </article>

    <!-- md -->
    <article class="espresso-card h-32 w-[280px] gap-3 rounded-5 p-4">
      <div class="flex flex-col gap-1">
        <p class="truncate text-lg-medium text-ink-gray-7">
          Build your first platform
        </p>
        <p class="text-p-base text-ink-gray-6">
          Learn the essentials and bring your ideas to life.
        </p>
      </div>
      <div class="flex h-5 items-center gap-1.5">
        <Avatar size="sm" shape="circle" :image="stuart" label="Stuart" />
        <span class="min-w-0 flex-1 truncate text-base text-ink-gray-7"
          >Stuart</span
        >
        <span class="flex shrink-0 items-center gap-2 text-xs text-ink-gray-5">
          <span class="flex items-center gap-1.5">
            <span class="size-3.5 shrink-0" v-html="likeIcon" />
            9
          </span>
          <!-- the rule between the counts: outline-gray-1, as a border -->
          <span
            class="h-3.5 border-l border-outline-gray-1"
            aria-hidden="true"
          />
          <span class="flex items-center gap-1.5">
            <span class="size-3.5 shrink-0" v-html="dislikeIcon" />
            11
          </span>
        </span>
      </div>
    </article>

    <!-- lg -->
    <article class="espresso-card h-[215px] w-[280px] gap-3.5 rounded-6 p-3.5">
      <p
        class="flex h-5 shrink-0 items-center truncate text-xl-semibold text-ink-gray-7"
      >
        Course creator
      </p>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Avatar
            size="2xl"
            shape="circle"
            :image="matt"
            label="Matt Clinton"
          />
          <div class="flex min-w-0 flex-col gap-1">
            <p
              class="flex h-4 items-center truncate text-base-medium text-ink-gray-7"
            >
              Matt Clinton
            </p>
            <p class="flex h-4 items-center truncate text-base text-ink-gray-6">
              Developer
            </p>
          </div>
        </div>
        <p class="text-p-base text-ink-gray-6">
          Passionate individual with a love for learning and a flair for
          creativity. A curious mind navigating the complexities of life one
          question at a time.
        </p>
      </div>
    </article>

    <!-- xl -->
    <article class="espresso-card h-60 w-[280px] justify-between rounded-6 p-4">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3">
          <!-- two cells, each a 16px icon 6 from its text, with the dot 2
               from either side -->
          <p class="flex h-4 items-center gap-0.5 text-base text-ink-gray-6">
            <span class="flex items-center gap-1.5">
              <span class="size-4 shrink-0" v-html="peopleIcon" />
              12K Students
            </span>
            <span class="size-4 shrink-0" aria-hidden="true" v-html="dotIcon" />
            <span class="flex items-center gap-1.5">
              <span class="size-4 shrink-0" v-html="peopleIcon" />
              4 Lessons
            </span>
          </p>
          <div class="flex flex-col gap-2">
            <p class="truncate text-2xl-semibold text-ink-gray-8">
              Introducing Frappe LMS
            </p>
            <p class="flex h-4 items-center gap-2">
              <span class="flex" role="img" aria-label="Rated 4.0 out of 5">
                <span
                  v-for="(star, i) in STARS"
                  :key="i"
                  class="size-4"
                  :class="star.tone"
                  v-html="star.icon"
                />
              </span>
              <span class="text-base text-ink-gray-6">4.0 (242 Rating)</span>
            </p>
          </div>
        </div>
        <p class="flex h-[23px] items-baseline gap-2">
          <span class="text-3xl-semibold text-ink-gray-8">₹ 699</span>
          <span class="text-base text-ink-gray-5 line-through">₹ 1200</span>
        </p>
      </div>

      <div class="flex h-5 items-center gap-2">
        <Avatar size="sm" shape="circle" :image="sally" label="Sally Potter" />
        <span class="truncate text-base text-ink-gray-7">Sally Potter</span>
      </div>
    </article>
  </div>
</template>

<style>
/* The outline card: a raised surface behind a hairline, flat — no hover
   lift. Dark sits one step lower (elevation-1) with the softer gray-1
   edge, as the dark design does — elevation-2 under a gray-2 border reads
   far too light there. `--card-surface` follows it, so the avatar rings
   punch the card's own colour. */
.espresso-card {
  --card-surface: var(--surface-elevation-2);
  background-color: var(--card-surface);
  @apply flex flex-col border border-outline-gray-1;
}
[data-theme='dark'] .espresso-card {
  --card-surface: var(--surface-elevation-1);
}
</style>
