<script setup lang="ts">
type BorderRadiusToken = {
  name: string
  value: string
}

const props = defineProps<{
  data: BorderRadiusToken[]
}>()

const data = props.data.slice(0, props.data.length - 1)
</script>

<template>
  <div class="my-10 grid grid-cols-3 gap-5">
    <div v-for="radius in data" :key="radius.name" class="grid gap-3">
      <div class="flex justify-between text-sm">
        <span class="font-medium">
          {{ 'rounded-' + radius.name }}
        </span>
        <span class="ml-1 text-xs text-ink-gray-4">
          {{ radius.value }}
        </span>
      </div>

      <!-- card -->
      <div
        class="grid gap-3 border border-outline-gray-2 bg-surface-cards p-4"
        :style="{ borderRadius: radius.value }"
      >
        <div class="borer-b flex items-center gap-3">
          <div
            class="grid size-8 place-items-center bg-surface-gray-2"
            :style="{ borderRadius: radius.value }"
          >
            <span class="text-xs font-medium">U</span>
          </div>
          <span class="whitespace-nowrap font-medium">Some Name</span>
        </div>

        <div class="grid gap-2 text-sm text-ink-gray-5">
          <span class="h-3 w-1/2 rounded-sm bg-surface-gray-2"> </span>
          <span class="h-5 w-full rounded-sm bg-surface-gray-3"> </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs text-ink-gray-4"> 8 items </span>

          <button
            class="border bg-surface-white px-3 py-1 text-xs"
            :style="{ borderRadius: radius.value }"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
