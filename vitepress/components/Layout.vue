<script setup lang="ts">
// Generic prose layout for the shared docs theme, shaped like a frappe-ui app
// shell: a Sidebar rail with the brand at its top, then a content column with
// a PageHeader strip, the prose, the on-this-page outline and prev/next.
// Consumers feed extra header controls through the `actions` slot.
import { FrappeUIProvider } from 'frappe-ui'
import { useData } from 'vitepress'

import Sidebar from './Docs/Sidebar.vue'
import Header from './Docs/Header.vue'
import OnThisPage from './Docs/OnThisPage.vue'
import PrevNextBtns from './Docs/PrevNextBtns.vue'
import MobileNavSheet from './Docs/MobileNavSheet.vue'

import { computed } from 'vue'

const { frontmatter } = useData()

defineSlots<{
  /** Extra controls placed before the site actions in the header. */
  actions?: () => any
}>()

// Per page: `outline: false` in frontmatter drops the "On this page" column.
const hasOutline = computed(() => frontmatter.value.outline !== false)

// Opt-in per page: `tableFirstCol: 16rem` in frontmatter pins every table's
// first column to the same width so multiple tables line up vertically.
const tableFirstCol = computed(() => {
  const v = frontmatter.value.tableFirstCol
  if (!v) return undefined
  return typeof v === 'number' ? `${v}px` : String(v)
})
const contentStyle = computed(() =>
  tableFirstCol.value ? { '--docs-first-col': tableFirstCol.value } : undefined,
)
</script>

<template>
  <FrappeUIProvider>
    <MobileNavSheet />
    <!-- `isolate` keeps the sticky header's z-index inside the page's own
         stacking context, so dialogs portalled to <body> still render over it. -->
    <div class="isolate grid lg:grid-cols-[var(--docs-sidebar-width)_1fr]">
      <Sidebar class="hidden lg:flex" />

      <div class="flex min-w-0 flex-col">
        <Header>
          <template #actions><slot name="actions" /></template>
        </Header>

        <!-- The prose, with the outline pinned to the right edge from lg up.
             Pages that opt out of the outline drop its column. -->
        <div
          class="grid"
          :class="hasOutline && 'lg:grid-cols-[1fr_var(--docs-toc-width)]'"
        >
          <div class="min-w-0 w-full p-4 sm:p-5 lg:p-10">
            <main class="mx-auto lg:max-w-[740px] min-w-0">
              <Content
                as="article"
                class="prose prose-v3 prose-p:mb-4 text-[15px] !max-w-none [&_h1]:mt-0 [&>*:first-child]:mt-0"
                :class="[
                  frontmatter.pageClass,
                  { 'align-tables': tableFirstCol },
                ]"
                :style="contentStyle"
              />
              <PrevNextBtns />
            </main>
          </div>

          <OnThisPage v-if="hasOutline" class="hidden lg:flex" />
        </div>
      </div>
    </div>
  </FrappeUIProvider>
</template>
