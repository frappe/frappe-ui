<script setup lang="ts">
import { Button } from "frappe-ui";
import LucideRight from "~icons/lucide/arrow-right";
import HeroShowcase from "./HeroShowcase/index.vue";
</script>

<template>
  <div
    class="grid lg:grid-cols-2 gap-5 min-h-[calc(100vh-200px)] max-w-7xl mx-auto py-20"
  >
    <section class="flex">
      <div class="my-auto p-7 flex flex-col gap-5">
        <h1 class="!text-[2.7rem] !leading-[3.5rem] font-bold tracing-tight">
          Build <span class="text-ink-violet-1"> beautiful </span> interfaces
          <span class="text-ink-violet-1"> Fast </span> and accessible
        </h1>

        <p class="text-3xl text-ink-gray-5 leading-9">
          Frappe-ui is a modern Vue component library with over 30+ polished
          components
        </p>

        <div class="flex gap-3 mt-5">
          <Button variant="solid" size="lg" class="font-normal px-6">
            Get Started
            <template #suffix>
              <LucideRight class="size-4" />
            </template>
          </Button>

          <Button vriant="outline" size="lg" class="font-normal px-6">
            Show Components
          </Button>
        </div>
      </div>
    </section>

    <HeroShowcase />
  </div>
</template>
