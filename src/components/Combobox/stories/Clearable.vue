<script setup lang="ts">
import { reactive } from 'vue'
import { Combobox } from 'frappe-ui'

type FieldOption = string | { label: string; value: string }
type Field = { key: string; label: string; options: FieldOption[] }

const fields: Field[] = [
  {
    key: 'colour',
    label: 'colour',
    options: ['gray', 'blue', 'green', 'red'],
  },
  { key: 'size', label: 'size', options: ['sm', 'md', 'lg', 'xl'] },
  { key: 'style', label: 'style', options: ['subtle', 'outline', 'ghost'] },
  {
    key: 'fontSize',
    label: 'font size',
    options: [
      { label: '12px', value: '12' },
      { label: '14px', value: '14' },
      { label: '16px', value: '16' },
      { label: '20px', value: '20' },
      { label: '24px', value: '24' },
    ],
  },
]

const values = reactive<Record<string, string>>({
  colour: 'gray',
  size: 'sm',
  style: 'ghost',
  fontSize: '14',
})

const colourSwatch: Record<string, string> = {
  gray: 'bg-surface-gray-5',
  blue: 'bg-surface-blue-3',
  green: 'bg-surface-green-3',
  red: 'bg-surface-red-5',
}

const sizeDot: Record<string, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
  xl: 'size-3',
}

const fontSizePx: Record<string, number> = {
  '12': 8,
  '14': 10,
  '16': 12,
  '20': 14,
  '24': 16,
}

function getOptionValue(item: { value?: string; label: string }) {
  return item.value ?? item.label
}

function clear(key: string, event: Event) {
  event.stopPropagation()
  values[key] = ''
}
</script>

<template>
  <div class="grid w-[420px] gap-2">
    <div
      v-for="field in fields"
      :key="field.key"
      class="group grid grid-cols-[8rem_1fr] items-center gap-4"
    >
      <label class="text-base text-ink-gray-5">{{ field.label }}</label>

      <Combobox
        v-model="values[field.key]"
        :options="field.options"
        variant="outline"
        :placeholder="`Pick a ${field.label}`"
        open-on-focus
      >
        <template #item-prefix="{ item }">
          <span class="grid size-4 shrink-0 place-items-center">
            <span
              v-if="field.key === 'colour'"
              :class="[
                'inline-block size-3 rounded-sm',
                colourSwatch[getOptionValue(item)] ?? 'bg-surface-gray-3',
              ]"
            />

            <span
              v-else-if="field.key === 'size'"
              :class="[
                'inline-block rounded-full bg-surface-gray-4',
                sizeDot[getOptionValue(item)] ?? 'size-2',
              ]"
            />

            <template v-else-if="field.key === 'style'">
              <span
                v-if="getOptionValue(item) === 'outline'"
                class="lucide-square-dashed size-4 text-ink-gray-6"
              />
              <span
                v-else-if="getOptionValue(item) === 'ghost'"
                class="lucide-circle-dashed size-4 text-ink-gray-6"
              />
              <span v-else class="lucide-square size-4 text-ink-gray-6" />
            </template>

            <span
              v-else-if="field.key === 'fontSize'"
              class="font-semibold leading-none text-ink-gray-7"
              :style="{
                fontSize: `${fontSizePx[getOptionValue(item)] ?? 12}px`,
              }"
            >
              A
            </span>
          </span>
        </template>

        <template #suffix="{ open }">
          <button
            v-if="values[field.key]"
            type="button"
            aria-label="Clear"
            tabindex="-1"
            class="grid size-4 place-items-center rounded-sm text-ink-gray-5 opacity-0 hover:bg-surface-gray-3 hover:text-ink-gray-7 group-hover:opacity-100 focus:opacity-100"
            @click="clear(field.key, $event)"
            @pointerdown.stop
          >
            <span class="lucide-x size-4" />
          </button>
          <span
            v-else
            :class="[
              'lucide-chevron-down size-4 text-ink-gray-5 transition-transform duration-200',
              open && 'rotate-180',
            ]"
          />
        </template>
      </Combobox>
    </div>
  </div>
</template>
