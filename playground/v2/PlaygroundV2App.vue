<script setup lang="ts">
import {
  computed,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  type Component,
} from 'vue'
import {
  Breadcrumbs,
  Button,
  Dropdown,
  Popover,
  useColorScheme,
} from '../../src'
import ControlSelect from '../controls/ControlSelect.vue'
import ControlToggle from '../controls/ControlToggle.vue'
import { headerTypes, subheaderTypes } from '../espresso-header/variants'
import ListPage from './list/ListPage.vue'
import PopoverPage from './popover/PopoverPage.vue'
import CardsPage from './cards/CardsPage.vue'
import ToastPage from './toast/ToastPage.vue'
// Figma 35185:59381 — the app's own mark, in place of the Frappe logo
import appLogo from './assets/app-logo.svg'
import EIcon from '../espresso-sidebar/EIcon.vue'
import SidebarMenu from '../espresso-sidebar/SidebarMenu.vue'
import SidebarRow from '../espresso-sidebar/SidebarRow.vue'
import { scenarios, type ScenarioId } from '../espresso-sidebar/scenarios'
import trayAvatar from '../espresso-sidebar/avatars/avatar-lg-status.png'
// the sidebar's own icons, exported from the file
import sbAlert from './assets/sidebar/alert-circle.svg?raw'
import sbCloud from './assets/sidebar/cloud.svg?raw'
import sbHelp from './assets/sidebar/help.svg?raw'
import sbSettings from './assets/sidebar/settings.svg?raw'
import sbSidebarToggle from './assets/sidebar/sidebar-collapse.svg?raw'
import sbZap from './assets/sidebar/zap.svg?raw'
// the sidebar rows' icons, exported from the file (icon/line/…)
import navChevron from './assets/nav/chevron.svg?raw'
import navCards from './assets/nav/cards.svg?raw'
import navList from './assets/nav/list.svg?raw'
import navModal from './assets/nav/modal.svg?raw'
import navPopover from './assets/nav/popover.svg?raw'
import navSidebarHeader from './assets/nav/sidebar-header.svg?raw'
import navToast from './assets/nav/toast.svg?raw'
import ApplicableCouponsModal from './modals/ApplicableCouponsModal.vue'
import CallDetailsModal from './modals/CallDetailsModal.vue'
import DeleteProjectModal from './modals/DeleteProjectModal.vue'
import EditGeneralModal from './modals/EditGeneralModal.vue'
import EditFieldLayoutModal from './modals/EditFieldLayoutModal.vue'
import EditModal from './modals/EditModal.vue'
import EmailViewModal from './modals/EmailViewModal.vue'
import InviteMembersModal from './modals/InviteMembersModal.vue'
import LearningConsistencyModal from './modals/LearningConsistencyModal.vue'
import NewContactModal from './modals/NewContactModal.vue'
import NewMessageModal from './modals/NewMessageModal.vue'
import NewTaskModal from './modals/NewTaskModal.vue'
import NewTicketModal from './modals/NewTicketModal.vue'
import NewTicketWideModal from './modals/NewTicketWideModal.vue'
import QuickEditModal from './modals/QuickEditModal.vue'
import SearchModal from './modals/SearchModal.vue'
import StreakModal from './modals/StreakModal.vue'
import UploadImageModal from './modals/UploadImageModal.vue'

type ModalEntry = { id: string; label: string; component: Component }

// Wider sets reuse a modal at another `width`.
const atWidth =
  (component: Component, width: string): Component =>
  (_, { attrs }) =>
    h(component, { ...attrs, width })

const modals440: ModalEntry[] = [
  { id: 'delete', label: 'Delete project', component: DeleteProjectModal },
  { id: 'upload', label: 'Upload image', component: UploadImageModal },
  { id: 'new-ticket', label: 'New ticket', component: NewTicketModal },
  { id: 'invite', label: 'Invite members', component: InviteMembersModal },
  { id: 'edit', label: 'Modal + 3 buttons', component: EditModal },
  { id: 'edit-general', label: 'Edit General', component: EditGeneralModal },
  {
    id: 'coupons',
    label: 'Applicable coupons',
    component: ApplicableCouponsModal,
  },
  {
    id: 'learning',
    label: 'Learning consistency',
    component: LearningConsistencyModal,
  },
  { id: 'streak', label: 'Streak', component: StreakModal },
]

const modals600: ModalEntry[] = [
  {
    id: 'delete-600',
    label: 'Delete project',
    component: atWidth(DeleteProjectModal, '600'),
  },
  { id: 'call-details', label: 'Call details', component: CallDetailsModal },
  { id: 'search', label: 'Search', component: SearchModal },
  { id: 'new-message', label: 'New message', component: NewMessageModal },
  {
    id: 'email-view',
    label: 'Expanding our inventory',
    component: EmailViewModal,
  },
  { id: 'new-contact', label: 'New contact', component: NewContactModal },
  { id: 'new-task', label: 'New task', component: NewTaskModal },
]

const modals720: ModalEntry[] = [
  { id: 'new-ticket-720', label: 'New ticket', component: NewTicketWideModal },
  {
    id: 'call-details-720',
    label: 'Call details',
    component: atWidth(CallDetailsModal, '720'),
  },
  { id: 'search-720', label: 'Search', component: atWidth(SearchModal, '720') },
  {
    id: 'field-layout',
    label: 'Edit field layout',
    component: EditFieldLayoutModal,
  },
]

const modals960: ModalEntry[] = [
  {
    id: 'quick-edit',
    label: 'Notes - compose & view',
    component: QuickEditModal,
  },
]

const sizes = [
  { width: '440px', modals: modals440 },
  { width: '600px', modals: modals600 },
  { width: '720px', modals: modals720 },
  { width: '960px', modals: modals960 },
]

const modals = [...modals440, ...modals600, ...modals720, ...modals960]

// Pages in the sidebar. Modal, Sidebar & Header and List are built so far.
const pages = [
  'Modal',
  'Sidebar & Header',
  'List',
  'Popover',
  'Cards',
  'Toast',
].map((label) => ({ id: label.toLowerCase().replace(/\W+/g, '-'), label }))

// The app tray down the far left, as a Frappe app shows it: this playground
// is the app in front, the rest are the other apps in the workspace.
const TRAY_APPS: { logo: string; label: string; scenario: ScenarioId }[] = [
  { logo: 'calendar', label: 'Calendar', scenario: 'calendar' },
  { logo: 'crm', label: 'CRM', scenario: 'crm' },
  { logo: 'helpdesk', label: 'Helpdesk', scenario: 'helpdesk' },
  { logo: 'drive', label: 'Drive', scenario: 'drive' },
  { logo: 'lms', label: 'LMS', scenario: 'lms' },
  { logo: 'mail', label: 'Mail', scenario: 'mail' },
]

// Picking an app in the tray swaps the sidebar for that app's own menu, as
// the design's Helpdesk screen shows (35167:69809). The logo at the top of
// the tray opens the default app sidebar; the one under Mail opens this
// playground's components.
type TrayPick = ScenarioId | 'components'
const app = ref<TrayPick>('components')
// the workspace the cell names: this playground, or the app in front
const appTitle = computed(() => appScenario.value?.title ?? 'Frappe UI')

const appScenario = computed(() =>
  app.value === 'components'
    ? undefined
    : scenarios.find((s) => s.id === app.value),
)

// Figma 35143:169789 gives each row its 16px line icon. The icons for the
// pages that were dropped stay in assets/nav, ready for their page.
const NAV_ICONS: Record<string, string> = {
  modal: navModal,
  'sidebar-header': navSidebarHeader,
  list: navList,
  popover: navPopover,
  cards: navCards,
  toast: navToast,
}

// Drives `<html data-theme>`, so every token on the page — and in the
// modals — flips. The designs are light, so every load starts light, even if
// dark was picked last time; `?theme=dark` opens it dark.
const params = new URLSearchParams(window.location.search)
const { resolvedColorScheme, setColorScheme } = useColorScheme()
setColorScheme(params.get('theme') === 'dark' ? 'dark' : 'light')

// Crossfade the whole page between themes where the browser supports view
// transitions; elsewhere (and under reduced motion) it switches instantly.
const darkMode = computed({
  get: () => resolvedColorScheme.value === 'dark',
  set: () => toggleTheme(),
})

function toggleTheme() {
  const next = resolvedColorScheme.value === 'dark' ? 'light' : 'dark'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => {
      finished: Promise<void>
      skipTransition: () => void
    }
  }
  // A crossfade holds a snapshot of the old theme over the page while it
  // runs. If that snapshot is left behind — the tab goes to the background
  // mid-flight, a long task eats the frame — the old colours stay painted
  // over the new ones, so the transition is skipped unless the page is
  // visible, and dropped if it has not finished in time.
  if (doc.startViewTransition && !reduce && !document.hidden) {
    const transition = doc.startViewTransition(() => setColorScheme(next))
    const bail = window.setTimeout(() => transition.skipTransition(), 600)
    transition.finished
      .catch(() => setColorScheme(next))
      .finally(() => clearTimeout(bail))
  } else {
    setColorScheme(next)
  }
}

// `?modal=<id>` opens that modal on load, on the screen for its width —
// handy for reviewing one frame.
const initial = params.get('modal')
const initialModalWidth = sizes.find((s) =>
  s.modals.some((m) => m.id === initial),
)?.width

// `?page=<id>` opens a sidebar page, e.g. `?page=sidebar-header`.
const initialPage = params.get('page')
const page = ref(
  pages.some((p) => p.id === initialPage) ? initialPage! : 'modal',
)
// a section param (`card`, `list`, `popover`, …) belongs to the page that
// reads it, so leaving that page drops it
const SECTION_PARAMS = ['card', 'list', 'popover', 'layout', 'modal']
watch(page, (id) => {
  const url = new URL(location.href)
  if (id === 'modal') url.searchParams.delete('page')
  else url.searchParams.set('page', id)
  for (const key of SECTION_PARAMS) url.searchParams.delete(key)
  history.replaceState(null, '', url)
})
// The rail is shown or hidden from the corner group (and from the sidebar's
// own Collapse row); fullscreen is the browser's, as the button says.
const sidebarOpen = ref(true)
const fullscreen = ref(false)

function toggleFullscreen() {
  const root = document.documentElement
  if (document.fullscreenElement) document.exitFullscreen()
  else root.requestFullscreen?.()
}
onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    fullscreen.value = !!document.fullscreenElement
  })
})
// ---- the sidebar pattern.
// The Sidebar & Header page has no sidebar of its own: the shell's own
// sidebar is the pattern, and the preview control in its header cell drives
// it — which app's menu it shows, whether it is collapsed to the 44px rail,
// whether the app tray is beside it — while the page draws the header bars
// underneath the breadcrumb.
const patternCollapsed = ref(false)
const patternTray = ref(true)
const showHeader = ref(true)
const headerType = ref(headerTypes[0].value)
const showSubheader = ref(true)
const subheaderType = ref(subheaderTypes[0].value)

const headerComponent = computed(
  () => headerTypes.find((v) => v.value === headerType.value)!.component,
)
const subheaderComponent = computed(
  () => subheaderTypes.find((v) => v.value === subheaderType.value)!.component,
)

// Settings has neither a collapsed variant nor the app tray, and its page
// carries no header bars — the same rule the v1 layout follows.
const inSettings = computed(() => app.value === 'settings')
watch(inSettings, (settings) => {
  if (!settings) return
  patternCollapsed.value = false
  patternTray.value = false
  showHeader.value = false
  showSubheader.value = false
})

// The App row picks what the sidebar is: this playground's components, or
// one of the apps — the same pick the tray makes.
const appOptions = [
  { label: 'Frappe UI', value: 'components' },
  ...scenarios.map((s) => ({ label: s.label, value: s.id })),
]
const appPick = computed({
  get: () => app.value as string,
  set: (value: string) => (app.value = value as TrayPick),
})

// 48px tray · 220px menu, or 44px once collapsed (35164:58913)
const sidebarWidth = computed(
  () => (patternTray.value ? 48 : 0) + (patternCollapsed.value ? 44 : 220),
)

// the rows an app shows on the rail; the components list falls back to its
// own icons
const collapsedRows = computed(
  () => appScenario.value?.collapsedRows ?? appScenario.value?.rows ?? [],
)

const headerOptions = headerTypes.map(({ value, label }) => ({ value, label }))
const subheaderOptions = subheaderTypes.map(({ value, label }) => ({
  value,
  label,
}))

// the header cell, full width or as the 28px logo on the rail
const cellClass = computed(() => [
  'flex h-8 shrink-0 items-center rounded-4 transition-colors hover:bg-surface-gray-2 data-[state=open]:bg-surface-gray-2',
  patternCollapsed.value
    ? 'w-7 justify-center self-center'
    : 'w-full gap-2 py-0.5 pl-2 pr-1',
])

const current = computed(() => pages.find((p) => p.id === page.value)!)

const open = reactive<Record<string, boolean>>(
  Object.fromEntries(modals.map((m) => [m.id, m.id === initial])),
)

// ---- the content outline on the right: the sections the page lays out,
// read from the DOM the way frappe-ui's docs outline does. The page marks
// its scroller `data-sections` and each screen `data-section`, so the shell
// needs nothing from the pages themselves.
const sections = ref<{ id: string; label: string }[]>([])
// the screens themselves, by id: an icon sprite can carry a <symbol id="form">,
// and document.getElementById would hand that back instead of the section
const screens = new Map<string, HTMLElement>()
const activeSection = ref<string>()
let observer: IntersectionObserver | undefined
const onScreen = new Set<string>()

function scanSections() {
  const scroller = document.querySelector<HTMLElement>('[data-sections]')
  const found = scroller
    ? // `:scope >` so a component's own sections — the emoji picker keeps
      // its categories that way — are not mistaken for the page's screens
      [...scroller.querySelectorAll<HTMLElement>(':scope > [data-section]')]
    : []
  sections.value = found.map((el) => ({
    id: el.id,
    label: el.dataset.label ?? el.id,
  }))
  screens.clear()
  for (const el of found) screens.set(el.id, el)
  observer?.disconnect()
  onScreen.clear()
  activeSection.value = found[0]?.id
  if (!scroller || !found.length) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target.id)
        else onScreen.delete(entry.target.id)
      }
      // the topmost screen in the band wins, so the mark never flickers
      activeSection.value =
        sections.value.find((s) => onScreen.has(s.id))?.id ??
        activeSection.value
    },
    { root: scroller, rootMargin: '-45% 0px -45% 0px' },
  )
  found.forEach((el) => observer!.observe(el))

  // `?popover=toolbar`, `?card=kpi`, `#toolbar` — open on that screen
  const q = new URLSearchParams(location.search)
  const wanted =
    location.hash.slice(1) ||
    (initialModalWidth ? `modal-${parseInt(initialModalWidth)}` : '') ||
    SECTION_PARAMS.map((k) => q.get(k)).find(Boolean) ||
    ''
  const target = found.find((el) => el.id === wanted)
  if (target) target.scrollIntoView({ block: 'start' })
}

// A mandatory snap container fights a programmatic smooth scroll — Chrome
// cancels a short hop and snaps back to where it started — so snapping is
// lifted for the trip and restored once the scroll ends.
let restoreSnap: number | undefined
function goToSection(id: string) {
  const scroller = document.querySelector<HTMLElement>('[data-sections]')
  const target = screens.get(id)
  if (!scroller || !target) return
  const top =
    target.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop
  scroller.style.scrollSnapType = 'none'
  scroller.scrollTo({ top, behavior: 'smooth' })
  activeSection.value = id
  const restore = () => {
    scroller.style.scrollSnapType = ''
    scroller.removeEventListener('scrollend', restore)
  }
  scroller.addEventListener('scrollend', restore)
  // scrollend is not everywhere yet; a timer closes the gap
  clearTimeout(restoreSnap)
  restoreSnap = window.setTimeout(restore, 900)
}

onMounted(() => nextTick(scanSections))
// a safety net for a page that renders without a transition hook firing
watch(page, () => setTimeout(scanSections, 260))
onUnmounted(() => observer?.disconnect())

// The header cell's menu, as Frappe apps have it: switch app, docs, about,
// cloud, settings — and the controls this playground needs, so the cell is
// where everything is driven from.
const appLogoIcon = (logo: string) => () =>
  h(EIcon, { name: `logo-${logo}`, class: 'size-4' })

const currentMark = {
  suffix: () =>
    h('span', {
      class: 'lucide-check size-4 text-ink-gray-7',
      'aria-label': 'Current app',
    }),
}

const appMenu = computed(() => [
  {
    group: 'App',
    hideLabel: true,
    options: [
      {
        label: 'Apps',
        icon: 'lucide-layout-grid',
        submenu: [
          {
            label: 'Frappe UI',
            icon: () => h('img', { src: appLogo, class: 'size-4' }),
            slots: app.value === 'components' ? currentMark : undefined,
            onClick: () => (app.value = 'components'),
          },
          ...TRAY_APPS.map((a) => ({
            label: a.label,
            icon: appLogoIcon(a.logo),
            slots: app.value === a.scenario ? currentMark : undefined,
            onClick: () => (app.value = a.scenario),
          })),
        ],
      },
      { label: 'Frappe Docs', icon: 'lucide-book-open' },
      { label: 'About', icon: 'lucide-info' },
      { label: 'Login to Frappe Cloud', icon: 'lucide-cloud' },
      { label: 'Settings', icon: 'lucide-settings' },
    ],
  },
  {
    group: 'Preview',
    hideLabel: true,
    options: [
      {
        label: 'Sidebar',
        icon: 'lucide-panel-left',
        switch: true,
        switchValue: sidebarOpen.value,
        onClick: (on: boolean) => (sidebarOpen.value = on),
      },
      {
        label: 'Dark mode',
        icon: 'lucide-moon',
        switch: true,
        switchValue: darkMode.value,
        onClick: () => toggleTheme(),
      },
    ],
  },
  {
    group: 'Account',
    hideLabel: true,
    options: [{ label: 'Log out', icon: 'lucide-log-out' }],
  },
])

// what the outline is a list of, per page
const OUTLINE_TITLES: Record<string, string> = {
  modal: 'Modal sizes',
  list: 'List types',
  popover: 'Popover types',
  cards: 'Card types',
}
const outlineTitle = computed(
  () => OUTLINE_TITLES[page.value] ?? 'On this page',
)

const crumbs = computed(() => [
  { label: 'Espresso 2.0' },
  { label: current.value.label },
])
</script>

<template>
  <!-- Figma: espresso-2.0 (34984:226091). The app frame: a 220px sidebar on
       surface-sidebar behind a hairline — #F8F8F8 in light, and in dark the
       file's fill is transparent (29752:48048), so the page shows through
       (p 8, its header cell 41 tall, items 28 tall and 2px apart), a 48px
       header ruled underneath (pl 12 · pr 20)
       carrying the breadcrumb, the page itself, and the content outline down
       the right — 150px rows, 30px in from the edge. The theme / expand
       group sits 20px from the bottom-right corner. -->
  <div class="flex h-screen bg-surface-base">
    <!-- Figma 35164:58913 — one 268px surface behind a hairline: the 48px
         app tray (p 10, 28px logos 12px apart, its own hairline) and the
         220px nav beside it (p 8 · pb 10) -->
    <div
      class="flex h-full shrink-0 overflow-hidden border-r border-outline-gray-1 bg-surface-sidebar transition-[width,opacity] duration-300 ease-out"
      :class="sidebarOpen ? 'opacity-100' : 'border-r-0 opacity-0'"
      :style="{ width: sidebarOpen ? `${sidebarWidth}px` : '0px' }"
      :inert="!sidebarOpen || undefined"
    >
      <!-- the tray slides its own width away when app navigation is off -->
      <div
        class="h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
        :style="{ width: patternTray ? '48px' : '0px' }"
      >
        <nav
          class="flex h-full w-12 shrink-0 flex-col justify-between border-r border-outline-gray-1 p-2.5"
          aria-label="Apps"
        >
          <span class="flex flex-col items-center gap-3">
            <!-- the app in front carries the 3.5px indicator -->
            <span class="relative">
              <span
                v-if="app === 'default'"
                aria-hidden="true"
                class="absolute -left-2.5 top-0 h-7 w-[3.5px] rounded-r-[3px] bg-surface-gray-6"
              />
              <button
                type="button"
                class="tray-app"
                aria-label="Frappe"
                title="Frappe"
                :aria-current="app === 'default' ? 'page' : undefined"
                @click="app = 'default'"
              >
                <img :src="appLogo" alt="" class="size-7" />
              </button>
            </span>
            <span class="w-7 border-t border-outline-gray-1" />
            <span v-for="a in TRAY_APPS" :key="a.logo" class="relative">
              <span
                v-if="app === a.scenario"
                aria-hidden="true"
                class="absolute -left-2.5 top-0 h-7 w-[3.5px] rounded-r-[3px] bg-surface-gray-6"
              />
              <button
                type="button"
                class="tray-app"
                :aria-label="a.label"
                :title="a.label"
                :aria-current="app === a.scenario ? 'page' : undefined"
                @click="app = a.scenario"
              >
                <EIcon :name="`logo-${a.logo}`" class="size-7" />
              </button>
            </span>
            <!-- under the apps: this playground's own components -->
            <span class="relative">
              <span
                v-if="app === 'components'"
                aria-hidden="true"
                class="absolute -left-2.5 top-0 h-7 w-[3.5px] rounded-r-[3px] bg-surface-gray-6"
              />
              <button
                type="button"
                class="tray-app"
                aria-label="Frappe UI"
                title="Frappe UI"
                :aria-current="app === 'components' ? 'page' : undefined"
                @click="app = 'components'"
              >
                <img :src="appLogo" alt="" class="size-7" />
              </button>
            </span>
          </span>

          <!-- settings and the account, at the foot of the tray -->
          <span class="flex flex-col items-center gap-3">
            <button
              type="button"
              class="flex size-7 items-center justify-center rounded-4 text-ink-gray-6 transition-colors hover:bg-surface-gray-2 hover:text-ink-gray-8"
              aria-label="Settings"
              title="Settings"
            >
              <span class="nav-icon size-4" v-html="sbSettings" />
            </button>
            <img
              :src="trayAvatar"
              alt="Sally Potter"
              class="size-[30px] max-w-none"
            />
          </span>
        </nav>
      </div>

      <div
        class="v2-scroll flex h-full shrink-0 flex-col gap-2 overflow-y-auto p-2 pb-2.5 transition-[width] duration-300 ease-out"
        :style="{ width: patternCollapsed ? '44px' : '220px' }"
      >
        <!-- header cell (204 × 32, pl 8 · py 2): the workspace, and what
             everything is driven from. On the Sidebar & Header page it opens
             the preview control, which drives this sidebar; on every other
             page it opens the app menu. Collapsed, the cell is the 28px
             logo (Figma's collapsed header slot). -->
        <Popover
          v-if="page === 'sidebar-header'"
          side="bottom"
          align="start"
          :offset="6"
          bare
        >
          <template #trigger>
            <button
              type="button"
              :class="cellClass"
              :aria-label="patternCollapsed ? 'Preview control' : undefined"
            >
              <img
                v-if="patternCollapsed"
                :src="appLogo"
                alt=""
                class="size-7 shrink-0"
              />
              <template v-else>
                <span
                  class="min-w-0 flex-1 truncate text-start text-base-medium text-ink-gray-9"
                >
                  {{ appTitle }}
                </span>
                <span
                  class="flex size-6 shrink-0 items-center justify-center text-ink-gray-7"
                  aria-hidden="true"
                >
                  <span class="size-3.5" v-html="navChevron" />
                </span>
              </template>
            </button>
          </template>
          <!-- the layout's own controls, in the shape the floating card
               used: one row per setting, the pickers lining up -->
          <div
            class="v2-scroll flex max-h-[calc(100vh-72px)] w-[340px] flex-col gap-2 overflow-y-auto rounded-[20px] border border-outline-gray-1 bg-surface-elevation-2 p-3 shadow-lg"
          >
            <p class="px-2 pb-1 pt-1 text-xl-semibold text-ink-gray-9">
              Preview control
            </p>
            <ControlSelect
              v-model="appPick"
              label="App"
              :options="appOptions"
            />
            <ControlToggle
              v-model="patternCollapsed"
              label="Collapsed"
              :disabled="inSettings"
            />
            <ControlToggle
              v-model="patternTray"
              label="App navigation"
              :disabled="inSettings"
            />
            <ControlToggle
              v-model="showHeader"
              label="Header"
              :disabled="inSettings"
            />
            <ControlSelect
              v-if="showHeader"
              v-model="headerType"
              label="Header type"
              :options="headerOptions"
            />
            <ControlToggle
              v-model="showSubheader"
              label="Subheader"
              :disabled="inSettings"
            />
            <ControlSelect
              v-if="showSubheader"
              v-model="subheaderType"
              label="Subheader type"
              :options="subheaderOptions"
            />
            <ControlToggle v-model="darkMode" label="Dark mode" />
          </div>
        </Popover>
        <Dropdown v-else :options="appMenu" match-trigger-width :offset="6">
          <button type="button" :class="cellClass">
            <img
              v-if="patternCollapsed"
              :src="appLogo"
              alt=""
              class="size-7 shrink-0"
            />
            <template v-else>
              <span
                class="min-w-0 flex-1 truncate text-start text-base-medium text-ink-gray-9"
              >
                {{ appTitle }}
              </span>
              <span
                class="flex size-6 shrink-0 items-center justify-center text-ink-gray-7"
                aria-hidden="true"
              >
                <span class="size-3.5" v-html="navChevron" />
              </span>
            </template>
          </button>
        </Dropdown>

        <!-- an app's own menu, drawn from the same rows the Espresso
             sidebar demo uses -->
        <!-- collapsed, the rail is the app's own icon rows; expanded, it is
             the shared menu, so a disclosure section (CRM's Public Views,
             Calendar's My Calendars) folds here exactly as it does in the
             Espresso sidebar -->
        <div
          v-if="appScenario && patternCollapsed"
          class="flex flex-col items-center gap-0.5"
        >
          <SidebarRow
            v-for="(row, i) in collapsedRows"
            :key="i"
            :row="row"
            collapsed
          />
        </div>
        <SidebarMenu v-else-if="appScenario" :scenario="appScenario" />

        <div
          v-else
          class="flex flex-col gap-0.5"
          :class="patternCollapsed && 'items-center'"
        >
          <!-- 28px rows 2px apart, px 8: a 16px icon · 8px · the 14 label.
               The states are the sidebar-item component's own (29766:167193),
               so both themes come from the same tokens: the pick sits on a
               raised elevation-2 row with the sm shadow (white in light,
               #242424 in dark, where that shadow carries the file's inner
               highlight), the rest take a gray-2 fill on hover. -->
          <button
            v-for="p in pages"
            :key="p.id"
            type="button"
            class="flex h-7 shrink-0 items-center rounded-4 transition-colors"
            :class="[
              patternCollapsed ? 'w-7 justify-center' : 'gap-2 px-2 text-start',
              p.id === page
                ? 'bg-surface-elevation-2 text-ink-gray-8 shadow-sm'
                : 'text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8',
            ]"
            :aria-current="p.id === page ? 'page' : undefined"
            :aria-label="patternCollapsed ? p.label : undefined"
            :title="patternCollapsed ? p.label : undefined"
            @click="page = p.id"
          >
            <span class="nav-icon size-4 shrink-0" v-html="NAV_ICONS[p.id]" />
            <span
              v-if="!patternCollapsed"
              class="min-w-0 flex-1 truncate text-base"
              >{{ p.label }}</span
            >
          </button>
        </div>

        <!-- an app's foot is a single Collapse row (35167:69809), which on
             the rail is the button that opens it again -->
        <div
          v-if="appScenario"
          class="mt-auto pt-4"
          :class="patternCollapsed && 'flex justify-center'"
        >
          <button
            type="button"
            class="flex h-7 items-center rounded-4 text-ink-gray-7 transition-colors hover:bg-surface-gray-2"
            :class="
              patternCollapsed
                ? 'w-7 justify-center'
                : 'w-full gap-2 px-2 text-start'
            "
            :aria-label="patternCollapsed ? 'Expand sidebar' : undefined"
            @click="patternCollapsed = !patternCollapsed"
          >
            <span class="nav-icon size-4 shrink-0" v-html="sbSidebarToggle" />
            <span
              v-if="!patternCollapsed"
              class="min-w-0 flex-1 truncate text-base"
              >Collapse</span
            >
          </button>
        </div>

        <!-- collapsed, this playground's foot is the same actions stacked on
             the rail; the trial card and the storage bar need the width -->
        <div
          v-else-if="patternCollapsed"
          class="mt-auto flex flex-col items-center gap-1 pt-4"
        >
          <button type="button" class="sb-action" aria-label="What's new">
            <span class="nav-icon size-4" v-html="sbZap" />
          </button>
          <button type="button" class="sb-action" aria-label="Help">
            <span class="nav-icon size-4" v-html="sbHelp" />
          </button>
          <button
            type="button"
            class="sb-action"
            aria-label="Expand sidebar"
            @click="patternCollapsed = false"
          >
            <span class="nav-icon size-4" v-html="sbSidebarToggle" />
          </button>
        </div>

        <!-- this playground's foot: the trial card, what storage is used,
             and the quick actions — 11px apart, pinned to the bottom -->
        <div v-else class="mt-auto flex flex-col gap-[11px] pt-4">
          <div
            class="flex flex-col gap-3.5 rounded-6 border border-outline-elevation-1 bg-surface-elevation-1 p-3 shadow-sm"
          >
            <p class="flex items-start gap-1.5">
              <span
                class="nav-icon size-4 shrink-0 text-ink-gray-9"
                v-html="sbAlert"
              />
              <span class="text-sm-medium text-ink-gray-9"
                >Your trial ends soon!</span
              >
            </p>
            <div class="flex flex-col gap-3">
              <p class="text-xs text-ink-gray-6">
                Upgrade to keep enjoying features.
              </p>
              <button
                type="button"
                class="h-7 rounded-4 bg-surface-gray-2 text-base text-ink-gray-7 transition-colors hover:bg-surface-gray-3"
              >
                Update now
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="h-1 overflow-hidden rounded-full bg-surface-gray-3">
              <span
                class="block h-full w-[26%] rounded-full bg-surface-gray-9"
              />
            </span>
            <p class="flex items-center gap-2">
              <span
                class="nav-icon size-4 shrink-0 text-ink-gray-6"
                v-html="sbCloud"
              />
              <span class="text-sm text-ink-gray-6">48.7 GB of 500 GB</span>
            </p>
          </div>

          <div class="flex items-center justify-between">
            <span class="flex gap-1">
              <button type="button" class="sb-action" aria-label="What's new">
                <span class="nav-icon size-4" v-html="sbZap" />
              </button>
              <button type="button" class="sb-action" aria-label="Help">
                <span class="nav-icon size-4" v-html="sbHelp" />
              </button>
            </span>
            <!-- the file's sidebar-collapse glyph, so it collapses to the
                 rail rather than hiding the sidebar outright; the rail's own
                 button brings it back -->
            <button
              type="button"
              class="sb-action"
              aria-label="Collapse sidebar"
              @click="patternCollapsed = true"
            >
              <span class="nav-icon size-4" v-html="sbSidebarToggle" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="relative flex min-w-0 flex-1 flex-col">
      <!-- header: the breadcrumb on the left, 48 tall and ruled beneath -->
      <header
        class="flex h-12 shrink-0 items-center border-b border-outline-gray-1 py-2.5 pl-3 pr-5"
      >
        <Breadcrumbs :items="crumbs" />
      </header>

      <div class="flex min-h-0 flex-1">
        <section class="v2-stage relative min-w-0 flex-1 overflow-hidden">
          <!-- the outgoing page is still mounted while it leaves, so the
               outline reads its screens once the new one has arrived -->
          <Transition name="v2-page" mode="out-in" @after-enter="scanSections">
            <div :key="page" class="absolute inset-0">
              <!-- one screen per modal width, as the other pages do: the
                   outline names them and the scroll carries the next set in.
                   Triggers are sm subtle, 10px apart, centred -->
              <div v-if="page === 'modal'" class="v2-sections" data-sections>
                <section
                  v-for="s in sizes"
                  :id="`modal-${parseInt(s.width)}`"
                  :key="s.width"
                  class="v2-section"
                  data-section
                  :data-label="s.width"
                >
                  <div
                    class="flex max-w-[600px] flex-wrap justify-center gap-2.5"
                  >
                    <Button
                      v-for="(m, i) in s.modals"
                      :key="m.id"
                      class="v2-trigger"
                      :style="{ '--i': i }"
                      size="sm"
                      @click="open[m.id] = true"
                    >
                      {{ m.label }}
                    </Button>
                  </div>
                </section>
              </div>

              <!-- The sidebar pattern is the shell's own sidebar, so this
                   page is just the header bars it sits beside; the preview
                   control in the sidebar's header cell drives both. -->
              <div
                v-else-if="page === 'sidebar-header'"
                class="flex h-full flex-col"
              >
                <component
                  :is="headerComponent"
                  v-if="showHeader"
                  :key="headerType"
                />
                <component
                  :is="subheaderComponent"
                  v-if="showSubheader"
                  :key="subheaderType"
                />
                <div class="min-h-0 flex-1" />
              </div>

              <ListPage v-else-if="page === 'list'" />
              <PopoverPage v-else-if="page === 'popover'" />
              <CardsPage v-else-if="page === 'cards'" />
              <ToastPage v-else-if="page === 'toast'" />

              <div
                v-else
                class="flex h-full items-center justify-center text-base text-ink-gray-5"
              >
                No {{ current.label.toLowerCase() }} designs yet.
              </div>
            </div>
          </Transition>
        </section>

        <!-- The content outline, in the shape frappe-ui's own docs use
             (vitepress/components/Docs/OnThisPage.vue): a rail down the
             left, the rows hanging off it, the current one darkening its
             segment. That component reads vitepress's route and scans the
             page's headings, so it cannot run here — this is its markup
             over the sections each page already takes as a deep link. -->
        <aside
          v-if="sections.length"
          class="v2-scroll w-[200px] shrink-0 overflow-y-auto pr-5 pt-[30px] leading-relaxed"
          :aria-label="outlineTitle"
        >
          <div class="flex flex-col">
            <!-- a transparent border keeps the label on the rows' left edge -->
            <span
              class="whitespace-nowrap border-l border-transparent pb-1 pl-4 text-base-medium text-ink-gray-9"
            >
              {{ outlineTitle }}
            </span>
            <a
              v-for="s in sections"
              :key="s.id"
              :href="`#${s.id}`"
              class="border-l py-1 pl-4 text-base transition-colors hover:text-ink-gray-9"
              :class="
                s.id === activeSection
                  ? 'border-outline-gray-7 text-ink-gray-9'
                  : 'border-outline-gray-2 text-ink-gray-6'
              "
              :aria-current="s.id === activeSection ? 'true' : undefined"
              @click.prevent="goToSection(s.id)"
            >
              {{ s.label }}
            </a>
          </div>
        </aside>
      </div>

      <!-- theme · expand: subtle md icon buttons in a raised group,
           p 6 · gap 6, 10px radius, sm elevation, 20px from the corner -->
      <div
        class="absolute bottom-5 right-5 z-10 flex gap-1.5 rounded-5 bg-surface-elevation-1 p-1.5 shadow-sm"
      >
        <Button
          size="md"
          :label="
            resolvedColorScheme === 'dark'
              ? 'Switch to light'
              : 'Switch to dark'
          "
          @click="toggleTheme"
        >
          <template #icon>
            <!-- icon/line/darkmode: ring with its right half filled -->
            <svg
              viewBox="0 0 18 18"
              class="size-[18px] text-ink-gray-7"
              aria-hidden="true"
            >
              <circle
                cx="9"
                cy="9"
                r="6.75"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
              />
              <path d="M9 2.25a6.75 6.75 0 0 1 0 13.5z" fill="currentColor" />
            </svg>
          </template>
        </Button>
        <Button
          size="md"
          :label="sidebarOpen ? 'Hide sidebar' : 'Show sidebar'"
          :aria-pressed="!sidebarOpen"
          @click="sidebarOpen = !sidebarOpen"
        >
          <template #icon>
            <span
              class="nav-icon size-[18px] text-ink-gray-7"
              v-html="sbSidebarToggle"
            />
          </template>
        </Button>
        <Button
          size="md"
          :label="fullscreen ? 'Exit fullscreen' : 'Fullscreen'"
          @click="toggleFullscreen"
        >
          <template #icon>
            <span
              class="size-[18px] text-ink-gray-7"
              :class="fullscreen ? 'lucide-minimize-2' : 'lucide-maximize-2'"
            />
          </template>
        </Button>
      </div>
    </main>

    <component
      :is="m.component"
      v-for="m in modals"
      :key="m.id"
      v-model:open="open[m.id]"
    />
  </div>
</template>

<style>
/* Page switch: fade and rise 4px. */
.v2-page-enter-active,
.v2-page-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}
.v2-page-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.v2-page-leave-to {
  opacity: 0;
}

/* Size tab switch: the old set fades out, the new triggers rise in one
   after another, 30ms apart. */
.v2-set-leave-active {
  transition: opacity 120ms ease-in;
}
.v2-set-leave-to {
  opacity: 0;
}
.v2-set-enter-active .v2-trigger,
.v2-trigger {
  animation: v2-trigger-in 260ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 30ms);
}
@keyframes v2-trigger-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* the quick actions at the foot of the sidebar */
.sb-action {
  @apply flex size-7 items-center justify-center rounded-4 text-ink-gray-6 transition-colors hover:bg-surface-gray-2 hover:text-ink-gray-8;
}

/* an app in the tray: every logo at full strength, the app in front marked
   by the indicator rather than by the others fading */
.tray-app {
  @apply flex size-7 items-center justify-center rounded-5;
}

/* the row icons take the row's own ink */
.nav-icon svg {
  width: 100%;
  height: 100%;
}

/* A page is a column of screens: one component to a screen, snapped to, so
   a scroll carries the next one in. `scroll-smooth` keeps the outline's
   jumps on the same easing as the wheel's. */
.v2-sections {
  @apply h-full snap-y snap-mandatory overflow-y-auto scroll-smooth;
  scroll-padding: 0;
}
/* the screens scroll, but the bar itself is chrome the design does not
   have — the same for the sidebar and the outline */
.v2-sections,
.v2-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.v2-sections::-webkit-scrollbar,
.v2-scroll::-webkit-scrollbar {
  display: none;
}
.v2-section {
  @apply flex min-h-full snap-start items-center justify-center px-5 py-20;
}
@media (prefers-reduced-motion: reduce) {
  .v2-sections {
    scroll-behavior: auto;
    scroll-snap-type: none;
  }
}

/* The design sizes a text slot to its line height (a 14px line in a 16px
   box), and `truncate`'s overflow:hidden then cuts the descenders off — the
   g in "Avg Resolution". `clip` with a margin keeps the ink outside the box
   while still ellipsing the line. */
.v2-stage .truncate {
  overflow: clip;
  overflow-clip-margin: 3px;
}

/* Segmented controls: the raised chip glides to the pick rather than the
   background lighting up in place. */
.v2-glide-chip {
  transition:
    left 300ms cubic-bezier(0.32, 0.72, 0, 1),
    width 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Theme switch crossfade (view transitions). */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 240ms;
  animation-timing-function: ease;
}

@media (prefers-reduced-motion: reduce) {
  .v2-page-enter-active,
  .v2-page-leave-active,
  .v2-set-leave-active {
    transition: none;
  }
  .v2-trigger {
    animation: none;
  }
  .v2-glide-chip {
    transition: none;
  }
}
</style>
