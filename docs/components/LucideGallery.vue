<script setup lang="ts">
import { computed, ref } from 'vue'
import * as LucideIcons from 'lucide-static'
import { TextInput } from 'frappe-ui'
import { TooltipBubble } from 'frappe-ui'
import { TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

// Every lucide-static export is a full <svg>…</svg> string. The class
// attribute already encodes the kebab-case name (e.g. `lucide lucide-house`),
// so we read the name from there rather than reinventing PascalCase→kebab.
const icons = Object.values(LucideIcons as Record<string, unknown>)
  .filter((value): value is string => typeof value === 'string')
  .map((svg) => {
    const nameMatch = svg.match(/lucide lucide-([\w-]+)/)
    const name = nameMatch ? nameMatch[1] : 'unknown'
    // Match the rest of the design system's lighter stroke weight.
    const normalized = svg.replace(
      /stroke-width="[^"]+"/g,
      'stroke-width="1.5"',
    )
    return { name, svg: normalized }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const query = ref('')

const filteredIcons = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return icons
  return icons.filter((icon) => icon.name.includes(q))
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
      <TextInput v-model="query" placeholder="Search icons…" class="w-full">
        <template #prefix>
          <span class="lucide-search size-4 text-ink-gray-5" />
        </template>
        <template #suffix>
          <span class="text-p-sm shrink-0 text-ink-gray-5">
            {{ filteredIcons.length }} of {{ icons.length }}
          </span>
        </template>
      </TextInput>
    </div>

    <div class="h-[450px] overflow-auto">
      <TooltipProvider
        v-if="filteredIcons.length > 0"
        :delay-duration="300"
        :skip-delay-duration="1000"
      >
        <div
          class="grid grid-cols-[repeat(auto-fill,56px)] gap-1 justify-center"
        >
          <TooltipRoot v-for="icon in filteredIcons" :key="icon.name">
            <TooltipTrigger as-child>
              <div
                class="flex size-14 items-center justify-center rounded text-ink-gray-7 hover:bg-surface-gray-2"
              >
                <span class="size-6 [&>svg]:size-full" v-html="icon.svg" />
              </div>
            </TooltipTrigger>
            <TooltipBubble :text="icon.name" />
          </TooltipRoot>
        </div>
      </TooltipProvider>

      <p v-else class="p-6 text-p-sm text-ink-gray-5">
        No icons match "{{ query }}".
      </p>
    </div>
  </div>
</template>
