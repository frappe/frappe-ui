<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const _data = props.data.slice(0, props.data.length - 2)
</script>

<template>
  <div class="grid grid-cols-3 gap-5">
    <template v-for="color in _data" :key="color.name">
      <h2 :id="color.name" v-if="!color.value" class="capitalize col-span-full">
        {{ color.name }}
      </h2>

      <div v-else class="grid gap-2">
        <div
          class="rounded border-2 flex items-end p-5"
          :style="{ borderColor: color.value }"
        ></div>
        <span>{{ color.name }}</span>
        <span class="text-sm text-ink-gray-3">{{ color.value }}</span>
      </div>
    </template>
  </div>
</template>
