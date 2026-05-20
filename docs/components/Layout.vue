<script setup lang="ts">
import { FrappeUIProvider } from '../../src/index.ts'
import Navbar from './Navbar.vue'
import Sidebar from './Docs/Sidebar.vue'
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

          <Transition
            enter-active-class="transition-opacity duration-200"
            leave-active-class="transition-opacity duration-150"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div
              v-if="state.mobsidebar"
              class="lg:hidden fixed inset-0 bg-black/40 z-20"
              @click="state.mobsidebar = false"
              aria-hidden="true"
            />
          </Transition>

          <Transition
            enter-active-class="transition-transform duration-200"
            leave-active-class="transition-transform duration-150"
            enter-from-class="-translate-x-full"
            leave-to-class="-translate-x-full"
          >
            <div
              v-if="state.mobsidebar"
              class="lg:hidden fixed left-0 top-0 z-30 w-72 max-w-[80vw] h-screen shadow-xl"
            >
              <Sidebar />
            </div>
          </Transition>

          <div class="p-4 sm:p-5 lg:p-10 flex gap-5 min-w-0">
            <main class="mx-auto lg:max-w-[740px] flex-1 min-w-0">
              <Content
                as="article"
                class="prose prose-v3 prose-p:mb-4 text-[15px] !max-w-none"
              />
              <PrevNextBtns />
            </main>
            <OnThisPage />
          </div>
        </div>
      </div>
    </template>
  </FrappeUIProvider>
</template>
