<script setup lang="ts">
// Figma: espresso-2.0 › card › type=note, variant=outline — the four sizes,
// every value read from the file. All sit on the raised card surface behind
// a 1px outline-gray-1 border, with the design's own icons.
//   sm  (31597:55763) 220 × 215, 12px radius, p 14, 12px gaps: 14/500
//       gray-800 title · 6px · 13/19.5 gray-600 note · the 11/530 gray-400
//       stamp (weight 530, off-scale), upper-cased and tracked 0.99px
//   md  (31286:71003) 250 × 273, 12px radius: a 44px header (py 12 · px 14)
//       of a 20px app logo · 8px · 14 gray-700 name; px 14 · pb 14 body of a
//       16/500 gray-800 title · 6px · 14/21 gray-600 note; a 44px footer of
//       a 20px round avatar · 8px · 14 gray-700 name with the 14 gray-500
//       date on the right
//   lg  (31643:25124) 280 × 261, 12px radius, p 16, 32px gaps: 18/600
//       gray-800 title · 6px · 14/21 gray-600 note; a footer of two 16px
//       icon rows 12px apart (book, calendar) with 14 gray-600 text
//   xl  (31708:6105) 480 × 376, 16px radius, p 20, 16px gaps: 20/600
//       gray-800 subject; then a 40px avatar · 8px · 14/500 gray-700 sender
//       over the 13/19.5 gray-600 recipients, ruled beneath (pb 12) · 14px ·
//       the 14/21 gray-600 mail body, newlines kept
import bookIcon from '../assets/cards/icons/book.svg?raw'
import calendarIcon from '../assets/cards/icons/calendar.svg?raw'
import logo from '../assets/cards/nc-logo.png'
import maya from '../assets/cards/nc-av-maya.png'
import sandeep from '../assets/cards/nc-av-sandeep.png'

const NOTE =
  'A language model created by OpenAI. I’m here to help with a variety of tasks such as answering questions, providing information, generating text, assisting with writing, and much more.'

const MAIL = `Hi Good morning,
We hope this message finds you well.

We are writing to inform you about recent updates to our inventory package that may affect your current and future orders. We’ve expanded our inventory with new items including Bose. These additions are now available for ordering and can be viewed on our Bose

Thanks & Regards
Templeton Peck`
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-8">
    <!-- sm -->
    <article class="espresso-note-card h-[215px] w-[220px] justify-between rounded-6 p-3.5">
      <div class="flex flex-col gap-1.5">
        <p class="flex h-4 items-center truncate text-base-medium text-ink-gray-8">
          UX Optimization Guide
        </p>
        <p class="text-sm leading-[19.5px] text-ink-gray-6">{{ NOTE }}</p>
      </div>
      <!-- the file sets 530 here; the type scale only has 500 / 600 -->
      <p
        class="flex h-[13px] items-center text-2xs font-[530] uppercase tracking-[0.99px] text-ink-gray-4"
      >
        3hr ago
      </p>
    </article>

    <!-- md -->
    <article class="espresso-note-card h-[273px] w-[250px] justify-between rounded-6">
      <div class="flex flex-col">
        <header class="flex h-11 items-center gap-2 px-3.5 py-3">
          <img :src="logo" alt="" class="size-5 shrink-0 rounded-[5px]" />
          <p class="flex h-4 min-w-0 items-center truncate text-base text-ink-gray-7">Attentive</p>
        </header>
        <div class="flex flex-col gap-1.5 px-3.5 pb-3.5">
          <p class="flex h-[18px] items-center truncate text-lg-medium text-ink-gray-8">
            Untitled note
          </p>
          <p class="line-clamp-7 text-p-base text-ink-gray-6">{{ NOTE }}</p>
        </div>
      </div>
      <footer class="flex h-11 items-center gap-2 px-3.5 py-3">
        <img :src="maya" alt="" class="size-5 shrink-0 rounded-full" />
        <p class="flex h-4 min-w-0 flex-1 items-center truncate text-base text-ink-gray-7">
          Maya Thompson
        </p>
        <p class="flex h-4 shrink-0 items-center text-base text-ink-gray-5">18 May</p>
      </footer>
    </article>

    <!-- lg -->
    <article class="espresso-note-card h-[261px] w-[280px] justify-between rounded-6 p-4">
      <div class="flex flex-col gap-1.5">
        <p class="flex h-[21px] items-center truncate text-2xl-semibold text-ink-gray-8">
          Framework
        </p>
        <p class="text-p-base text-ink-gray-6">
          Digital products are more abstract and complex than any product we've designed before.
          People are using their digital devices faster, with less conscious thought and more
          distracted than ever in history.
        </p>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex h-4 items-center gap-2">
          <span class="size-4 shrink-0 text-ink-gray-6" v-html="bookIcon" />
          <p class="min-w-0 truncate text-base text-ink-gray-6">4 Courses</p>
        </div>
        <div class="flex h-4 items-center gap-2">
          <span class="size-4 shrink-0 text-ink-gray-6" v-html="calendarIcon" />
          <p class="min-w-0 truncate text-base text-ink-gray-6">Jan 21,2023 - Jan 24, 2023</p>
        </div>
      </div>
    </article>

    <!-- xl -->
    <article class="espresso-note-card h-[376px] w-[480px] gap-4 rounded-7 p-5">
      <p class="flex h-[23px] items-center truncate text-3xl-semibold text-ink-gray-8">
        Expanding our inventory
      </p>
      <div class="flex min-h-0 flex-col gap-3.5">
        <div class="flex items-center gap-2 border-b border-outline-gray-1 pb-3 dark:border-outline-gray-2">
          <img :src="sandeep" alt="" class="size-10 shrink-0 rounded-full" />
          <div class="flex min-w-0 flex-col gap-1">
            <p class="flex h-4 items-center truncate text-base-medium text-ink-gray-7">
              Sandeep Prabhakaran
            </p>
            <p class="flex h-5 items-center truncate text-sm leading-[19.5px] text-ink-gray-6">
              To: Jonathan Higgins, sandeep@timeless.co, +4
            </p>
          </div>
        </div>
        <p class="min-h-0 overflow-hidden whitespace-pre-line text-p-base text-ink-gray-6">
          {{ MAIL }}
        </p>
      </div>
    </article>
  </div>
</template>

<style>
/* Same shell as the other cards: a raised surface behind a hairline, one
   step lower in dark. */
.espresso-note-card {
  --card-surface: var(--surface-elevation-2);
  background-color: var(--card-surface);
  @apply flex flex-col overflow-hidden border border-outline-gray-1;
}
[data-theme='dark'] .espresso-note-card {
  --card-surface: var(--surface-elevation-1);
}
/* the md note runs to seven lines before it clips */
.line-clamp-7 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
  overflow: hidden;
}
</style>
