<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { Component } from 'vue'
import { PATTERNS_ACTIVE } from './patternsRail'

export type Pattern = {
  id: string
  title: string
  component: Component
  /** Props handed to the component, when one component draws several. */
  props?: Record<string, unknown>
}

const props = withDefaults(
  defineProps<{
    /** Page title, e.g. "Table patterns". */
    title: string
    /** One line under the title. */
    description?: string
    /** The patterns to stack down the page, in order. */
    patterns: Pattern[]
    /** Width of the content column. Patterns set their own widths inside it. */
    width?: string
    /** Centre the title, the headings and the patterns in the column. */
    centered?: boolean
    /** Keep the pattern titles for screen readers only — the outline
     * already names the one in view. */
    hideTitles?: boolean
    /** Space between one pattern and the next (default 64px). */
    gap?: string
  }>(),
  { width: '700px', centered: false, hideTitles: false, gap: '64px' },
)

// Namespaced: the lucide sprite puts <symbol id="table"> and <symbol id="list">
// in the page, and a bare id would resolve to those instead of the section.
const sectionId = (id: string) => `pattern-${id}`

// Which pattern the rail marks as current: the last one whose top has crossed a
// reading line a quarter of the way down the scroller. A scroll listener rather
// than an IntersectionObserver, which doesn't fire on these pages.
const active = ref(props.patterns[0]?.id ?? '')
// a pattern that keeps its own controls teleports them under the outline
// (`#patterns-rail`) while it is the one in view
provide(PATTERNS_ACTIVE, active)

// The page scrolls in whatever its shell gives it: the document, or — in the
// v2 shell, where every page owns its `overflow-y-auto` box — the nearest
// ancestor that scrolls. Found on mount; the listener goes on that.
const root = ref<HTMLElement | null>(null)
let scroller: HTMLElement | Window = window

function findScroller(el: HTMLElement | null): HTMLElement | Window {
  for (
    let n = el?.parentElement;
    n && n !== document.body;
    n = n.parentElement
  ) {
    const { overflowY } = getComputedStyle(n)
    if (overflowY === 'auto' || overflowY === 'scroll') return n
  }
  return window
}

// Room after the last pattern, so that even a short one can be scrolled up
// to the top of the view — where the outline marks it, and where a click on
// its outline row takes it — rather than the page ending first.
const tail = ref(0)
function sizeTail() {
  const last = props.patterns[props.patterns.length - 1]
  const section = last && document.getElementById(sectionId(last.id))
  if (!section) return
  const view =
    scroller instanceof Window
      ? window.innerHeight
      : scroller.getBoundingClientRect().height
  // the view less the section, the column's 48 of top margin and its 48 of
  // bottom padding, and the gap the spacer itself stands after
  tail.value = Math.max(
    0,
    Math.round(view - section.offsetHeight - 96 - parseFloat(props.gap)),
  )
}

function updateActive() {
  const box =
    scroller instanceof Window
      ? { top: 0, height: window.innerHeight }
      : scroller.getBoundingClientRect()
  const line = box.top + box.height * 0.25
  let current = props.patterns[0]?.id ?? ''
  for (const pattern of props.patterns) {
    const section = document.getElementById(sectionId(pattern.id))
    if (section && section.getBoundingClientRect().top <= line) {
      current = pattern.id
    }
  }
  // the last patterns may be shorter than the view, so their tops never
  // reach the line: at the foot of the page, the last one is in view
  const atFoot =
    scroller instanceof Window
      ? window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      : scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
  const canScroll =
    scroller instanceof Window
      ? document.documentElement.scrollHeight > window.innerHeight
      : scroller.scrollHeight > scroller.clientHeight
  if (atFoot && canScroll)
    current = props.patterns[props.patterns.length - 1]?.id ?? current
  active.value = current
}

function onResize() {
  sizeTail()
  updateActive()
}

onMounted(() => {
  scroller = findScroller(root.value)
  sizeTail()
  updateActive()
  scroller.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  scroller.removeEventListener('scroll', updateActive)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <!--
    The outline keeps one place on every page — 220px wide, 24 from the right
    edge — and the patterns centre in what is left between it and the sidebar,
    whatever width they are. Nothing shifts as you move between patterns.
  -->
  <div ref="root" class="flex min-h-full bg-surface-base">
    <div class="flex min-w-0 flex-1 justify-center px-6 py-12">
      <div class="flex max-w-full flex-col" :style="{ width, rowGap: gap }">
        <header
          class="flex min-w-0 flex-col gap-1"
          :class="centered && 'self-center'"
        >
          <h1 class="text-4xl-semibold text-ink-gray-9">{{ title }}</h1>
          <p v-if="description" class="text-p-base text-ink-gray-6">
            {{ description }}
          </p>
        </header>

        <section
          v-for="pattern in patterns"
          :id="sectionId(pattern.id)"
          :key="pattern.id"
          class="flex scroll-mt-12 flex-col gap-6"
          :class="centered && 'items-center'"
        >
          <h2
            class="text-3xl-semibold text-ink-gray-8"
            :class="hideTitles && 'sr-only'"
          >
            {{ pattern.title }}
          </h2>
          <component :is="pattern.component" v-bind="pattern.props" />
        </section>

        <div v-if="tail" aria-hidden="true" :style="{ height: `${tail}px` }" />

        <p v-if="!patterns.length" class="text-p-base text-ink-gray-5">
          No patterns here yet.
        </p>
      </div>
    </div>

    <!--
      The rail, as frappe-ui's docs draw it: a hairline down the list with the
      current pattern's segment darkened. Dropped when the window is too narrow
      to spare the column.
    -->
    <aside
      v-if="patterns.length"
      class="hidden w-[244px] shrink-0 py-12 pr-6 lg:block"
    >
      <nav class="sticky top-12 w-[220px]" aria-label="Patterns">
        <div class="text-base-medium text-ink-gray-8">On this page</div>
        <ul class="mt-3 border-l border-outline-gray-1">
          <li v-for="pattern in patterns" :key="pattern.id">
            <a
              :href="`#${sectionId(pattern.id)}`"
              class="-ml-px block border-l py-1.5 pl-3 text-base transition-colors"
              :class="
                active === pattern.id
                  ? 'border-outline-gray-4 text-ink-gray-8'
                  : 'border-transparent text-ink-gray-6 hover:text-ink-gray-8'
              "
              :aria-current="active === pattern.id ? 'true' : undefined"
              @click="active = pattern.id"
            >
              {{ pattern.title }}
            </a>
          </li>
        </ul>
        <!-- the page's own controls, for the pattern in view -->
        <slot name="rail" :active="active" />
        <div id="patterns-rail" />
      </nav>
    </aside>
  </div>
</template>
