<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormControl, Select } from '../../../src'
import { List, ListCell, ListRow } from '../../../src/molecules/list'

// One record keyed by row, rather than a ref per row: binding `v-model` to a
// ref held inside a plain array makes the list re-render on every update.
const values = reactive<Record<string, string>>({
  'font-size': 'Default',
  theme: 'Light',
  'time-format': '24 hours',
  'date-format': 'DD/MM/YYYY',
})
const trashDays = ref('30')

// The four rows that carry a select. The design's "Empty trash" row repeats
// "How to display date" as its description — kept as drawn.
const rows = [
  {
    key: 'font-size',
    title: 'Font size',
    description: 'Adjust your font size',
    options: ['Small', 'Default', 'Large'],
    placeholder: 'Select size',
  },
  {
    key: 'theme',
    title: 'Theme',
    description: 'Which view is open when you open up Gameplan',
    options: ['Light', 'Dark', 'System'],
    placeholder: 'Select theme',
  },
  {
    key: 'time-format',
    title: 'Time format',
    description: 'How to display time',
    options: ['12 hours', '24 hours'],
    placeholder: 'Select format',
  },
  {
    key: 'date-format',
    title: 'Date format',
    description: 'How to display date',
    options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
    placeholder: 'Select format',
  },
]
</script>

<template>
  <div class="w-[700px] max-w-full">
    <!--
      Rows are 67px: 14px of padding above and below a 39px title/description
      block, with a hairline between them and none under the last.
    -->
    <List class="list-gap-6 list-row-px-0" :columns="['minmax(0,1fr)', 'auto']">
      <ListRow v-for="row in rows" :key="row.key" class="py-3">
        <ListCell>
          <div class="min-w-0">
            <div class="text-base-medium text-ink-gray-8">{{ row.title }}</div>
            <!-- 2px under the title here, where the notification rows use 4. -->
            <p class="mt-[2px] text-p-base text-ink-gray-6">
              {{ row.description }}
            </p>
          </div>
        </ListCell>
        <ListCell class="justify-end">
          <Select
            v-model="values[row.key]"
            size="sm"
            :options="row.options"
            :placeholder="row.placeholder"
            :aria-label="row.title"
          />
        </ListCell>
      </ListRow>

      <!--
        The last row's control is a sentence: only the number is a field, the
        words either side are plain text, as the design draws them.
      -->
      <ListRow class="py-3">
        <ListCell>
          <div class="min-w-0">
            <div class="text-base-medium text-ink-gray-8">Empty trash</div>
            <p class="mt-[2px] text-p-base text-ink-gray-6">
              How to display date
            </p>
          </div>
        </ListCell>
        <ListCell class="justify-end">
          <div class="flex items-center gap-2">
            <span class="text-base text-ink-gray-7"
              >Remove files older than</span
            >
            <FormControl
              v-model="trashDays"
              class="w-12 [&_input]:text-center"
              size="sm"
              placeholder="30"
              aria-label="Days before files are removed"
            />
            <span class="text-base text-ink-gray-7">Days</span>
          </div>
        </ListCell>
      </ListRow>
    </List>
  </div>
</template>
