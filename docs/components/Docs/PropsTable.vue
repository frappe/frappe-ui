<script setup lang="ts">
import { Badge } from 'frappe-ui'

interface itemProp {
  name: string
  description: string
  type: string
  required: string
  default: string
}

interface Props {
  data: itemProp[]
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="grid grid-cols-3 bg-surface-gray-2 rounded p-2 px-4 text-ink-gray-5 mb-3"
  >
    <span>Prop</span>
    <span>Default</span>
    <span>Type </span>
  </div>

  <section
    class="grid grid-cols-3 px-2 w-full gap-0 overflow-auto scrollbar not-prose"
  >
    <template v-for="(x, i) in props.data" :key="x.name">
      <Badge :theme="x.required ? 'red' : 'green'" class="w-fit !rounded-sm">
        {{ x.name }}
      </Badge>

      <Badge
        class="w-fit !rounded-sm"
        :class="{
          'whitespace-pre px-3 py-2 leading-relaxed h-full !bg-surface-gray-1':
            x.default?.includes('{'),
        }"
        :size="x.default?.includes('{') ? 'lg' : 'md'"
      >
        {{ x.default || '-' }}
      </Badge>

      <div class="flex flex-wrap h-fit gap-2">
        <Badge
          v-for="item in x.type?.split('|')"
          class="!rounded-sm border-outline-gray-2"
        >
          {{ item }}
        </Badge>

        <p class="text-sm text-ink-gray-5 leading-relaxed w-full">
          {{ x.description }}
        </p>
      </div>

      <hr v-if="i < props.data.length - 1" class="col-span-full mt-1 mb-2 -mx-1" />
    </template>
  </section>
</template>
