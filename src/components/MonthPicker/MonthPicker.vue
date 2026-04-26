<script setup lang="ts">
import { computed, ref } from 'vue'
import { MonthPickerProps } from './types'

import Button from '../Button/Button.vue'
import Popover from '../Popover/Popover.vue'

const props = withDefaults(defineProps<MonthPickerProps>(), {
  placeholder: 'Select month',
})

const viewMode = ref('month')
const model = defineModel<String>({ default: '' })

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const currentYear = ref(new Date().getFullYear())

const yearRangeStart = computed(
  () => currentYear.value - (currentYear.value % 12),
)
const yearRange = computed(() =>
  Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i),
)

const pickerList = computed(() =>
  viewMode.value == 'year' ? yearRange.value : months,
)

const toggleViewMode = () => {
  viewMode.value = viewMode.value == 'year' ? 'month' : 'year'
}

const handleOnClick = (v: string | number) => {
  let ar = model.value.split(' ')
  const indexToModify = viewMode.value == 'year' ? 1 : 0
  ar[indexToModify] = String(v)
  model.value = ar.join(' ')
}

const prevClick = () => {
  currentYear.value += viewMode.value == 'year' ? -12 : -1
}

const nextClick = () => {
  currentYear.value += viewMode.value == 'year' ? 12 : 1
}

const formatBtn = (v: string | number) =>
  viewMode.value == 'month' ? (v as String).slice(0, 3) : v

const txtClass = computed(() => {
  return model.value || props.disabled ? '': '!text-ink-gray-5' 
})
</script>

<template>
  <Popover
    popover-class="mt-2 shadow-xl rounded-lg border bg-surface-modal p-2"
  >
    <template #target="{ togglePopover, isOpen }">
      <Button @click="togglePopover" class="w-full justify-between border" :class="txtClass"
				:disabled="disabled" aria-haspopup="dialog" :aria-expanded="isOpen">
        {{ model || props.placeholder }}
        <template #suffix> <span class="lucide-calendar size-4" /> </template>
      </Button>
    </template>

    <template #body>
      <div class="flex gap-2 justify-between">
        <Button variant="ghost" @click="prevClick" label='previous'>
          <span class="lucide-chevron-left size-4 text-ink-gray-5" />
        </Button>

        <!-- view toggler -->
         <Button @click="toggleViewMode" label="Toggle view mode">
          <template v-if="viewMode == 'month'">
            {{ model.split(' ')[1] ?? currentYear }}
          </template>
          <template v-else>
            {{ yearRangeStart }} - {{ yearRangeStart + 11 }}
          </template>
        </Button>

        <Button variant="ghost" @click="nextClick" label='next'>
          <span class="lucide-chevron-right size-4 text-ink-gray-5" />
        </Button>
      </div>

      <hr class="my-2" />

      <!-- picker btns  -->
      <div class="grid grid-cols-3 gap-3">
        <Button
          v-for="x in pickerList"
          @click="() => handleOnClick(x)"
          :variant="model.includes(String(x)) ? 'solid' : 'ghost'"
          :key="x"
          class="text-sm text-ink-gray-9"
          :label="String(formatBtn(x))"
          role="gridcell"
        >
          {{ formatBtn(x) }}
        </Button>
      </div>
    </template>
  </Popover>
</template>
