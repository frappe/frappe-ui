<script setup lang="ts">
import { FrappeUIProvider } from '../../src/index.ts'
import Navbar from './Navbar.vue'
import Sidebar from './Docs/Sidebar.vue'
import MobileNavSheet from './Docs/MobileNavSheet.vue'
import Home from './Home/index.vue'

import OnThisPage from './Docs/OnThisPage.vue'
import PrevNextBtns from './Docs/PrevNextBtns.vue'

import { state } from '../state.ts'

import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <FrappeUIProvider>
    <div
      v-if="frontmatter.layout === 'home'"
      class="h-full flex flex-col justify-between flex-1 w-full"
    >
      <Navbar />
      <Home />
    </div>

    <template v-else>
      <div class="grid lg:grid-cols-[220px_1fr]">
        <Sidebar class="hidden lg:flex" />

        <div class="min-w-0 w-full isolate">
          <Navbar :isDocs="true" />

          <MobileNavSheet />

          <div class="p-4 sm:p-5 lg:p-10 flex gap-5 min-w-0">
            <main class="mx-auto lg:max-w-[740px] flex-1 min-w-0">
              <Content
                as="article"
                class="prose prose-v3 prose-p:mb-4 text-[15px] !max-w-none"
                :class="frontmatter.pageClass"
              />
              <PrevNextBtns />
            </main>
            <OnThisPage v-if="frontmatter.outline !== false" />
          </div>
        </div>
      </div>
    </template>
  </FrappeUIProvider>
</template>
