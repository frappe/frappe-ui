<template>
  <!-- Espresso page header on frappe-ui's PageHeader geometry (`min-h-12`,
       `px-3 sm:px-5`, bottom rule), so its contents line up with the
       subheader's. Left and right slots are pushed apart, and the middle slot
       is centred on the full width regardless of either side. The rule is
       drawn inside the box, as Figma's inside stroke. -->
  <header
    data-slot="header"
    class="relative flex h-12 shrink-0 items-center justify-between gap-4 px-3 py-2.5 shadow-[inset_0_-1px_0_var(--outline-gray-1)] sm:px-5"
  >
    <!-- a page with its own crumb shows that alone: its name, nothing else -->
    <div v-if="pageCrumb" class="flex min-w-0 items-center gap-2">
      <Breadcrumbs :items="[{ label: pageCrumb }]" />
    </div>
    <template v-else>
      <div class="flex min-w-0 items-center gap-2">
        <slot name="left" />
      </div>
      <div
        v-if="$slots.middle"
        class="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center"
      >
        <slot name="middle" />
      </div>
      <div class="flex shrink-0 items-center justify-end gap-2">
        <slot name="right" />
      </div>
    </template>
  </header>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Breadcrumbs } from '../../src'
import { pageCrumbKey } from './pageCrumb'

const injected = inject(pageCrumbKey, null)
const pageCrumb = computed(() => injected?.value ?? null)

defineSlots<{
  left?: () => any
  middle?: () => any
  right?: () => any
}>()
</script>
