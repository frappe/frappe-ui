<script setup lang="ts">
import LucideCopy from '~icons/lucide/copy'
import { Button } from 'frappe-ui'

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

const copyToClipboard = (txt: string) => {
  navigator.clipboard.writeText(txt)
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

        <Button class="group relative" @click="copyToClipboard(color.name)">
          <span
            class="absolute flex items-center inset-0 justify-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            <LucideCopy class="size-4" /> Copy
          </span>

          <span class="transition-opacity duration-150 group-hover:opacity-0">
            {{ formatColor(color.name) }}
          </span>
        </Button>
      </div>
    </template>
  </div>
</template>
