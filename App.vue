<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppShell from './playground/AppShell.vue'
import SettingsModalPatterns from './playground/v2/SettingsModalPatterns.vue'
import TablePatterns from './playground/components/TablePatterns.vue'
import ActivityPatterns from './playground/activity/ActivityPatterns.vue'
import CalendarPatterns from './playground/calendar/CalendarPatterns.vue'
import V1 from './playground/v1/SettingsModalPatterns.vue'

// The whole playground lives under one address, so nothing of ours sits at the
// repo's own dev root and the thing has a single link to hand round.
const BASE = '/playground'

// No router here, so each pattern is a path under that base and the sidebar
// links to it. `/v1` is the frozen first round of the settings modal — still
// here if we need it, deliberately not listed.
const pages = [
  {
    path: '/settings-modal',
    label: 'Settings modal',
    icon: 'lucide-settings',
    component: SettingsModalPatterns,
    // `''` is the base itself; `/v2` was this page's address while the round
    // was being built.
    aliases: ['/v2', ''],
  },
  {
    path: '/tables',
    label: 'Table',
    icon: 'lucide-table-properties',
    component: TablePatterns,
  },
  {
    path: '/activity',
    label: 'Activity',
    icon: 'lucide-activity',
    component: ActivityPatterns,
  },
  {
    path: '/calendar',
    label: 'Calendar',
    icon: 'lucide-calendar',
    component: CalendarPatterns,
  },
]

// Each row is a real link — middle-click and "open in new tab" keep working —
// so the sidebar needs the address, not just the key.
const links = pages.map((page) => ({ ...page, href: BASE + page.path }))

/**
 * The part of the address that belongs to us, or `null` for anything outside
 * the playground. `/playground` itself comes back as `''`, which is the first
 * page's alias.
 */
function route(pathname) {
  const trimmed = pathname.replace(/\/+$/, '')
  if (trimmed === BASE) return ''
  if (trimmed.startsWith(`${BASE}/`)) return trimmed.slice(BASE.length)
  return null
}

const path = ref(route(window.location.pathname) ?? '')

const current = computed(
  () =>
    pages.find((page) =>
      [page.path, ...(page.aliases ?? [])].includes(path.value),
    ) ?? pages[0],
)

/**
 * The sidebar swaps the page in place rather than loading it: a reload throws
 * away the parsed app and repaints from scratch, which reads as a flash of the
 * wrong colours before `useColorScheme` gets to run. The address still changes,
 * so links and the back button behave as they did.
 */
function open(to) {
  if (to === path.value) return
  window.history.pushState({}, '', BASE + to)
  path.value = to
  window.scrollTo(0, 0)
}

const follow = () => (path.value = route(window.location.pathname) ?? '')

onMounted(() => {
  // Opened at the repo root, or anywhere else that isn't ours: move the
  // address to the base rather than answering from a path we don't own.
  if (route(window.location.pathname) === null) {
    window.history.replaceState({}, '', BASE)
  }
  window.addEventListener('popstate', follow)
})
onBeforeUnmount(() => window.removeEventListener('popstate', follow))
</script>

<template>
  <V1 v-if="path === '/v1'" />

  <AppShell v-else :pages="links" :current="current.path" @open="open">
    <component :is="current.component" :key="current.path" />
  </AppShell>
</template>
