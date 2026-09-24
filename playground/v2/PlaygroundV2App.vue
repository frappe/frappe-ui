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
import { Breadcrumbs, Button, useColorScheme } from '../../src'
import EspressoLayout from '../EspressoLayout.vue'
import ListPage from './list/ListPage.vue'
import PopoverPage from './popover/PopoverPage.vue'
import CardsPage from './cards/CardsPage.vue'
import ToastPage from './toast/ToastPage.vue'
import frappeLogo from './assets/frappe-logo.svg'
import EIcon from '../espresso-sidebar/EIcon.vue'
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
const appMenu = computed(() =>
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
function toggleTheme() {
  const next = resolvedColorScheme.value === 'dark' ? 'light' : 'dark'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => unknown
  }
  if (doc.startViewTransition && !reduce) {
    doc.startViewTransition(() => setColorScheme(next))
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
// Sidebar & Header: the v1 preview-control card, opened from the corner group.
const layoutControls = ref(false)

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
       surface-gray-1 behind a hairline (p 8, its header cell 41 tall, items
       28 tall and 2px apart), a 48px header ruled underneath (pl 12 · pr 20)
       carrying the breadcrumb, the page itself, and the content outline down
       the right — 150px rows, 30px in from the edge. The theme / expand
       group sits 20px from the bottom-right corner. -->
  <div class="flex h-screen bg-surface-base">
    <!-- Figma 35164:58913 — one 268px surface behind a hairline: the 48px
         app tray (p 10, 28px logos 12px apart, its own hairline) and the
         220px nav beside it (p 8 · pb 10) -->
    <div
      class="flex h-full shrink-0 overflow-hidden border-r border-outline-gray-1 bg-surface-gray-1 transition-[width,opacity] duration-300 ease-out dark:border-outline-gray-2"
      :class="
        sidebarOpen ? 'w-[268px] opacity-100' : 'w-0 border-r-0 opacity-0'
      "
      :inert="!sidebarOpen || undefined"
    >
      <nav
        class="flex h-full w-12 shrink-0 flex-col justify-between border-r border-outline-gray-1 p-2.5 dark:border-outline-gray-2"
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
              <img
                :src="frappeLogo"
                alt=""
                class="size-7 rounded-5 dark:invert"
              />
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
              <img
                :src="frappeLogo"
                alt=""
                class="size-7 rounded-5 dark:invert"
              />
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

      <div
        class="v2-scroll flex h-full w-[220px] flex-col gap-2 overflow-y-auto p-2 pb-2.5"
      >
        <!-- header cell (204 × 32, pl 8 · py 2): the workspace and a chevron -->
        <div class="flex h-8 shrink-0 items-center gap-2 rounded-4 py-0.5 pl-2">
          <span
            class="min-w-0 flex-1 truncate text-base-medium text-ink-gray-9"
          >
            {{ appMenu?.title ?? 'Frappe UI' }}
          </span>
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-4 text-ink-gray-7"
            aria-hidden="true"
          >
            <span class="size-3.5" v-html="navChevron" />
          </span>
        </div>

        <!-- an app's own menu, drawn from the same rows the Espresso
             sidebar demo uses -->
        <div
          v-if="appMenu"
          class="flex flex-col"
          :style="{ gap: `${appMenu.menuGap}px` }"
        >
          <SidebarRow v-for="(row, i) in appMenu.rows" :key="i" :row="row" />
        </div>

        <div v-else class="flex flex-col gap-0.5">
          <!-- 28px rows 2px apart, px 8: a 16px icon · 8px · the 14 label.
               The pick sits on a raised white row (sm elevation), as the
               file draws it; the rest darken on hover. -->
          <button
            v-for="p in pages"
            :key="p.id"
            type="button"
            class="flex h-7 shrink-0 items-center gap-2 rounded-4 px-2 text-start transition-colors"
            :class="
              p.id === page
                ? 'bg-surface-elevation-2 text-ink-gray-8 shadow-sm'
                : 'text-ink-gray-6 hover:text-ink-gray-8'
            "
            :aria-current="p.id === page ? 'page' : undefined"
            @click="page = p.id"
          >
            <span class="nav-icon size-4 shrink-0" v-html="NAV_ICONS[p.id]" />
            <span class="min-w-0 flex-1 truncate text-base">{{ p.label }}</span>
          </button>
        </div>

        <!-- an app's foot is a single Collapse row (35167:69809) -->
        <div v-if="appMenu" class="mt-auto pt-4">
          <button
            type="button"
            class="flex h-7 w-full items-center gap-2 rounded-4 px-2 text-start text-ink-gray-7 transition-colors hover:bg-surface-gray-2"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon size-4 shrink-0" v-html="sbSidebarToggle" />
            <span class="min-w-0 flex-1 truncate text-base">Collapse</span>
          </button>
        </div>

        <!-- this playground's foot: the trial card, what storage is used,
             and the quick actions — 11px apart, pinned to the bottom -->
        <div v-else class="mt-auto flex flex-col gap-[11px] pt-4">
          <div
            class="flex flex-col gap-3.5 rounded-6 bg-surface-elevation-2 p-3 shadow-sm"
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
            <button
              type="button"
              class="sb-action"
              aria-label="Hide sidebar"
              @click="sidebarOpen = false"
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
        class="flex h-12 shrink-0 items-center border-b border-outline-gray-1 py-2.5 pl-3 pr-5 dark:border-outline-gray-2"
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

              <!-- the v1 app layout, as-is; its control card floats above the
                 corner group -->
              <!-- the shell already has a sidebar, so this page opens the
                   layout with just its header bars -->
              <EspressoLayout
                v-else-if="page === 'sidebar-header'"
                :with-sidebar="false"
                :show-controls="layoutControls"
                controls-class="absolute bottom-[64px] right-2.5 z-20 max-h-[calc(100%-74px)]"
              />

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
          v-if="page === 'sidebar-header'"
          size="md"
          :label="
            layoutControls ? 'Hide preview controls' : 'Show preview controls'
          "
          :aria-pressed="layoutControls"
          :class="{ '!bg-surface-gray-3': layoutControls }"
          @click="layoutControls = !layoutControls"
        >
          <template #icon>
            <span
              class="lucide-sliders-horizontal size-[18px] text-ink-gray-7"
            />
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

/* an app in the tray: the logo, dimmed until it is pointed at */
.tray-app {
  @apply flex size-7 items-center justify-center rounded-5 transition-opacity;
}
.tray-app:not([aria-current]) {
  @apply opacity-80 hover:opacity-100;
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
