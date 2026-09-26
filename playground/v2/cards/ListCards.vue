<script setup lang="ts">
// Figma: espresso-2.0 › card › type=list, variant=outline — the four sizes,
// every value read from the file (sizes, padding, gaps, type, colours).
// All sit on the raised card surface behind a 1px outline-gray-1 border,
// and the icons are the design's own (icon/line/…), exported from it.
//   sm  (31286:71010) 268 × 168, 16px radius: a 44px header (py 12 · px 14,
//       ruled beneath) of a 20px app logo · 8px · 14/600 gray-800 title;
//       then py 12 · px 16 rows 12px apart — 16px gray-600 icon · 8px ·
//       14 gray-600 value (one row carries a 16px avatar group, 2px overlap)
//   md  (31597:55327) 280 × 264, 12px radius, p 14: an outline green badge ·
//       8px · 16/600 title over 14/21 gray-600 blurb (two lines) · 12px ·
//       four icon rows 10px apart · 20px · ₹899 (16/600 gray-700) beside the
//       13 gray-500 struck-through list price
//   lg  (31286:70998) 280 × 332, 12px radius, p 16: "Current plan" (14/500)
//       · 8px · the struck 20/600 price with a /mo tail and an amber
//       "Free trial" badge, over 13/500 gray-500 expiry · 16px · "Can
//       support" (14/500) and three task rows · 20px · a gray-500 note row
//       and a full-width subtle red "Upgrade" (28px)
//   xl  (33057:153504) 350 × 374, 12px radius, p 16, 24px gaps: 18/600
//       title over the 14/21 blurb · ₹499 with the struck 12px ₹2,499 and
//       12px "80% off" · "This course includes:" (16/500) and five 16/400 rows
//       30px apart · a full-width solid "Buy now" (32px)
import { Badge, Button } from '../../../src'
import alertIcon from '../assets/cards/icons/alert-circle.svg?raw'
import bookIcon from '../assets/cards/icons/book.svg?raw'
import calendarIcon from '../assets/cards/icons/calendar.svg?raw'
import callIcon from '../assets/cards/icons/call.svg?raw'
import certificatesIcon from '../assets/cards/icons/certificates.svg?raw'
import demandVideoIcon from '../assets/cards/icons/demand-video.svg?raw'
import emailIcon from '../assets/cards/icons/email.svg?raw'
import helpIcon from '../assets/cards/icons/help.svg?raw'
import peopleIcon from '../assets/cards/icons/people.svg?raw'
import tasksIcon from '../assets/cards/icons/tasks.svg?raw'
import timeIcon from '../assets/cards/icons/time.svg?raw'
import userIcon from '../assets/cards/icons/user.svg?raw'
import webIcon from '../assets/cards/icons/web.svg?raw'
import av1 from '../assets/cards/lc-av-1.png'
import av2 from '../assets/cards/lc-av-2.png'
import av3 from '../assets/cards/lc-av-3.png'
import logo from '../assets/cards/lc-logo.png'

const emit = defineEmits<{ upgrade: []; buy: [] }>()

const smRows = [
  { icon: calendarIcon, text: '13 May, 2025' },
  { icon: emailIcon, text: 'harish@gumroad.com' },
  { icon: userIcon, avatars: [av1, av2, av3] },
  { icon: callIcon, text: '+91 9988221819' },
]

const mdRows = [
  { icon: calendarIcon, text: '8 Aug - 12 Aug' },
  { icon: timeIcon, text: '9 - 10 PM' },
  { icon: webIcon, text: 'Online' },
  { icon: userIcon, text: 'Gowtham Raj' },
]

const lgRows = [
  'Supports 5 apps',
  'Upto 30 concurrent users',
  'Customizable dashboard',
]

const xlRows = [
  { icon: peopleIcon, text: '200+ enrolled' },
  { icon: demandVideoIcon, text: 'On demand course video' },
  { icon: bookIcon, text: '20 Lessons' },
  { icon: helpIcon, text: '4 Quiz topics' },
  { icon: certificatesIcon, text: 'Certificate of completion' },
]
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-8">
    <!-- sm -->
    <article class="espresso-list-card h-[168px] w-[268px] rounded-7">
      <header
        class="flex h-11 items-center gap-2 border-b border-outline-gray-1 px-3.5 py-3 dark:border-outline-gray-2"
      >
        <img :src="logo" alt="" class="size-5 shrink-0 rounded-[5px]" />
        <p
          class="flex h-4 min-w-0 items-center truncate text-base-semibold text-ink-gray-8"
        >
          Backups
        </p>
      </header>
      <div class="flex flex-col gap-3 px-4 py-3">
        <div
          v-for="(row, i) in smRows"
          :key="i"
          class="flex h-4 items-center gap-2"
        >
          <span class="size-4 shrink-0 text-ink-gray-6" v-html="row.icon" />
          <p v-if="row.text" class="min-w-0 truncate text-base text-ink-gray-6">
            {{ row.text }}
          </p>
          <span v-else class="flex">
            <img
              v-for="(a, j) in row.avatars"
              :key="j"
              :src="a"
              alt=""
              class="size-4 rounded-full shadow-[0_0_0_2px_var(--card-surface)]"
              :class="j > 0 ? '-ml-0.5' : ''"
            />
          </span>
        </div>
      </div>
    </article>

    <!-- md -->
    <article
      class="espresso-list-card h-[264px] w-[280px] justify-between rounded-6 p-3.5"
    >
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
          <Badge
            theme="green"
            variant="outline"
            size="md"
            class="self-start !border-outline-green-2"
          >
            8 seats available
          </Badge>
          <div class="flex flex-col gap-1">
            <p class="truncate text-lg-semibold text-ink-gray-8">
              Master Digital Product Design
            </p>
            <p class="line-clamp-2 text-p-base text-ink-gray-6">
              Digital products are more abstract and complex than any product
              we’ve designed before.
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-2.5">
          <div
            v-for="row in mdRows"
            :key="row.text"
            class="flex h-4 items-center gap-2"
          >
            <span class="size-4 shrink-0 text-ink-gray-6" v-html="row.icon" />
            <p class="min-w-0 truncate text-base text-ink-gray-6">
              {{ row.text }}
            </p>
          </div>
        </div>
      </div>
      <p class="flex h-[18px] items-baseline gap-1">
        <span class="text-lg-semibold text-ink-gray-7">₹899</span>
        <span class="text-sm text-ink-gray-5 line-through">₹1,200</span>
      </p>
    </article>

    <!-- lg -->
    <article
      class="espresso-list-card h-[332px] w-[280px] justify-between rounded-6 p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <p class="flex h-4 items-center text-base-medium text-ink-gray-7">
            Current plan
          </p>
          <div class="flex flex-col gap-1">
            <p class="flex h-[23px] items-center gap-2">
              <!-- one struck run in the file: the price with its /mo tail -->
              <span class="text-3xl-semibold text-ink-gray-7 line-through">
                ₹1,999<span class="text-sm text-ink-gray-5">/mo</span>
              </span>
              <Badge theme="amber" variant="subtle" size="md">Free trial</Badge>
            </p>
            <p
              class="flex h-[15px] items-center text-sm-medium text-ink-gray-5"
            >
              Expiring in 7 days
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <p class="flex h-4 items-center text-base-medium text-ink-gray-7">
            Can support
          </p>
          <div class="flex flex-col gap-3">
            <div
              v-for="row in lgRows"
              :key="row"
              class="flex h-4 items-center gap-2"
            >
              <span
                class="size-4 shrink-0 text-ink-gray-7"
                v-html="tasksIcon"
              />
              <p class="min-w-0 truncate text-base text-ink-gray-7">
                {{ row }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex h-4 items-center gap-2">
          <span class="size-4 shrink-0 text-ink-gray-5" v-html="alertIcon" />
          <p class="min-w-0 truncate text-base text-ink-gray-5">
            Free trial ends in 7 days
          </p>
        </div>
        <Button
          variant="subtle"
          theme="red"
          size="sm"
          class="w-full"
          @click="emit('upgrade')"
        >
          Upgrade
        </Button>
      </div>
    </article>

    <!-- xl -->
    <article
      class="espresso-list-card h-[374px] w-[350px] justify-between rounded-6 p-4"
    >
      <div class="flex flex-col gap-[15px]">
        <div class="flex flex-col gap-1">
          <p class="truncate text-2xl-semibold text-ink-gray-7">
            Introducing Frappe LMS
          </p>
          <p class="line-clamp-2 text-p-base text-ink-gray-6">
            Digital products are more abstract and complex than any product
            we've designed before. People can touch them.
          </p>
        </div>
        <p class="flex h-[21px] items-baseline gap-2">
          <span class="text-2xl-semibold text-ink-gray-7">₹499</span>
          <!-- both runs are 12px in the file, not 14 -->
          <span class="flex items-baseline gap-1.5 text-xs">
            <span class="text-ink-gray-5 line-through">₹2,499</span>
            <span class="text-ink-gray-8">80% off</span>
          </span>
        </p>
        <div class="flex flex-col gap-3">
          <p class="flex h-[18px] items-center text-lg-medium text-ink-gray-7">
            This course includes:
          </p>
          <div class="flex flex-col gap-3">
            <div
              v-for="row in xlRows"
              :key="row.text"
              class="flex h-[18px] items-center gap-2"
            >
              <span class="size-4 shrink-0 text-ink-gray-7" v-html="row.icon" />
              <p class="min-w-0 truncate text-lg text-ink-gray-7">
                {{ row.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button variant="solid" size="md" class="w-full" @click="emit('buy')"
        >Buy now</Button
      >
    </article>
  </div>
</template>

<style>
/* Same shell as the default cards: a raised surface behind a hairline, one
   step lower in dark. `--card-surface` follows it, so the avatar group in
   the sm card punches the card's own colour. */
.espresso-list-card {
  --card-surface: var(--surface-elevation-2);
  background-color: var(--card-surface);
  @apply flex flex-col overflow-hidden border border-outline-gray-1;
}
[data-theme='dark'] .espresso-list-card {
  --card-surface: var(--surface-elevation-1);
}
</style>
