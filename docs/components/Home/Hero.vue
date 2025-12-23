<script setup lang="ts">
import { Badge, Button } from "frappe-ui";
import LucideRight from "~icons/lucide/arrow-right";
import HeroShowcase from "./HeroShowcase/index.vue";

import pkgJson from "../../../package.json";
</script>

<template>
  <div
    class="grid lg:grid-cols-2 gap-5 min-h-[calc(100vh-200px)] max-w-7xl mx-auto py-20"
  >
    <section class="flex">
      <div class="my-auto p-7 flex flex-col gap-5">
        <Badge class="w-fit" size="lg" theme="green">
          v{{ pkgJson.version }}</Badge>

        <h1 class="!text-[2.7rem] !leading-[3.5rem] font-bold tracing-tight">
          Build <span class="text-ink-violet-1"> beautiful </span> interfaces
          <span class="text-ink-violet-1"> Fast </span> and accessible
        </h1>

        <p class="text-3xl text-ink-gray-5 leading-9">
          Frappe-ui is a modern Vue component library with over 30+ polished
          components
        </p>

        <div class="flex gap-3 mt-5">
          <a
            href="/docs/getting-started"
            class="font-normal py-3 px-6 flex gap-3 items-center rounded bg-surface-gray-7 text-ink-gray-1"
          >
            Get Started
            <LucideRight class="size-4" />
          </a>

          <a
            href="/docs/badge"
            class="font-normal py-3 px-6 flex gap-3 items-center rounded bg-surface-gray-3"
          >
            Show Components
          </a>
        </div>
      </div>
    </section>

    <HeroShowcase />
  </div>
</template>
