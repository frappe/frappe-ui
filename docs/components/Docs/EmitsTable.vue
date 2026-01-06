<script setup lang="ts">
import { Badge } from "frappe-ui";

interface itemProp {
  name: string;
  description: string;
  type: string;
}

interface Props {
  data: itemProp[];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="grid grid-cols-2 bg-surface-gray-2 rounded p-3 px-4 text-ink-gray-5"
  >
    <span>Slots (default)</span>
    <span>Payload </span>
  </div>

  <section class="grid grid-cols-2 gap-y-3  p-4 w-full overflow-auto scrollbar">
    <template v-for="(x, i) in props.data" :key="x.name">
      <Badge size="xl"  class="w-fit !rounded">
        {{ x.name }}
      </Badge>

      <div>
        <Badge
          size="md"
          variant="outline"
          class="w-fit !rounded border-outline-gray-2"
        >
          <span> {{ x.type }} </span>
        </Badge>

        <p class="text-sm leading-relaxed  text-ink-gray-6">{{ x.description }}</p>
      </div>

      <hr
        v-if="i < props.data.length - 1"
        class="col-span-full !-mx-4"
      />
    </template>
  </section>
</template>
