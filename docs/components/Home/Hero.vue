<script setup lang="ts">
import { Badge } from "frappe-ui";
import LucideRight from "~icons/lucide/arrow-right";

import pkgJson from "../../../package.json";
</script>

<template>
  <div
    class="grid gap-5 max-w-7xl mx-auto"
  >
    <div class="mt-10 p-5 flex flex-col gap-5 text-center w-fit">
      <h1
        class="text-[48px] font-semibold tracing-tight leading-tight !m-0 relative"
      >
        <Badge class="absolute -top-8" size="lg" theme="green">
          v{{ pkgJson.version }}
        </Badge>
        Build Beautiful Interfaces Fast
      </h1>

      <p class="text-2xl text-ink-gray-5 leading-relaxed w-3/4 mx-auto">
        Beautifully crafted components built for real world applications. Better
        defaults helping you ship faster.
      </p>

      <div class="flex gap-3 mt-2 mx-auto">
        <a
          href="/docs"
          class="font-normal px-2.5 h-8 flex gap-3 items-center rounded bg-surface-gray-7 text-ink-gray-1"
        >
          Get Started
          <LucideRight class="size-4" />
        </a>

        <a
          href="/docs/components"
          class="font-normal px-2.5 h-8 flex gap-3 items-center rounded bg-surface-gray-3"
        >
          Show Components
        </a>
      </div>
    </div>
  </div>
</template>
