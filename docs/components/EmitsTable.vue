<script setup lang="ts">
import Badge from "@/srcomponents/Badge/Badge.vue";

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
  <h3 class="!mb-6">Emit Events</h3>

  <div
    class="grid grid-cols-2 bg-surface-gray-2 rounded p-3 px-4 text-ink-gray-5"
  >
    <span>Slots (default)</span>
    <span>Payload </span>
  </div>

  <section class="grid grid-cols-2 border-b border-outline-gray-2 p-4 w-full">
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

        <p class="text-sm !m-1 text-ink-gray-6">{{ "hiii sdf sdfsdf" }}</p>
      </div>

      <hr
        v-if="i < props.data.length - 1"
        class="col-span-full !mt-0 !m-4 !-mx-4"
      />
    </template>
  </section>
</template>
