<script setup lang="ts">
import { useData } from 'vitepress'

import { state } from '../state.ts'
import OnThisPage from './Docs/OnThisPage.vue'
import PrevNextBtns from './Docs/PrevNextBtns.vue'
import Sidebar from './Docs/Sidebar.vue'
import Home from './Home/index.vue'
import Navbar from './Navbar.vue'
const { frontmatter } = useData()
</script>

<template>
  <div
    v-if="frontmatter.layout === 'home'"
    class="flex h-full w-full flex-1 flex-col justify-between"
  >
    <Navbar />
    <Home />
  </div>

  <template v-else>
    <div class="grid lg:grid-cols-[auto_1fr]">
      <Sidebar class="hidden lg:flex" />

      <div class="w-full">
        <Navbar :isDocs="true" />
        <Sidebar v-if="state.mobsidebar" class="lg:hidden" />

        <div class="flex gap-5 p-5 lg:p-10">
          <main class="mx-auto flex-1 lg:max-w-[740px]">
            <Content as="article" class="prose prose-sm !max-w-none" />
            <PrevNextBtns />
          </main>
          <OnThisPage />
        </div>
      </div>
    </div>
  </template>
</template>
