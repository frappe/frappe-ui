<template>
  <!-- One app layout: the sidebar, and beside it the header, the subheader
       and the page body. Fills its container; the page sets the height. -->
  <div class="flex h-full bg-surface-base">
    <EspressoSidebar
      v-if="showSidebar"
      v-model:collapsed="collapsed"
      v-model:scenario="scenario"
      :app-navigation="appNavigation"
    />

    <main class="relative flex min-w-0 flex-1 flex-col">
      <component :is="headerComponent" v-if="showHeader" :key="header" />
      <component
        :is="subheaderComponent"
        v-if="showSubheader"
        :key="subheader"
      />
      <div class="min-h-0 flex-1" />

      <!-- Preview controls — outside the design, only for switching what the
           layout shows. -->
      <ControlPanel
        v-show="showControls"
        title="Preview control"
        :class="controlsClass"
      >
        <ControlToggle
          v-model="showSidebar"
          label="Sidebar"
          :disabled="!sidebarAvailable"
        />
        <template v-if="showSidebar">
          <ControlSelect
            v-model="scenario"
            label="App"
            :options="scenarioOptions"
          />
          <ControlToggle
            v-model="collapsed"
            label="Collapsed"
            :disabled="scenario === 'settings'"
          />
          <ControlToggle
            v-model="appNavigation"
            label="App navigation"
            :disabled="scenario === 'settings'"
          />
        </template>

        <ControlToggle
          v-model="showHeader"
          label="Header"
          :disabled="inSettings"
        />
        <ControlSelect
          v-if="showHeader"
          v-model="header"
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
          v-model="subheader"
          label="Subheader type"
          :options="subheaderOptions"
        />

        <ControlToggle
          :model-value="resolvedColorScheme === 'dark'"
          label="Dark mode"
          @update:model-value="(on) => setColorScheme(on ? 'dark' : 'light')"
        />
      </ControlPanel>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useColorScheme } from '../src'
import './espresso-menu.css'
import ControlPanel from './controls/ControlPanel.vue'
import ControlSelect from './controls/ControlSelect.vue'
import ControlToggle from './controls/ControlToggle.vue'
import { headerTypes, subheaderTypes } from './espresso-header/variants'
import EspressoSidebar from './espresso-sidebar/EspressoSidebar.vue'
import { scenarios, type ScenarioId } from './espresso-sidebar/scenarios'

// The Espresso app layout — sidebar, header, subheader — with its preview
// controls. Shared by the v1 playground and the v2 "Sidebar & Header" page,
// so both always show the same thing. The page owns the initial theme.
const props = withDefaults(
  defineProps<{
    /** Show the floating preview-control card. */
    showControls?: boolean
    /** Where the control card floats. */
    controlsClass?: string
    /**
     * Whether the layout starts with its own sidebar. The v2 shell already
     * has one, so that page opens this with just the header bars.
     */
    withSidebar?: boolean
  }>(),
  {
    showControls: true,
    controlsClass: 'absolute bottom-4 right-4 max-h-[calc(100%-2rem)]',
    withSidebar: true,
  },
)

// Drives `<html data-theme>`, so every Espresso token on the page flips.
const { resolvedColorScheme, setColorScheme } = useColorScheme()

const toOptions = (list: { value: string; label: string }[]) =>
  list.map(({ value, label }) => ({ value, label }))
const scenarioOptions = scenarios.map((s) => ({ label: s.label, value: s.id }))
const headerOptions = toOptions(headerTypes)
const subheaderOptions = toOptions(subheaderTypes)

// The address bar carries the whole layout, e.g.
// `?scenario=crm&nav=1&header=tabs&subheader=off`.
const params = new URLSearchParams(location.search)

const initialScenario = params.get('scenario') as ScenarioId | null
const scenario = ref<ScenarioId>(
  scenarios.some((s) => s.id === initialScenario)
    ? initialScenario!
    : 'default',
)
// Settings has neither a collapsed variant nor the app rail.
const hasVariants = scenario.value !== 'settings'
const collapsed = ref(hasVariants && params.get('collapsed') === '1')
const appNavigation = ref(hasVariants && params.get('nav') === '1')

// `sidebar=off` hides the sidebar; a host can also open without one.
const showSidebar = ref(props.withSidebar && params.get('sidebar') !== 'off')

// `header` / `subheader` hold a type, or `off` to hide that bar.
const pick = (list: { value: string }[], key: string) => {
  const wanted = params.get(key)
  return list.some((v) => v.value === wanted) ? wanted! : list[0].value
}
const showHeader = ref(params.get('header') !== 'off')
const header = ref(pick(headerTypes, 'header'))
const showSubheader = ref(params.get('subheader') !== 'off')
const subheader = ref(pick(subheaderTypes, 'subheader'))

// Settings has neither a collapsed variant nor the app rail, and its page has
// no header or subheader: while it is open both bars are off and can't be
// switched on. Leaving Settings changes nothing; either bar can then be
// switched back on by hand.
const inSettings = computed(
  () => showSidebar.value && scenario.value === 'settings',
)

watch(
  inSettings,
  (settings) => {
    if (!settings) return
    collapsed.value = false
    appNavigation.value = false
    showHeader.value = false
    showSubheader.value = false
  },
  { immediate: true },
)

// The File and Full width headers are standalone pages with no sidebar:
// while one is showing, the sidebar is off and can't be switched on, and
// bringing one up turns the subheader off too. Picking Default or Tabs, or
// switching the header off, brings the sidebar back.
const standaloneHeaders = ['file', 'full-width']
const sidebarAvailable = computed(
  () => !(showHeader.value && standaloneHeaders.includes(header.value)),
)
if (!sidebarAvailable.value) {
  showSidebar.value = false
  // A link that opens on one of them and says nothing about the subheader
  // starts the way picking it would.
  if (!params.has('subheader')) showSubheader.value = false
}

watch([showHeader, header], ([on, type], [wasOn, wasType]) => {
  if (!sidebarAvailable.value) {
    showSidebar.value = false
    if (type !== wasType || !wasOn) showSubheader.value = false
  } else if (type !== wasType || on !== wasOn) {
    showSidebar.value = true
  }
})

const headerComponent = computed(
  () => headerTypes.find((v) => v.value === header.value)!.component,
)
const subheaderComponent = computed(
  () => subheaderTypes.find((v) => v.value === subheader.value)!.component,
)

// Keep the address bar in step, so a reload lands on the same layout.
watch(
  [
    showSidebar,
    scenario,
    collapsed,
    appNavigation,
    showHeader,
    header,
    showSubheader,
    subheader,
  ],
  () => {
    const url = new URL(location.href)
    const set = (key: string, value: string | null) =>
      value === null
        ? url.searchParams.delete(key)
        : url.searchParams.set(key, value)
    set('component', null)
    set('sidebar', showSidebar.value ? null : 'off')
    set('scenario', scenario.value)
    set('collapsed', collapsed.value ? '1' : null)
    set('nav', appNavigation.value ? '1' : null)
    set('header', showHeader.value ? header.value : 'off')
    set('subheader', showSubheader.value ? subheader.value : 'off')
    history.replaceState(null, '', url)
  },
)
</script>
