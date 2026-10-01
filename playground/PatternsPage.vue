<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Component } from 'vue'

export type Pattern = {
  id: string
  title: string
  component: Component
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
  }>(),
  { width: '700px' },
)

// Namespaced: the lucide sprite puts <symbol id="table"> and <symbol id="list">
// in the page, and a bare id would resolve to those instead of the section.
const sectionId = (id: string) => `pattern-${id}`

// Which pattern the rail marks as current: the last one whose top has crossed a
// reading line a quarter of the way down the viewport. A scroll listener rather
// than an IntersectionObserver, which doesn't fire on these pages.
const active = ref(props.patterns[0]?.id ?? '')

function updateActive() {
  const line = window.innerHeight * 0.25
  let current = props.patterns[0]?.id ?? ''
  for (const pattern of props.patterns) {
    const section = document.getElementById(sectionId(pattern.id))
    if (section && section.getBoundingClientRect().top <= line) {
      current = pattern.id
    }
  }
  active.value = current
}

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', updateActive)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
  window.removeEventListener('resize', updateActive)
})
</script>

<template>
  <!--
    The outline keeps one place on every page — 220px wide, 24 from the right
    edge — and the patterns centre in what is left between it and the sidebar,
    whatever width they are. Nothing shifts as you move between patterns.
  -->
  <div class="flex min-h-full bg-surface-base">
    <div class="flex min-w-0 flex-1 justify-center px-6 py-12">
      <div class="flex max-w-full flex-col gap-16" :style="{ width }">
        <header class="flex min-w-0 flex-col gap-1">
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
        >
          <h2 class="text-3xl-semibold text-ink-gray-8">{{ pattern.title }}</h2>
          <component :is="pattern.component" />
        </section>

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
      </nav>
    </aside>
  </div>
</template>
