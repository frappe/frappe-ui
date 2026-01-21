<script setup lang="ts">
import { Button } from 'frappe-ui'
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
        <Button href="/docs/getting-started" as="a" variant='solid' size='md'>
          Get Started
          <template #suffix>
            <LucideRight class="size-4" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
