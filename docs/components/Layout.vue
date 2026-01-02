<script setup lang="ts">
import Navbar from "./Navbar.vue";
import Sidebar from "./Docs/Sidebar.vue";
import Home from "./Home/index.vue";

import OnThisPage from "./Docs/OnThisPage.vue";
import PrevNextBtns from "./Docs/PrevNextBtns.vue";

import { state } from "../state.ts";

import { useData } from "vitepress";
const { frontmatter } = useData();
</script>

<template>
  <div
    v-if='frontmatter.layout === "home"'
    class="h-full flex flex-col justify-between flex-1 w-full"
  >
    <Navbar />
    <Home />
  </div>

  <template v-else>
    <div class="grid grid-cols-[auto_1fr]">
      <Sidebar class="hidden lg:flex" />

      <div class="w-full">
        <Navbar :isDocs="true" />
        <Sidebar v-if="state.mobsidebar" class="lg:hidden" />

        <div class="p-5 lg:p-10 flex gap-5">
          <main class="mx-auto lg:max-w-[740px] flex-1">
            <Content as="article" class="prose prose-sm !max-w-none" />
            <PrevNextBtns />
          </main>
          <OnThisPage />
        </div>
      </div>
    </div>
  </template>
</template>
