<script setup lang="ts">
// One deal, as the Frappe CRM board draws it (Frappe-CRM › deals-board view,
// 11527:137169): 268 × 172 on white, 16px corners, no hairline, under the
// CRM file's own sm shadow — 0 1 3 and a 0 0 1 ring, both at 14%. The
// library's sm ring is 20% with an inner highlight, which collects under
// the card's foot as a line. A 44px head (py 12 · px 14) ruled beneath by a 1px gray-100
// line inside it — the 20px org logo with 5px corners · 8px · the 14 medium
// gray-700 name. Then, at px 16, four 16px rows 14px apart — a 16px gray-600
// glyph · 8px · the 14 gray-600 value — for the date, the email, the owner
// (a 16px avatar, a photo or the initial on gray-100, · 8px · the name) and
// the phone, with 12px under. Icons are the file's own.
// In dark the card takes the first elevation, so it stands off the board.
import { Avatar } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import calendarIcon from '../assets/cards/icons/calendar.svg?raw'
import callIcon from '../assets/cards/icons/call.svg?raw'
import emailIcon from '../assets/cards/icons/email.svg?raw'
import type { Deal } from './deals'

defineProps<{ deal: Deal; photo?: string }>()

const logos = import.meta.glob<string>('../assets/kanban/logo-*.png', {
  import: 'default',
  eager: true,
})
const logo = (file: string) => logos[`../assets/kanban/${file}`]
</script>

<template>
  <article
    class="flex w-[268px] flex-col gap-2.5 rounded-7 bg-surface-elevation-1 pb-3 shadow-[0_1px_3px_rgba(0,0,0,0.14),0_0_1px_rgba(0,0,0,0.14)]"
    :aria-label="deal.org"
  >
    <header
      class="flex h-11 items-center gap-2 border-b border-outline-gray-1 px-3.5"
    >
      <img
        :src="logo(deal.logo)"
        alt=""
        class="size-5 shrink-0 rounded-[5px] object-cover"
      />
      <p
        class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-7"
      >
        {{ deal.org }}
      </p>
    </header>
    <div class="flex flex-col gap-3.5 px-4 text-base leading-4 text-ink-gray-6">
      <p class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0" v-html="calendarIcon" />
        <span class="min-w-0 truncate">{{ deal.date }}</span>
      </p>
      <p class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0" v-html="emailIcon" />
        <span class="min-w-0 truncate">{{ deal.email }}</span>
      </p>
      <p class="flex h-4 items-center gap-2">
        <EIcon name="agent" class="size-4 shrink-0" />
        <Avatar
          :image="photo"
          :label="deal.agent"
          size="xs"
          shape="circle"
          class="shrink-0"
        />
        <span class="min-w-0 truncate">{{ deal.agent }}</span>
      </p>
      <p class="flex h-4 items-center gap-2">
        <span class="size-4 shrink-0" v-html="callIcon" />
        <span class="min-w-0 truncate">{{ deal.phone }}</span>
      </p>
    </div>
  </article>
</template>
