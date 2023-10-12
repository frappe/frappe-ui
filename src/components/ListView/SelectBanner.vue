<template>
  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="selections.size"
      class="fixed inset-x-0 bottom-6 mx-auto w-max text-base"
    >
      <div
        class="flex w-[596px] items-center space-x-3 rounded-lg bg-white px-4 py-2 shadow-2xl"
      >
        <div
          class="flex flex-1 justify-between border-r border-gray-300 text-gray-900"
        >
          <div class="flex items-center space-x-3">
            <Checkbox
              :modelValue="true"
              :disabled="true"
              class="text-gray-900"
            />
            <div>{{ selectedText }}</div>
          </div>
          <div class="mr-3">
            <slot></slot>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <Button
            class="w- text-gray-700"
            :disabled="allRowsSelected"
            :class="allRowsSelected ? 'cursor-not-allowed' : ''"
            variant="ghost"
            @click="toggleAllRows(true)"
          >
            Select all
          </Button>
          <Button icon="x" variant="ghost" @click="toggleAllRows(false)" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Checkbox from '../Checkbox.vue'
import Button from '../Button.vue'
import { computed, inject } from 'vue'

let selectedText = computed(() => {
  let title = selections.size === 1 ? list.singular_label : list.plural_label
  return `${selections.size} ${title} selected`
})

const { list, selections, allRowsSelected, toggleAllRows } = inject('list')
</script>
