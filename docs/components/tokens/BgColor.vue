<script setup>
defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const formatColor = (color) => {
  const arr = color.split('-')
  return arr.slice(2).join('-')
}
</script>

<template>
  <p class="text-bsae">
    Background colors in Frappe UI are prefixed with "surface", for example:
    surface-gray2
    <br />
    classes would be: bg-surface-gray-2, bg-surface-cards etc
  </p>

  <div class="flex flex-wrap gap-5">
    <template v-for="color in data" :key="color.name">
      <h2 :id="color.name" v-if="!color.value" class="capitalize w-full">
        {{ color.name }}
      </h2>

      <div class="grid gap-3" v-else>
        <div
          v-if="color.value"
          class="rounded size-20"
          :style="{ backgroundColor: color.value }"
        ></div>
        <span
          class="whitespace-nowrap bg-surface-gray-2 p-1 py-1.5 text-sm rounded-sm text-center w-20"
        >
          {{ formatColor(color.name) }}
        </span>
      </div>
    </template>
  </div>
</template>
