<script setup lang="ts">
import { Badge, Button } from 'frappe-ui'
import LucideRight from '~icons/lucide/arrow-right'

import pkgJson from '../../../package.json'
</script>

<template>
  <div class="grid gap-5 max-w-7xl mx-auto">
    <div class="mt-10 p-5 flex flex-col gap-5 text-center w-fit">
      <h1
        class="text-[40px] font-semibold tracing-tight leading-tight !m-0 relative"
      >
        <Badge class="absolute -top-8" size="lg" theme="green">
          v{{ pkgJson.version }}
        </Badge>
        Build Beautiful Interfaces Fast
      </h1>

      <p class="text-xl text-ink-gray-5 leading-relaxed w-3/4 mx-auto">
        Beautifully crafted components built for real world applications. Better
        defaults helping you ship faster.
      </p>

      <div class="flex gap-3 mt-2 mx-auto">
        <Button href="/docs" as="a" variant='solid' size='md'>
          Get Started
          <template #suffix>
            <LucideRight class="size-4" />
          </template>
        </Button>

        <Button href="/docs/components/button" as='a' size='md'> Show Components </Button>
      </div>
    </div>
  </div>
</template>
