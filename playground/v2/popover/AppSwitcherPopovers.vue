<script setup lang="ts">
// Figma: espresso-2.0 › Popover › app switcher — side by side on the raised
// popover surface, lg shadow; the current app sits on gray-2, the others
// on gray-1 while hovered:
//   grid  (30873:37803) 310px, 16px radius, p 10: 4 across, 6px apart, of
//         68 × 67 tiles (12px radius, pt 8 · px 4 · pb 8): 32px logo · 6px ·
//         11 gray-700 name
//   list  (30873:37802) 280px, 12px radius, p 8: two 128px columns, 8px
//         apart, of 40px rows (10px radius, px 10): 24px logo · 8px · 14
//         gray-700 name
import { ref } from 'vue'
import builder from '../assets/popover/app-builder.png'
import cloud from '../assets/popover/app-cloud.png'
import crm from '../assets/popover/app-crm.png'
import drive from '../assets/popover/app-drive.png'
import erpnext from '../assets/popover/app-erpnext.png'
import gameplan from '../assets/popover/app-gameplan.png'
import helpdesk from '../assets/popover/app-helpdesk.png'
import insight from '../assets/popover/app-insight.png'
import lms from '../assets/popover/app-lms.png'
import mail from '../assets/popover/app-mail.png'
import slide from '../assets/popover/app-slide.png'

const emit = defineEmits<{ open: [app: string] }>()

interface App {
  name: string
  logo: string
}

const GRID: App[] = [
  { name: 'Cloud', logo: cloud },
  { name: 'Drive', logo: drive },
  { name: 'Helpdesk', logo: helpdesk },
  { name: 'Gameplan', logo: gameplan },
  { name: 'CRM', logo: crm },
  { name: 'Insight', logo: insight },
  { name: 'LMS', logo: lms },
  { name: 'Builder', logo: builder },
  { name: 'ERP Next', logo: erpnext },
  { name: 'Slide', logo: slide },
  { name: 'Mail', logo: mail },
  { name: 'Framework', logo: erpnext },
]

// the list reads down each column
const LIST: App[][] = [
  [
    { name: 'ERP', logo: erpnext },
    { name: 'Framework', logo: erpnext },
    { name: 'CRM', logo: crm },
    { name: 'Learning', logo: lms },
    { name: 'Helpdesk', logo: helpdesk },
    { name: 'Builder', logo: builder },
  ],
  [
    { name: 'Mail', logo: mail },
    { name: 'Drive', logo: drive },
    { name: 'Cloud', logo: cloud },
    { name: 'Gameplan', logo: gameplan },
    { name: 'Books', logo: lms },
    { name: 'Slide', logo: slide },
  ],
]

const gridCurrent = ref('Cloud')
const listCurrent = ref('Mail')

function open(which: 'grid' | 'list', app: App) {
  if (which === 'grid') gridCurrent.value = app.name
  else listCurrent.value = app.name
  emit('open', app.name)
}
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-10">
    <!-- grid -->
    <nav
      class="w-[310px] rounded-7 bg-surface-elevation-2 p-2.5 shadow-lg"
      aria-label="Switch app"
    >
      <ul class="grid grid-cols-4 gap-1.5">
        <li v-for="app in GRID" :key="app.name">
          <button
            type="button"
            class="flex h-[67px] w-full flex-col items-center gap-1.5 rounded-6 px-1 pb-2 pt-2 transition-colors"
            :class="
              gridCurrent === app.name
                ? 'bg-surface-gray-2 dark:bg-surface-gray-3'
                : 'hover:bg-surface-gray-1 dark:hover:bg-surface-gray-2'
            "
            :aria-current="gridCurrent === app.name ? 'page' : undefined"
            @click="open('grid', app)"
          >
            <img :src="app.logo" alt="" class="size-8 rounded-[7px]" />
            <span class="w-full truncate text-center text-2xs text-ink-gray-7">
              {{ app.name }}
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- list -->
    <nav
      class="flex w-[280px] gap-2 rounded-6 bg-surface-elevation-2 p-2 shadow-lg"
      aria-label="Switch app"
    >
      <ul v-for="(column, i) in LIST" :key="i" class="flex w-32 flex-col gap-px">
        <li v-for="app in column" :key="app.name">
          <button
            type="button"
            class="flex h-10 w-full items-center gap-2 rounded-5 px-2.5 transition-colors"
            :class="
              listCurrent === app.name
                ? 'bg-surface-gray-2 dark:bg-surface-gray-3'
                : 'hover:bg-surface-gray-1 dark:hover:bg-surface-gray-2'
            "
            :aria-current="listCurrent === app.name ? 'page' : undefined"
            @click="open('list', app)"
          >
            <img :src="app.logo" alt="" class="size-6 shrink-0 rounded-[5px]" />
            <span class="truncate text-base text-ink-gray-7">{{ app.name }}</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
