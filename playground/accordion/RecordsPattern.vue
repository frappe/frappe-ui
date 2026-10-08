<script setup lang="ts">
// Records (node 35859:56059): a company's linked records, one accordion row
// per organisation, its calls inside. Built on frappe-ui's Accordion
// (experimental) — reka's root, items, triggers and the animated panel —
// with its look set to the file's:
//
//   width      700, the Course content card's (the user's call 2026-10-08 —
//              the file's 580, and its "Records" label, gave way to the
//              page's own section title)
//   row        40 tall (6 + a 28 cell + 6), no rule between rows; the
//              file's small-down chevron (16, ink-gray-6) first, at the
//              row's left edge — where the library puts its own chevron
//              last, so that one is hidden and the file's goes in the
//              label slot — turned up when open
//   cell       8 in: the company's 16px logo, 8, its name in text/base/medium
//              ink-gray-7, 6, the domain at 12 ink-gray-5
//              on the name's baseline
//   suffix     a lg subtle gray Badge, the file's org glyph before
//              "Organisation"
//   panel      the calls, 40 tall each, 16 in: the call's glyph (16) and
//              its title at 14 ink-gray-6 — a missed call in ink-red-6 —
//              then 6, a vertical Divider (20 of the 28), 8, and who was on
//              it: 20px Avatars overlapping by 2, each in a 2px ring of the
//              surface, the first on top
import { Avatar, Badge, Divider } from '../../src'
import { Accordion } from '../../experimental/Accordion'
import AccordionIcon from './AccordionIcon.vue'

const logos = import.meta.glob<string>('./images/logo-*.png', {
  query: '?url',
  import: 'default',
  eager: true,
})
const faces = import.meta.glob<string>('./images/face-*.png', {
  query: '?url',
  import: 'default',
  eager: true,
})
const logo = (k: string) => logos[`./images/logo-${k}.png`]
const face = (n: number) => faces[`./images/face-${n}.png`]

type Call = {
  title: string
  kind: 'incoming' | 'outgoing' | 'missed'
  people: number[]
}
type Record = {
  value: string
  title: string
  domain: string
  logo: string
  calls: Call[]
}

// the file's six organisations, each with calls to show when opened —
// Dropbox's are the file's, the rest are made up in its manner
const records: Record[] = [
  {
    value: 'zendesk',
    title: 'Zendesk',
    domain: 'Zendesk.com',
    logo: 'zendesk',
    calls: [
      { title: 'Onboarding call', kind: 'outgoing', people: [3, 1] },
      { title: 'Support escalation', kind: 'incoming', people: [4, 2, 5] },
    ],
  },
  {
    value: 'webflow',
    title: 'Webflow',
    domain: 'Webflowindia.com',
    logo: 'webflow',
    calls: [
      { title: 'Renewal discussion', kind: 'incoming', people: [2, 6] },
      { title: 'Missed call', kind: 'missed', people: [7] },
    ],
  },
  {
    value: 'timeless',
    title: 'Timeless',
    domain: 'timeless.co',
    logo: 'timeless',
    calls: [{ title: 'Design review', kind: 'outgoing', people: [1, 3, 4] }],
  },
  {
    value: 'dropbox',
    title: 'Dropbox',
    domain: 'dropbox.com',
    logo: 'dropbox',
    calls: [
      { title: 'Weekly discussion', kind: 'incoming', people: [1, 2, 3, 4] },
      { title: 'Direct call', kind: 'outgoing', people: [5, 6] },
      { title: 'Missed call', kind: 'missed', people: [7, 8] },
    ],
  },
  {
    value: 'copper',
    title: 'Copper',
    domain: 'Cooper.co',
    logo: 'copper',
    calls: [
      { title: 'Pricing call', kind: 'outgoing', people: [5, 8] },
      { title: 'Missed call', kind: 'missed', people: [6] },
      { title: 'Follow-up', kind: 'incoming', people: [2, 7] },
    ],
  },
  {
    value: 'skullcandy',
    title: 'Skullcandy',
    domain: 'Skullcandy.com',
    logo: 'skullcandy',
    calls: [{ title: 'Intro call', kind: 'incoming', people: [8, 1] }],
  },
]
const recordOf = (value: string) => records.find((r) => r.value === value)!
</script>

<template>
  <div class="records w-[700px]">
    <Accordion
      :items="records"
      type="multiple"
      :default-value="['dropbox']"
      heading-tag="h4"
    >
      <template #item-label="{ item }">
        <span class="flex min-w-0 items-center">
          <AccordionIcon
            name="small-down"
            class="records-chevron size-4 text-ink-gray-6"
          />
          <span class="flex min-w-0 items-end gap-1.5 px-2">
            <span class="flex min-w-0 items-center gap-2">
              <img
                :src="logo(recordOf(item.value).logo)"
                alt=""
                class="size-4 shrink-0 rounded-full"
              />
              <span
                class="truncate text-base font-medium leading-4 text-ink-gray-7"
                >{{ item.title }}</span
              >
            </span>
            <span
              class="shrink-0 text-xs font-normal leading-[14px] text-ink-gray-5"
              >{{ recordOf(item.value).domain }}</span
            >
          </span>
        </span>
      </template>
      <template #item-suffix>
        <Badge size="lg" variant="subtle" theme="gray" label="Organisation">
          <template #prefix>
            <AccordionIcon name="org" class="size-3" />
          </template>
        </Badge>
      </template>
      <template #item-content="{ item }">
        <div
          v-for="call in recordOf(item.value).calls"
          :key="call.title"
          class="flex h-10 items-center gap-1.5 pl-4"
        >
          <span
            class="flex items-center gap-2 px-2"
            :class="
              call.kind === 'missed' ? 'text-ink-red-6' : 'text-ink-gray-6'
            "
          >
            <AccordionIcon :name="`call-${call.kind}`" class="size-4" />
            <span class="text-base leading-4">{{ call.title }}</span>
          </span>
          <span class="flex items-center gap-2">
            <Divider orientation="vertical" class="!h-5" />
            <span class="records-faces flex items-center">
              <Avatar
                v-for="(p, i) in call.people"
                :key="p"
                size="sm"
                shape="circle"
                :image="face(p)"
                :label="call.title"
                :style="{ zIndex: call.people.length - i }"
              />
            </span>
          </span>
        </div>
      </template>
    </Accordion>
  </div>
</template>

<style scoped>
/* the library's list: no rule between rows, the trigger the file's 40 row
   with no padding of its own (the cell inside carries its 8), and its own
   chevron at the end gone — the file's is first */
.records :deep([data-slot='root']) {
  --tw-divide-y-reverse: 0;
}
.records :deep([data-slot='root'] > [data-slot='item'] + [data-slot='item']) {
  border-top-width: 0;
}
.records :deep([data-slot='trigger']) {
  height: 40px;
  padding: 0;
  gap: 0;
  border-radius: 0;
}
.records :deep([data-slot='trigger'] > .lucide-chevron-down) {
  display: none;
}
.records :deep([data-slot='trigger'] .records-chevron) {
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}
.records :deep([data-slot='trigger'][data-state='open'] .records-chevron) {
  transform: rotate(180deg);
}
/* the label's wrapper truncates; the row lays out inside it */
.records :deep([data-slot='trigger'] .truncate:has(> span)) {
  overflow: visible;
}
/* the panel: no padding of its own, the calls carry theirs */
.records :deep([data-slot='content'] > div) {
  padding: 0;
}
/* faces overlap by 2, each ringed in the surface */
.records-faces > * {
  box-shadow: 0 0 0 2px var(--surface-base);
  border-radius: 9999px;
}
.records-faces > * + * {
  margin-left: -2px;
}
</style>
