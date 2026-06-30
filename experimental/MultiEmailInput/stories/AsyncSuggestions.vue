<script setup lang="ts">
import { ref } from 'vue'
import { MultiEmailInput } from '..'
import type { MultiEmailOption } from '..'

const directory: MultiEmailOption[] = [
  {
    label: 'Ada Lovelace',
    value: 'ada@example.com',
    avatar: 'https://i.pravatar.cc/80?u=ada@example.com',
  },
  {
    label: 'Grace Hopper',
    value: 'grace@example.com',
    avatar: 'https://i.pravatar.cc/80?u=grace@example.com',
  },
  { label: 'Alan Turing', value: 'alan@example.com' },
]

const emails = ref<string[]>([])
const options = ref<MultiEmailOption[]>([])
const loading = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
function search(query: string) {
  clearTimeout(timer)
  loading.value = true
  timer = setTimeout(() => {
    const q = query.trim().toLowerCase()
    options.value = q
      ? directory.filter(
          (o) =>
            o.label.toLowerCase().includes(q) ||
            o.value.toLowerCase().includes(q),
        )
      : directory
    loading.value = false
  }, 300)
}
</script>

<template>
  <div class="max-w-md">
    <!-- Avatars render on the rows and the chips; typing a new address shows an
         "Add …" row. -->
    <MultiEmailInput
      v-model="emails"
      :options="options"
      :loading="loading"
      placeholder="Search people or type an email…"
      @update:query="search"
    />
  </div>
</template>
