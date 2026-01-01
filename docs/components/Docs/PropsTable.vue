<script setup lang="ts">
import { Badge } from "frappe-ui";

interface itemProp {
  name: string;
  description: string;
  type: string;
  required: string;
  default: string;
}

interface Props {
  data: itemProp[];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="grid grid-cols-3 bg-surface-gray-2 rounded p-3 px-4 text-ink-gray-5"
  >
    <span>Prop</span>
    <span>Default</span>
    <span>Type </span>
  </div>

  <section class="grid grid-cols-3 p-4 w-full gap-5 overflow-auto scrollbar">
    <template v-for="(x, i) in props.data" :key="x.name">
      <Badge
        size="xl"
        :theme='x.required ? "red" : "green"'
        class="w-fit !rounded"
      >
        {{ x.name }}
      </Badge>

      <Badge class="w-fit !rounded" size="lg"> {{ x.default || "-" }} </Badge>

      <div class='flex flex-wrap gap-1'>
        <Badge
          v-for='item in x.type?.split("|")'
          size="md"
          variant="outline"
          class="!rounded border-outline-gray-2"
        >
          {{ item }}
        </Badge>

        <p class="text-sm !m-1 text-ink-gray-6">{{ x.description }}</p>
      </div>

      <hr
        v-if="i < props.data.length - 1"
        class="col-span-full !mt-0 !m-4 !-mx-4"
      />
    </template>
  </section>
</template>
