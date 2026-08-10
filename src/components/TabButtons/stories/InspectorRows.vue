<script setup>
import { ref } from 'vue'
import { TabButtons, TextInput } from 'frappe-ui'

const direction = ref('vertical')
const overflowX = ref('hide')
const align = ref('start')
const style = ref('alphabet')
const radius = ref('0')
const radiusMode = ref('all')
const wrap = ref('no')

const directions = [
  { label: 'Horizontal', value: 'horizontal', icon: 'lucide-move-horizontal' },
  { label: 'Vertical', value: 'vertical', icon: 'lucide-move-vertical' },
]

const overflows = [
  { label: 'Visible', value: 'visible', icon: 'lucide-eye' },
  { label: 'Hidden', value: 'hide', icon: 'lucide-eye-off' },
  { label: 'Scroll', value: 'scroll', icon: 'lucide-arrow-down-to-line' },
  { label: 'Auto', value: 'auto' },
]

const aligns = [
  { label: 'Align start', value: 'start', icon: 'lucide-align-start-vertical' },
  {
    label: 'Align center',
    value: 'center',
    icon: 'lucide-align-center-vertical',
  },
  { label: 'Align end', value: 'end', icon: 'lucide-align-end-vertical' },
]

const styles = [
  { label: 'Alphabet list', value: 'alphabet', icon: 'lucide-letter-text' },
  { label: 'Bullet list', value: 'bullet', icon: 'lucide-list' },
  { label: 'Numbered list', value: 'numbered', icon: 'lucide-list-ordered' },
]

const radiusModes = [
  { label: 'All corners', value: 'all', icon: 'lucide-square' },
  { label: 'Individual corners', value: 'individual', icon: 'lucide-scan' },
]

const wraps = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]
</script>

<template>
  <div class="flex w-72 flex-col gap-3">
    <div class="flex items-center justify-between gap-4">
      <div class="text-base text-ink-gray-7">Direction</div>
      <TabButtons
        v-model="direction"
        :options="directions"
        fluid
        class="w-36"
      />
    </div>
    <div class="flex items-center justify-between gap-4">
      <div class="text-base text-ink-gray-7">Overflow X</div>
      <TabButtons v-model="overflowX" :options="overflows" fluid class="w-36" />
    </div>
    <div class="flex items-center justify-between gap-4">
      <div class="text-base text-ink-gray-7">Align</div>
      <TabButtons v-model="align" :options="aligns" fluid class="w-36" />
    </div>
    <div class="flex items-center justify-between gap-4">
      <div class="text-base text-ink-gray-7">Style</div>
      <TabButtons v-model="style" :options="styles" fluid class="w-36" />
    </div>
    <div class="flex items-center justify-between gap-4">
      <div class="text-base text-ink-gray-7">Border radius</div>
      <div class="flex w-36 items-center gap-2">
        <TextInput v-model="radius" class="min-w-0 flex-1" />
        <TabButtons v-model="radiusMode" :options="radiusModes" />
      </div>
    </div>
    <div class="flex items-center justify-between gap-4">
      <div class="text-base text-ink-gray-7">Wrap</div>
      <TabButtons v-model="wrap" :options="wraps" fluid class="w-36" />
    </div>
  </div>
</template>
