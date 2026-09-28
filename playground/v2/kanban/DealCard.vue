<script setup lang="ts">
// One deal, as the file's list card, size sm (espresso-2.0 › card ›
// type=list, size=sm, variant=outline, 31286:71010): 268 × 168, 16px
// radius, the raised card surface behind a 1px outline-gray-1 hairline.
// A 44px header (py 12 · px 14, ruled beneath) of the 20px org logo with
// 5px corners · 8px · the 14 medium gray-800 name (the kanban screen's
// weight; the card component's own is semibold); then py 12 · px 16 rows
// 12px apart — a 16px gray-600 icon · 8px · the 14 gray-600 value — for the
// date, the email, the people (frappe-ui avatars, 16px, overlapping 2px,
// each ringed in the card's colour) and the phone. The icons and the
// photos are the file's own. The hairline sits inside the file's box, so
// the paddings are a pixel short of its 14 and 16 and land on its x.
import '../cards/listCard.css'
import { Avatar } from '../../../src'
import calendarIcon from '../assets/cards/icons/calendar.svg?raw'
import callIcon from '../assets/cards/icons/call.svg?raw'
import emailIcon from '../assets/cards/icons/email.svg?raw'
import userIcon from '../assets/cards/icons/user.svg?raw'
import av1 from '../assets/cards/lc-av-1.png'
import av2 from '../assets/cards/lc-av-2.png'
import av3 from '../assets/cards/lc-av-3.png'
import type { Deal } from './deals'

defineProps<{ deal: Deal }>()

const logos = import.meta.glob<string>('../assets/kanban/logo-*.png', {
  import: 'default',
  eager: true,
})
const logo = (file: string) => logos[`../assets/kanban/${file}`]
const PEOPLE = [
  { image: av1, label: 'Owner' },
  { image: av2, label: 'Sales' },
  { image: av3, label: 'Support' },
]
</script>

<template>
  <article
    class="espresso-list-card h-[168px] w-[268px] rounded-7"
    :aria-label="deal.org"
  >
    <header
      class="-mt-px flex h-11 items-center gap-2 border-b border-outline-gray-1 px-[13px] py-3 dark:border-outline-gray-2"
    >
      <img
        :src="logo(deal.logo)"
        alt=""
        class="size-5 shrink-0 rounded-[5px] object-cover"
      />
      <p
        class="flex h-4 min-w-0 items-center truncate text-base-medium text-ink-gray-8"
      >
        {{ deal.org }}
      </p>
    </header>
    <div class="flex flex-col gap-3 px-[15px] py-3">
      <div class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0 text-ink-gray-6" v-html="calendarIcon" />
        <p class="min-w-0 truncate text-base leading-4 text-ink-gray-6">
          {{ deal.date }}
        </p>
      </div>
      <div class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0 text-ink-gray-6" v-html="emailIcon" />
        <p class="min-w-0 truncate text-base leading-4 text-ink-gray-6">
          {{ deal.email }}
        </p>
      </div>
      <div class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0 text-ink-gray-6" v-html="userIcon" />
        <span class="flex" :aria-label="deal.agent" role="img">
          <Avatar
            v-for="(person, j) in PEOPLE"
            :key="j"
            :image="person.image"
            :label="person.label"
            size="xs"
            shape="circle"
            class="ring-2 ring-[--card-surface]"
            :class="j > 0 ? '-ml-0.5' : ''"
          />
        </span>
      </div>
      <div class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0 text-ink-gray-6" v-html="callIcon" />
        <p class="min-w-0 truncate text-base leading-4 text-ink-gray-6">
          {{ deal.phone }}
        </p>
      </div>
    </div>
  </article>
</template>
