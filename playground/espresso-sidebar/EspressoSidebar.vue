<template>
  <!-- Navigation chrome: plain labels keep the arrow instead of the text
       I-beam, so moving through the sidebar doesn't flip between cursors. -->
  <div class="flex h-full cursor-default select-none bg-surface-sidebar">
    <!-- App navigation rail. The outer frame animates
         its width on the same curve Sidebar collapses with; the rail inside
         keeps its 48px and is pinned to the right edge, so it slides in from
         the left instead of being uncovered. -->
    <div
      class="flex h-full shrink-0 justify-end overflow-hidden transition-[width] duration-300 ease-in-out"
      :style="{ width: appNavigation ? '48px' : '0px' }"
      :inert="!appNavigation"
      :aria-hidden="!appNavigation"
    >
      <div
        class="relative flex h-full w-12 shrink-0 flex-col justify-between p-2.5 shadow-[inset_-1px_0_0_var(--outline-gray-1)]"
      >
        <div class="flex flex-col gap-3">
          <!-- The home logo opens the Default sidebar; each app logo opens
               its app's sidebar. -->
          <button
            type="button"
            aria-label="Home"
            :aria-current="scenarioId === 'default' ? 'page' : undefined"
            :class="railButtonClass"
            @click="scenarioId = 'default'"
          >
            <EIcon name="logo-drive" class="size-7" />
          </button>
          <div class="border-t border-outline-gray-1" />
          <div class="flex flex-col gap-3">
            <button
              v-for="app in railApps"
              :key="app.logo"
              type="button"
              :aria-label="app.label"
              :aria-current="app.scenario === scenarioId ? 'page' : undefined"
              :class="railButtonClass"
              @click="scenarioId = app.scenario"
            >
              <EIcon :name="`logo-${app.logo}`" class="size-7" />
            </button>
          </div>
        </div>
        <span
          aria-hidden="true"
          class="absolute left-0 h-7 w-[3.5px] rounded-r-[3px] bg-surface-gray-6 transition-[top] duration-300 ease-in-out"
          :style="{ top: `${indicatorTop}px` }"
        />
        <div class="flex flex-col gap-3">
          <SidebarRow :row="railSettings" collapsed />
          <div class="relative size-7">
            <img
              :src="railAvatar"
              alt="Sally Potter"
              class="absolute left-0 top-0 size-[30px] max-w-none"
            />
          </div>
        </div>
      </div>
    </div>

    <Sidebar
      v-model:collapsed="collapsed"
      width="220px"
      collapsed-width="44px"
      class="shadow-[inset_-1px_0_0_var(--outline-gray-1)]"
    >
      <div
        class="flex h-full min-h-0 flex-col justify-between gap-2 overflow-y-auto px-2 pb-2.5 pt-2"
      >
        <!-- ============ Collapsed ============ -->
        <template v-if="collapsed">
          <div class="flex flex-col gap-3.5">
            <!-- Figma's collapsed header slot: 41px, the logo 6px down. -->
            <div class="flex h-[41px] flex-col justify-center pb-[7px] pt-1.5">
              <Dropdown v-if="scenario.logo" :options="appMenu">
                <template #default>
                  <button
                    type="button"
                    class="block size-7 rounded-[7px] outline-none transition-opacity duration-300 ease-in-out focus-visible:focus-ring"
                    :class="
                      appNavigation
                        ? 'pointer-events-none opacity-0'
                        : 'opacity-100'
                    "
                    :aria-label="`${scenario.title} menu`"
                  >
                    <EIcon :name="`logo-${scenario.logo}`" class="size-7" />
                  </button>
                </template>
              </Dropdown>
            </div>
            <div
              class="flex flex-col"
              :style="{ gap: `${scenario.menuGap}px` }"
            >
              <SidebarRow
                v-for="(row, i) in collapsedRows"
                :key="`${scenario.id}-c-${i}`"
                :row="row"
                collapsed
              />
            </div>
          </div>

          <div
            v-if="scenario.id === 'default'"
            class="flex flex-col gap-1 [--row-hit-gap:2px]"
          >
            <SidebarRow
              :row="
                rail('status', { active: true, iconColor: 'text-ink-gray-6' })
              "
              collapsed
            />
            <SidebarRow :row="rail('cloud')" collapsed />
            <SidebarRow :row="rail('zap')" collapsed />
            <SidebarRow :row="rail('help')" collapsed />
            <SidebarRow :row="expandRow" collapsed />
          </div>
          <div v-else-if="scenario.id === 'crm'" class="flex flex-col gap-0.5">
            <SidebarRow :row="rail('status')" collapsed />
            <SidebarRow :row="expandRow" collapsed />
          </div>
          <div v-else-if="scenario.id === 'helpdesk'" class="flex flex-col">
            <SidebarRow :row="expandRow" collapsed />
          </div>
          <div
            v-else-if="scenario.id === 'drive'"
            class="flex flex-col gap-0.5"
          >
            <SidebarRow :row="rail('cloud')" collapsed />
            <SidebarRow :row="expandRow" collapsed />
          </div>
          <div v-else-if="scenario.id === 'mail'" class="flex flex-col gap-2">
            <div class="flex flex-col gap-1.5 [--row-hit-gap:3px]">
              <SidebarRow
                v-for="event in events"
                :key="event.color"
                :row="{
                  type: 'item',
                  label: event.title,
                  prefix: { marker: event.color },
                  white: true,
                }"
                collapsed
              />
            </div>
            <SidebarRow :row="expandRow" collapsed />
          </div>
          <div v-else-if="scenario.id === 'lms'" class="flex flex-col gap-0.5">
            <SidebarRow :row="rail('zap')" collapsed />
            <SidebarRow :row="rail('help')" collapsed />
            <SidebarRow :row="expandRow" collapsed />
          </div>
          <div
            v-else-if="scenario.id === 'calendar'"
            class="flex flex-col gap-0.5"
          >
            <SidebarRow :row="rail('calender')" collapsed />
            <SidebarRow :row="rail('zap')" collapsed />
            <SidebarRow :row="rail('help')" collapsed />
            <SidebarRow :row="expandRow" collapsed />
          </div>
        </template>

        <!-- ============ Expanded ============ -->
        <template v-else>
          <div
            class="flex flex-col"
            :class="scenario.id === 'settings' ? 'gap-1' : 'gap-3.5'"
          >
            <!-- Header -->
            <SidebarRow
              v-if="scenario.id === 'settings'"
              :row="{ type: 'section', label: 'User settings' }"
            />
            <!-- One header for both layouts, and one trigger: as frappe-ui's
                 SidebarHeader, the whole row opens the app menu — gray on
                 hover, lifted onto the elevated surface while open. With the
                 app rail on, the header is the design's 32px rail header:
                 the logo folds away into the rail and the user name folds
                 up, leaving only the app name. -->
            <!-- Figma's header slot (CRM frame 31304:43455): 41px from the
                 sidebar's 8px top padding — 32px with the app rail on. -->
            <div v-else class="flex items-center">
              <Dropdown :options="appMenu" match-trigger-width>
                <template #default="{ open }">
                  <button
                    type="button"
                    class="flex w-full items-center rounded-4 py-0.5 text-left outline-none transition-all duration-300 ease-in-out focus-visible:focus-ring"
                    :class="[
                      appNavigation ? 'h-8 pl-2' : 'h-[41px] pl-0.5',
                      open
                        ? 'bg-surface-elevation-2 shadow-sm'
                        : 'hover:bg-surface-gray-3',
                    ]"
                  >
                    <div
                      class="flex shrink-0 items-center overflow-hidden pb-px transition-all duration-300 ease-in-out"
                      :class="
                        appNavigation
                          ? 'mr-0 w-0 opacity-0'
                          : 'mr-2 w-7 opacity-100'
                      "
                    >
                      <EIcon :name="`logo-${scenario.logo}`" class="size-7" />
                    </div>
                    <div class="flex min-w-0 flex-1 items-center gap-2">
                      <div class="flex min-w-0 flex-1 flex-col">
                        <span class="truncate text-base-medium text-ink-gray-8">
                          {{ scenario.title }}
                        </span>
                        <div
                          class="grid transition-all duration-300 ease-in-out"
                          :class="
                            appNavigation
                              ? 'grid-rows-[0fr] opacity-0'
                              : 'grid-rows-[1fr] opacity-100'
                          "
                          :aria-hidden="appNavigation || undefined"
                        >
                          <div class="min-h-0 overflow-hidden">
                            <div class="truncate pt-1 text-sm text-ink-gray-5">
                              {{ scenario.subtitle }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- The design's 24px chevron box, now part of the row. -->
                      <span class="grid size-6 shrink-0 place-items-center">
                        <EIcon
                          name="small-down-14"
                          class="size-3.5 text-ink-gray-7"
                        />
                      </span>
                    </div>
                  </button>
                </template>
              </Dropdown>
            </div>

            <!-- Menu -->
            <div
              class="flex flex-col"
              :style="{ gap: `${scenario.menuGap}px` }"
            >
              <template
                v-for="(segment, i) in menuSegments"
                :key="`${scenario.id}-${i}`"
              >
                <SidebarRow v-if="segment.kind === 'row'" :row="segment.row" />
                <!-- A disclosure section and the rows it folds. The rows sit
                     in a grid track that eases between its content height and
                     zero; the menu's gap moves inside it as top padding, so
                     nothing is left behind when folded. -->
                <div v-else class="flex flex-col">
                  <SidebarRow :row="segment.header" />
                  <div
                    class="grid transition-[grid-template-rows] duration-200 ease-in-out"
                    :class="
                      segment.header.expanded === false
                        ? 'grid-rows-[0fr]'
                        : 'grid-rows-[1fr]'
                    "
                    :inert="segment.header.expanded === false || undefined"
                  >
                    <div class="min-h-0 overflow-hidden">
                      <div
                        class="flex flex-col"
                        :style="{
                          gap: `${scenario.menuGap}px`,
                          paddingTop: `${scenario.menuGap}px`,
                        }"
                      >
                        <SidebarRow
                          v-for="(row, j) in segment.rows"
                          :key="j"
                          :row="row"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Footer: Default -->
          <div
            v-if="scenario.id === 'default'"
            class="flex flex-col gap-[11px]"
          >
            <SidebarCard
              title="Your trial ends soon!"
              description="Upgrade to keep enjoying features."
              :class="cardClass"
            >
              <template #prefix>
                <EIcon name="alert-circle" class="size-4 text-ink-gray-8" />
              </template>
              <template #actions>
                <Button variant="subtle" size="sm" :class="cardButtonClass">
                  Update now
                </Button>
              </template>
            </SidebarCard>
            <!-- Storage inset onto the menu icons' 16px line, as in frappe-ui. -->
            <div class="flex flex-col gap-2 px-2">
              <Progress :value="storagePercent" size="md" />
              <div class="flex items-center gap-2">
                <EIcon name="cloud" class="size-4 text-ink-gray-6" />
                <span class="text-sm text-ink-gray-6">48.7 GB of 500 GB</span>
              </div>
            </div>
            <div class="flex h-7 items-center justify-between">
              <div class="flex cursor-pointer items-center gap-1">
                <Button variant="ghost" size="sm" aria-label="Shortcuts">
                  <template #icon>
                    <EIcon name="zap" class="size-4 text-ink-gray-6" />
                  </template>
                </Button>
                <Button variant="ghost" size="sm" aria-label="Help">
                  <template #icon>
                    <EIcon name="help" class="size-4 text-ink-gray-6" />
                  </template>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Collapse sidebar"
                @click="collapsed = true"
              >
                <template #icon>
                  <EIcon
                    name="sidebar-collapse-expand"
                    class="size-4 text-ink-gray-6"
                  />
                </template>
              </Button>
            </div>
          </div>

          <!-- Footer: LMS -->
          <div v-else-if="scenario.id === 'lms'" class="flex flex-col">
            <div class="flex h-7 items-center justify-between">
              <div class="flex cursor-pointer items-center gap-1">
                <Button variant="ghost" size="sm" aria-label="Shortcuts">
                  <template #icon>
                    <EIcon name="zap" class="size-4 text-ink-gray-6" />
                  </template>
                </Button>
                <Button variant="ghost" size="sm" aria-label="Help">
                  <template #icon>
                    <EIcon name="help" class="size-4 text-ink-gray-6" />
                  </template>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Collapse sidebar"
                @click="collapsed = true"
              >
                <template #icon>
                  <EIcon
                    name="sidebar-collapse-expand"
                    class="size-4 text-ink-gray-6"
                  />
                </template>
              </Button>
            </div>
          </div>

          <!-- Footer: CRM -->
          <div v-else-if="scenario.id === 'crm'" class="flex flex-col gap-2">
            <SidebarCard
              title="Getting started"
              description="0/9 steps"
              :class="cardClass"
            >
              <template #prefix>
                <EIcon name="status" class="size-4 text-ink-gray-8" />
              </template>
              <template #actions>
                <Button variant="subtle" size="sm" :class="cardButtonClass">
                  Start now
                </Button>
              </template>
            </SidebarCard>
            <CollapseButton @click="collapsed = true" />
          </div>

          <!-- Footer: Helpdesk -->
          <div v-else-if="scenario.id === 'helpdesk'" class="flex flex-col">
            <CollapseButton @click="collapsed = true" />
          </div>

          <!-- Footer: Drive -->
          <div v-else-if="scenario.id === 'drive'" class="flex flex-col gap-2">
            <!-- Inset 16px from the sidebar edge, as frappe-ui's storage
                 footer (`px-4`): on the line of the menu icons above. -->
            <div class="flex flex-col gap-2 px-2">
              <div class="flex flex-col gap-2.5">
                <span class="text-base-medium text-ink-gray-7">Storage</span>
                <Progress :value="storagePercent" size="md" />
              </div>
              <div class="flex h-6 items-center gap-2">
                <EIcon name="cloud" class="size-4 text-ink-gray-5" />
                <div class="flex min-w-0 flex-1 items-center gap-2">
                  <span class="min-w-0 flex-1 truncate text-sm text-ink-gray-5">
                    679 GB of 2 TB
                  </span>
                  <!-- Pulled right by its padding, so the label ends on the
                       footer's 16px edge rather than the button box. -->
                  <Button
                    variant="ghost"
                    size="xs"
                    class="-mr-1.5 !rounded-4 !text-sm !text-ink-gray-7"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
            <CollapseButton @click="collapsed = true" />
          </div>

          <!-- Footer: Mail -->
          <div v-else-if="scenario.id === 'mail'" class="flex flex-col gap-2">
            <div class="flex flex-col gap-1.5 [--row-hit-gap:3px]">
              <SidebarRow
                :row="{ type: 'section', label: 'Upcoming events', hint: '3' }"
              />
              <!-- Figma draws the first card in its hover state; here every
                   card rests flat and lifts with that shadow on hover. -->
              <button
                v-for="event in events"
                :key="event.color"
                type="button"
                class="flex w-full items-center gap-1.5 rounded-4 bg-surface-elevation-1 p-2 text-left outline-none transition-shadow hover:shadow-sm focus-visible:focus-ring"
              >
                <span
                  class="h-[33px] w-0.5 shrink-0 rounded-4"
                  :style="{ backgroundColor: event.color }"
                />
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <span class="text-xs-medium text-ink-gray-5">{{
                    event.time
                  }}</span>
                  <span class="truncate text-sm-medium text-ink-gray-7">
                    {{ event.title }}
                  </span>
                </div>
              </button>
            </div>
            <CollapseButton @click="collapsed = true" />
          </div>

          <!-- Footer: Calendar -->
          <div
            v-else-if="scenario.id === 'calendar'"
            class="flex flex-col gap-2"
          >
            <div class="flex h-[200px] flex-col gap-1.5 p-2">
              <div class="flex h-6 items-center justify-between">
                <Button
                  variant="ghost"
                  size="xs"
                  class="!gap-0.5 !rounded-4 !text-sm-medium !text-ink-gray-7"
                >
                  June 2023
                </Button>
                <div class="flex">
                  <Button
                    v-for="icon in pickerIcons"
                    :key="icon.name"
                    variant="ghost"
                    size="xs"
                    class="!w-[22px] !rounded-4"
                    :aria-label="icon.label"
                  >
                    <template #icon>
                      <EIcon
                        :name="icon.name"
                        class="size-3.5 text-ink-gray-7"
                      />
                    </template>
                  </Button>
                </div>
              </div>
              <div class="flex flex-1 flex-col gap-0.5">
                <div class="flex h-6 items-center justify-between">
                  <span
                    v-for="(day, i) in weekDays"
                    :key="i"
                    class="grid size-6 place-items-center text-xs text-ink-gray-4"
                  >
                    {{ day }}
                  </span>
                </div>
                <div class="flex cursor-pointer flex-col gap-0.5">
                  <div
                    v-for="(week, w) in weeks"
                    :key="w"
                    class="flex h-6 items-center justify-between"
                  >
                    <button
                      v-for="date in week"
                      :key="date.key"
                      type="button"
                      class="grid size-6 place-items-center rounded-2 text-xs"
                      :class="
                        date.selected
                          ? 'bg-surface-gray-9 text-ink-base'
                          : date.muted
                            ? 'text-ink-gray-4'
                            : 'text-ink-gray-7'
                      "
                    >
                      {{ date.day }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex h-7 items-center justify-between">
              <div class="flex cursor-pointer items-center gap-2">
                <Button variant="ghost" size="sm" aria-label="Shortcuts">
                  <template #icon>
                    <EIcon name="zap" class="size-4 text-ink-gray-7" />
                  </template>
                </Button>
                <Button variant="ghost" size="sm" aria-label="Help">
                  <template #icon>
                    <EIcon name="help" class="size-4 text-ink-gray-7" />
                  </template>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Collapse sidebar"
                @click="collapsed = true"
              >
                <template #icon>
                  <EIcon name="menu-collapse" class="size-4 text-ink-gray-7" />
                </template>
              </Button>
            </div>
          </div>

          <!-- Footer: Settings (empty 28px slot) -->
          <div v-else class="h-7" />
        </template>
      </div>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import { Button, Dropdown, Progress, Sidebar, SidebarCard } from '../../src'
import EIcon from './EIcon.vue'
import SidebarRow from './SidebarRow.vue'
import railAvatar from './avatars/avatar-lg-status.png'
import { scenarios, type ScenarioId } from './scenarios'
import type { ItemRow, Row, SectionRow } from './types'

const props = defineProps<{
  appNavigation?: boolean
}>()

/** v-model. The open app; the rail's logos switch it. */
const scenarioId = defineModel<ScenarioId>('scenario', { required: true })

const collapsed = defineModel<boolean>('collapsed', { default: false })

const scenario = computed(
  () => scenarios.find((s) => s.id === scenarioId.value)!,
)

// The app rail, top to bottom below the home logo and its divider.
const railApps: { logo: string; label: string; scenario: ScenarioId }[] = [
  { logo: 'calendar', label: 'Calendar', scenario: 'calendar' },
  { logo: 'crm', label: 'CRM', scenario: 'crm' },
  { logo: 'helpdesk', label: 'Helpdesk', scenario: 'helpdesk' },
  { logo: 'drive', label: 'Drive', scenario: 'drive' },
  { logo: 'lms', label: 'LMS', scenario: 'lms' },
  { logo: 'mail', label: 'Mail', scenario: 'mail' },
]

// The ::before reaches over half of the 12px gap to each neighbour, so the
// cursor stays a hand moving down the rail.
const railButtonClass =
  "relative block size-7 rounded-[7px] outline-none before:absolute before:-inset-x-2.5 before:-inset-y-1.5 before:content-[''] focus-visible:shadow-[0_0_0_2px_var(--outline-gray-3)]"

// The indicator marks the app whose sidebar is open. Default is the design's
// generic app, where Figma puts it beside Helpdesk. Each logo is 28px on a
// 40px step, starting 63px down (10px padding + 28px home logo + 12px gap +
// 1px divider + 12px gap).
const indicatorTop = computed(() => {
  const app = scenarioId.value === 'default' ? 'helpdesk' : scenarioId.value
  return 63 + railApps.findIndex((a) => a.scenario === app) * 40
})

// Disclosure sections (a chevron header: Public Views, My Calendars,
// Delegated Calendar) own the rows beneath them, up to the next divider or
// section. Each folds on its own; the open state lives for the session.
const foldedSections = ref(new Set<string>())

type MenuSegment =
  | { kind: 'row'; row: Row }
  | { kind: 'section'; header: SectionRow; rows: Row[] }

const menuSegments = computed<MenuSegment[]>(() => {
  const segments: MenuSegment[] = []
  let open: Extract<MenuSegment, { kind: 'section' }> | null = null
  for (const row of scenario.value.rows) {
    if (row.type === 'divider' || row.type === 'section') open = null
    if (row.type === 'section' && row.chevron) {
      const key = `${scenario.value.id}:${row.label}`
      open = {
        kind: 'section',
        header: {
          ...row,
          expanded: !foldedSections.value.has(key),
          onToggle: () => {
            const next = new Set(foldedSections.value)
            next.has(key) ? next.delete(key) : next.add(key)
            foldedSections.value = next
          },
        },
        rows: [],
      }
      segments.push(open)
    } else if (open) {
      open.rows.push(row)
    } else {
      segments.push({ kind: 'row', row })
    }
  }
  return segments
})

const collapsedRows = computed<Row[]>(() => {
  const rows = scenario.value.collapsedRows ?? []
  if (!props.appNavigation || scenarioId.value !== 'default') return rows
  // With the app rail, the collapsed Default menu shows a pentagon for People.
  return rows.map((r) =>
    r.type === 'group'
      ? {
          ...r,
          rows: r.rows.map((c) =>
            c.type === 'item' && c.label === 'People'
              ? { ...c, prefix: { icon: 'pentagon' } }
              : c,
          ),
        }
      : r,
  )
})

// The app header's menu, as in Frappe apps: switch app, docs, about, cloud
// login, settings, and log out on its own. Apps and Settings drive the
// preview; the rest are placeholders.
const appLogo = (logo: string) => () =>
  h(EIcon, { name: `logo-${logo}`, class: 'size-4' })

const appMenu = computed(() => [
  {
    group: 'App',
    hideLabel: true,
    options: [
      {
        label: 'Apps',
        icon: 'lucide-layout-grid',
        submenu: scenarios
          .filter((s) => s.logo && s.id !== 'default')
          .map((s) => ({
            label: s.label,
            icon: appLogo(s.logo!),
            // Espresso marks the current choice with a trailing check (as the
            // design's "Captions" row), not frappe-ui's filled `selected` row.
            slots:
              s.id === scenarioId.value
                ? {
                    suffix: () =>
                      h('span', {
                        class: 'lucide-check size-4 text-ink-gray-7',
                        'aria-label': 'Current app',
                      }),
                  }
                : undefined,
            onClick: () => (scenarioId.value = s.id),
          })),
      },
      { label: 'Frappe Docs', icon: 'lucide-book-open' },
      { label: 'About', icon: 'lucide-info' },
      { label: 'Login to Frappe Cloud', icon: 'lucide-cloud' },
      {
        label: 'Settings',
        icon: 'lucide-settings',
        onClick: () => (scenarioId.value = 'settings'),
      },
    ],
  },
  {
    group: 'Account',
    hideLabel: true,
    options: [{ label: 'Log out', icon: 'lucide-log-out' }],
  },
])

const rail = (icon: string, extra: Partial<ItemRow> = {}): ItemRow => ({
  type: 'item',
  label: icon,
  prefix: { icon },
  ...extra,
})

const railSettings = rail('settings', { label: 'Settings' })

const expandRow: ItemRow = {
  type: 'item',
  label: 'Expand sidebar',
  prefix: { icon: 'menu-expand' },
  onClick: () => (collapsed.value = false),
}

// Figma's compact card draws its edge with shadows rather than a border. Those
// black shadows vanish on a dark surface, so dark mode keeps the card's own
// border and lifts it onto the first elevation.
const cardClass =
  '!border-0 !bg-surface-elevation-1 shadow-[inset_0_0.25px_1.5px_0_rgba(255,255,255,0.08),0_0_1px_0_rgba(0,0,0,0.27),0_0.5px_3px_0_rgba(0,0,0,0.06)] dark:!border dark:shadow-none'
const cardButtonClass = '!text-ink-gray-7'

// 54px of the 204px track.
const storagePercent = (54 / 204) * 100

const events = [
  { time: '10:00 - 11:30AM', title: 'Branding changes', color: '#077ddf' },
  { time: '2:00 - 4:30PM', title: 'Website design meeting', color: '#d35a09' },
  {
    time: '4:00 - 4:30PM',
    title: 'Feedback loops within the design process',
    color: '#bb6f0c',
  },
]

const pickerIcons = [
  { name: 'small-left-chevron-14', label: 'Previous month' },
  { name: 'tomorrow-14', label: 'Today' },
  { name: 'small-right-chevron-14', label: 'Next month' },
]

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// June 2023, Monday-first, with the 9th selected.
const weeks = (() => {
  const cells = [
    ...[29, 30, 31].map((day) => ({ day, muted: true })),
    ...Array.from({ length: 30 }, (_, i) => ({ day: i + 1, muted: false })),
    ...[1, 2].map((day) => ({ day, muted: true })),
  ].map((c, i) => ({
    ...c,
    key: i,
    selected: !c.muted && c.day === 9,
  }))
  return Array.from({ length: 5 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
})()

const CollapseButton = defineComponent({
  emits: ['click'],
  setup(_, { emit }) {
    return () =>
      h('div', { class: 'flex h-7 items-center' }, [
        h(
          Button,
          {
            variant: 'ghost',
            size: 'sm',
            class: '!text-ink-gray-7',
            onClick: () => emit('click'),
          },
          {
            prefix: () =>
              h(EIcon, {
                name: 'menu-collapse',
                class: 'size-4 text-ink-gray-7',
              }),
            default: () => 'Collapse',
          },
        ),
      ])
  },
})
</script>
