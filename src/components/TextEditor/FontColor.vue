<template>
  <Popover transition="default">
    <template #target="{ togglePopover, isOpen }">
      <slot
        v-bind="{ onClick: () => togglePopover(), isActive: isOpen }"
      ></slot>
    </template>
    <template #body-main>
      <div class="p-2">
        <div class="text-sm text-ink-gray-7">Text Color</div>
        <div class="mt-1 grid grid-cols-6 gap-1">
          <Tooltip
            class="flex"
            v-for="color in foregroundColors"
            :key="color.name"
            :text="color.name"
          >
            <button
              :aria-label="color.name"
              class="flex h-5 w-5 items-center justify-center rounded border text-base"
              :class="color.class"
              @click="setForegroundColor(color)"
            >
              A
            </button>
          </Tooltip>
        </div>
        <div class="mt-2 text-sm text-ink-gray-7">Background Color</div>
        <div class="mt-1 grid grid-cols-6 gap-1">
          <Tooltip
            class="flex"
            v-for="color in backgroundColors"
            :key="color.name"
            :text="color.name"
          >
            <button
              :aria-label="color.name"
              class="flex h-5 w-5 items-center justify-center rounded border text-base text-ink-gray-9"
              :class="color.class"
              @click="setBackgroundColor(color)"
            >
              A
            </button>
          </Tooltip>
        </div>
      </div>
    </template>
  </Popover>
</template>
<script>
import Popover from '../Popover/Popover.vue'
import { Tooltip } from '../../index'

export default {
  name: 'FontColor',
  props: ['editor'],
  components: { Popover, Tooltip },
  methods: {
    setBackgroundColor(color) {
      if (color.name != 'Default') {
        this.editor
          .chain()
          .focus()
          .toggleHighlightByName(color.name.toLowerCase())
          .run()
      } else {
        this.editor.chain().focus().unsetHighlight().run()
      }
    },
    setForegroundColor(color) {
      if (color.name != 'Default') {
        this.editor
          .chain()
          .focus()
          .setColorByName(color.name.toLowerCase())
          .run()
      } else {
        this.editor.chain().focus().unsetColor().run()
      }
    },
  },
  computed: {
    foregroundColors() {
      return [
        { name: 'Default', class: 'text-ink-gray-9' },
        { name: 'Red', class: 'text-red-600 dark:text-dark-red-400' },
        { name: 'Orange', class: 'text-orange-600 dark:text-dark-orange-400' },
        { name: 'Yellow', class: 'text-yellow-600 dark:text-dark-yellow-400' },
        { name: 'Green', class: 'text-green-600 dark:text-dark-green-400' },
        { name: 'Teal', class: 'text-teal-600 dark:text-dark-teal-400' },
        { name: 'Cyan', class: 'text-cyan-600 dark:text-dark-cyan-400' },
        { name: 'Blue', class: 'text-blue-600 dark:text-dark-blue-400' },
        { name: 'Purple', class: 'text-purple-600 dark:text-dark-purple-400' },
        { name: 'Pink', class: 'text-pink-600 dark:text-dark-pink-400' },
        { name: 'Gray', class: 'text-gray-600 dark:text-dark-gray-400' },
      ]
    },
    backgroundColors() {
      return [
        { name: 'Default', class: 'border-outline-gray-modals' },
        {
          name: 'Red',
          class: 'bg-red-100 dark:bg-dark-red-800 border-transparent',
        },
        {
          name: 'Orange',
          class: 'bg-orange-100 dark:bg-dark-orange-800 border-transparent',
        },
        {
          name: 'Yellow',
          class: 'bg-yellow-100 dark:bg-dark-yellow-800 border-transparent',
        },
        {
          name: 'Green',
          class: 'bg-green-100 dark:bg-dark-green-800 border-transparent',
        },
        {
          name: 'Teal',
          class: 'bg-teal-100 dark:bg-dark-teal-800 border-transparent',
        },
        {
          name: 'Cyan',
          class: 'bg-cyan-100 dark:bg-dark-cyan-800 border-transparent',
        },
        {
          name: 'Blue',
          class: 'bg-blue-100 dark:bg-dark-blue-800 border-transparent',
        },
        {
          name: 'Purple',
          class: 'bg-purple-100 dark:bg-dark-purple-800 border-transparent',
        },
        {
          name: 'Pink',
          class: 'bg-pink-100 dark:bg-dark-pink-800 border-transparent',
        },
        {
          name: 'Gray',
          class: 'bg-gray-100 dark:bg-dark-gray-800 border-transparent',
        },
      ]
    },
  },
}
</script>
