<script setup lang="ts">
import LucideRight from '~icons/lucide/arrow-right'
</script>

<template>
  <div class="grid gap-5 max-w-7xl mx-auto">
    <div class="my-20 p-5 flex flex-col gap-5 text-center w-fit">
      <h1
        class="text-[40px] font-semibold tracing-tight leading-tight font-news"
      >
        Build Beautiful Interfaces Fast
      </h1>

      <p class="text-xl text-ink-gray-5 leading-relaxed w-3/4 mx-auto">
        Beautifully crafted components built for real world applications. Better
        defaults helping you ship faster.
      </p>

      <div class="flex gap-3 mt-2 mx-auto">
        <a
          href="/docs/getting-started"
          class="inline-flex items-center gap-2 h-8 px-2.5 rounded text-base font-medium text-ink-white bg-surface-gray-7 hover:bg-surface-gray-6 active:bg-surface-gray-5 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-3"
        >
          Get Started
          <LucideRight class="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</template>
