<script setup lang="ts">
import { Badge } from 'frappe-ui'

interface itemProp {
  name: string
  description: string
  type: string
}

interface Props {
  data: itemProp[]
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="grid grid-cols-2 bg-surface-gray-2 rounded p-2 px-4 text-ink-gray-5 mb-3"
  >
    <span>Event</span>
    <span>Payload</span>
  </div>

  <section
    class="grid grid-cols-2 px-2 w-full gap-0 overflow-auto scrollbar not-prose"
  >
    <template v-for="(x, i) in props.data" :key="x.name">
      <Badge class="w-fit !rounded-sm">
        {{ x.name }}
      </Badge>

      <div class="flex flex-wrap h-fit gap-2">
        <Badge class="!rounded-sm border-outline-gray-2">
          {{ x.type }}
        </Badge>

        <p class="text-sm text-ink-gray-5 leading-relaxed w-full">
          {{ x.description }}
        </p>
      </div>

      <hr
        v-if="i < props.data.length - 1"
        class="col-span-full mb-2 mt-1 -mx-1"
      />
    </template>
  </section>
</template>
