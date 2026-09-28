<script setup lang="ts">
// One deal (deals-kanban, 31739:28633): a 252 × 172 card on the first
// elevation, 16px radius, the sm shadow, 10px between its parts and 12px
// under. Its head is a 44px cell ruled beneath — a 20px org logo with 5px
// corners · 8px · the 14 medium gray-700 name, at px 14 — and its body four
// 16px rows 14px apart, at px 16: a 16px gray-600 glyph · 8px · the 14
// regular gray-600 detail. The owner row puts a 16px disc with the owner's
// 11px initial, on gray-100, between the glyph and the name.
// The file fills the card with surface-base, which in dark is the very
// colour the board sits on; elevation-1 is the same white in light and the
// first step up in dark.
import EIcon from '../../espresso-sidebar/EIcon.vue'
import type { Deal } from './deals'

defineProps<{ deal: Deal }>()

const logos = import.meta.glob<string>('../assets/kanban/logo-*.png', {
  import: 'default',
  eager: true,
})
const logo = (file: string) => logos[`../assets/kanban/${file}`]
</script>

<template>
  <article
    class="flex w-[252px] flex-col gap-2.5 rounded-7 bg-surface-elevation-1 pb-3 shadow-sm"
    :aria-label="deal.org"
  >
    <header
      class="flex h-11 items-center gap-2 border-b border-outline-gray-1 px-3.5"
    >
      <img
        :src="logo(deal.logo)"
        alt=""
        class="size-5 shrink-0 rounded-2 object-cover"
      />
      <span
        class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-7"
      >
        {{ deal.org }}
      </span>
    </header>
    <div class="flex flex-col gap-3.5 px-4 text-base leading-4 text-ink-gray-6">
      <p class="flex h-4 items-center gap-2 leading-4">
        <EIcon name="calender" class="size-4 shrink-0" />
        <span class="min-w-0 truncate">{{ deal.date }}</span>
      </p>
      <p class="flex h-4 items-center gap-2 leading-4">
        <EIcon name="email" class="size-4 shrink-0" />
        <span class="min-w-0 truncate">{{ deal.email }}</span>
      </p>
      <p class="flex h-4 items-center gap-2 leading-4">
        <EIcon name="agent" class="size-4 shrink-0" />
        <span
          class="flex size-4 shrink-0 items-center justify-center rounded-full bg-surface-gray-2 text-[11px] font-medium leading-none text-ink-gray-7"
          aria-hidden="true"
        >
          {{ deal.initial }}
        </span>
        <span class="min-w-0 truncate">{{ deal.agent }}</span>
      </p>
      <p class="flex h-4 items-center gap-2 leading-4">
        <EIcon name="call" class="size-4 shrink-0" />
        <span class="min-w-0 truncate">{{ deal.phone }}</span>
      </p>
    </div>
  </article>
</template>
