<script setup lang="ts">
import { Button } from 'frappe-ui'
import LucideBox from '~icons/lucide/box'

interface Props {
  title?: string
  previewCss?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Default',
})
</script>

<template>
  <section class="flex h-fit flex-col gap-3">
    <Button class="w-fit capitalize" size="sm">
      <template #prefix>
        <LucideBox class="size-4" />
      </template>
      {{ title }}
    </Button>

    <div
      class="scrollbar overflow-auto rounded border border-outline-gray-2 p-5"
      :class="props.previewCss"
    >
      <slot />
    </div>
  </section>
</template>
