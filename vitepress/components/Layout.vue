<script setup lang="ts">
// Generic prose layout for the shared docs theme: sidebar + content +
// on-this-page + prev/next. The default Navbar renders in the `navbar` slot;
// consumers override the whole slot, or feed extras to Navbar's own slots.
import { FrappeUIProvider } from 'frappe-ui'
import { useData } from 'vitepress'

import Sidebar from './Docs/Sidebar.vue'
import OnThisPage from './Docs/OnThisPage.vue'
import PrevNextBtns from './Docs/PrevNextBtns.vue'
import Navbar from './Navbar.vue'
import MobileNavSheet from './Docs/MobileNavSheet.vue'

import { computed } from 'vue'

const { frontmatter } = useData()

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
    <!-- `isolate` keeps the navbar's z-index inside the page's own stacking
         context, so dialogs portalled to <body> still render over it. -->
    <div class="isolate">
      <!-- Full-width site chrome. Consumers override the whole slot, or pass
           extras to the default Navbar's #actions/#brand/#search slots. -->
      <slot name="navbar">
        <Navbar :is-docs="true" />
      </slot>

      <div class="grid lg:grid-cols-[220px_1fr]">
        <Sidebar class="hidden lg:flex" />

        <div class="min-w-0 w-full">
          <!-- Capped and centered: without it the prose + outline pair drifts
               left of the free space on wide screens. -->
          <div
            class="p-4 sm:p-5 lg:p-10 flex gap-5 min-w-0 mx-auto w-full max-w-[1080px]"
          >
            <main class="mx-auto lg:max-w-[740px] flex-1 min-w-0">
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
            <OnThisPage v-if="frontmatter.outline !== false" />
          </div>
        </div>
      </div>
    </div>
  </FrappeUIProvider>
</template>
