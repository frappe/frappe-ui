<script setup>
defineProps({
  item: { type: Object, required: true },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="flex w-full min-w-0 items-center rounded px-2 py-2 text-base font-medium text-gray-800"
    :class="{ 'bg-gray-200': active }"
  >
    <component
      :is="item.icon"
      v-if="item.icon"
      class="mr-3 h-4 w-4 text-gray-700"
    />
    <span class="overflow-hidden text-ellipsis whitespace-nowrap">
      {{ item.title }}
    </span>
    <span
      v-if="item.description"
      class="ml-auto whitespace-nowrap pl-2 text-gray-600"
    >
      {{ item.description }}
    </span>
  </div>
</template>
