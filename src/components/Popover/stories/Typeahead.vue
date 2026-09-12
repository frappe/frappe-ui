<script setup lang="ts">
import { computed, ref } from 'vue'
import { Popover, TextInput } from 'frappe-ui'

const fruits = [
  'Apricot',
  'Blackberry',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
]

const query = ref('')
const open = ref(false)

const matches = computed(() =>
  fruits.filter((f) => f.toLowerCase().includes(query.value.toLowerCase())),
)

function onInput(value: string) {
  query.value = value
  open.value = value.length > 0 && matches.value.length > 0
}

function pick(fruit: string) {
  query.value = fruit
  open.value = false
}
</script>

<template>
  <!--
    manual: clicking the input places the caret instead of toggling the panel.
    auto-focus false: the panel opens without taking focus off the input.
  -->
  <Popover
    v-model:open="open"
    trigger="manual"
    :auto-focus="false"
    match-trigger-width
  >
    <template #trigger>
      <TextInput
        :model-value="query"
        placeholder="Search fruit"
        class="w-56"
        @update:model-value="onInput"
      />
    </template>
    <template #default>
      <div class="p-1">
        <button
          v-for="fruit in matches"
          :key="fruit"
          type="button"
          class="block w-full rounded-4 px-2 py-1.5 text-left text-base text-ink-gray-8 hover:bg-surface-gray-2"
          @click="pick(fruit)"
        >
          {{ fruit }}
        </button>
      </div>
    </template>
  </Popover>
</template>
