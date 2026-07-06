<script setup lang="ts">
import LucideRight from '~icons/lucide/arrow-right'
import { withBase } from 'vitepress'
</script>

<template>
  <div class="grid gap-5 max-w-7xl mx-auto w-full">
    <div class="my-12 px-4 sm:px-5 flex flex-col text-center mx-auto">
      <h1
        class="text-6xl-semibold sm:text-8xl-semibold !tracking-[-0.01em] text-ink-gray-8"
      >
        Build Beautiful Interfaces Fast
      </h1>

      <p class="sm:mt-3 text-p-base sm:text-p-lg text-ink-gray-6 mx-auto">
        Battle tested components built for real world applications. <br />Good
        defaults helping you ship faster.
      </p>

      <div class="flex gap-3 mt-6 mx-auto">
        <a
          :href="withBase('/docs/getting-started')"
          class="inline-flex items-center gap-2 h-8 px-2.5 rounded text-base font-medium text-ink-base bg-surface-gray-10 hover:bg-surface-gray-9 active:bg-surface-gray-8 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-3"
        >
          Get Started
          <LucideRight class="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</template>
