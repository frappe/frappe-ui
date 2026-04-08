<script setup lang="ts">
import LucideRight from '~icons/lucide/arrow-right'
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-5">
    <div class="my-20 flex w-fit flex-col gap-5 p-5 text-center">
      <h1 class="tracing-tight font-news text-[40px] font-semibold leading-tight">
        Build Beautiful Interfaces Fast
      </h1>

      <p class="mx-auto w-3/4 text-xl leading-relaxed text-ink-gray-5">
        Beautifully crafted components built for real world applications. Better defaults helping
        you ship faster.
      </p>

      <div class="mx-auto mt-2 flex gap-3">
        <a
          href="/docs/getting-started"
          class="inline-flex h-8 items-center gap-2 rounded bg-surface-gray-7 px-2.5 text-base font-medium text-ink-white transition-colors hover:bg-surface-gray-6 focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-3 active:bg-surface-gray-5"
        >
          Get Started
          <LucideRight class="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</template>
