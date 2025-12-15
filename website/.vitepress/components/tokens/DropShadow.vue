<script setup lang="ts">
type DropShadowToken = {
  name: string;
  value: string | string[];
};

const props = defineProps<{
  data: DropShadowToken[];
}>();

function toFilter(value: string | string[]) {
  const values = Array.isArray(value) ? value : [value];
  return values.map((v) => `drop-shadow(${v})`).join(" ");
}
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="shadow in data"
      :key="shadow.name"
      class="grid gap-2"
    >
      <div
        class="rounded p-10 bg-surface-gray-4"
        :style="
          {
            filter: toFilter(shadow.value),
          }
        "
      />

      <span>
        {{ shadow.name }}
      </span>

      <span class="text-sm text-ink-gray-3 break-all">
        {{
          Array.isArray(shadow.value)
            ? shadow.value.join(", ")
            : shadow.value
        }}
      </span>
    </div>
  </div>
</template>
