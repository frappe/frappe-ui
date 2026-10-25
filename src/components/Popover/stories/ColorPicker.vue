<script setup lang="ts">
import { ref } from 'vue'
import { Popover } from 'frappe-ui'

const colors = [
  { name: 'Gray', class: 'bg-surface-gray-7' },
  { name: 'Blue', class: 'bg-surface-blue-7' },
  { name: 'Green', class: 'bg-surface-green-7' },
  { name: 'Amber', class: 'bg-surface-amber-7' },
  { name: 'Red', class: 'bg-surface-red-7' },
  { name: 'Violet', class: 'bg-surface-violet-7' },
]
const color = ref(colors[1])

function pick(value: typeof color.value, close: () => void) {
  color.value = value
  close()
}
</script>

<template>
  <div class="flex items-center gap-2 text-base text-ink-gray-8">
    Label color
    <Popover bare>
      <template #trigger>
        <button
          type="button"
          class="size-6 rounded-full"
          :class="color.class"
          :aria-label="`Label color: ${color.name}`"
        />
      </template>
      <template #default="{ close }">
        <div
          class="grid grid-cols-6 gap-2 rounded-5 bg-surface-gray-10 p-2 shadow-xl"
        >
          <button
            v-for="option in colors"
            :key="option.name"
            type="button"
            class="size-6 rounded-full"
            :class="option.class"
            :aria-label="option.name"
            @click="pick(option, close)"
          />
        </div>
      </template>
    </Popover>
  </div>
</template>
