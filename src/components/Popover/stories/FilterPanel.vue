<script setup lang="ts">
import { ref } from 'vue'
import { Button, Checkbox, Popover } from 'frappe-ui'

const statuses = ['Open', 'Replied', 'Resolved', 'Closed']
const selected = ref<string[]>(['Open'])
const draft = ref<Record<string, boolean>>({})

function load() {
  draft.value = Object.fromEntries(
    statuses.map((s) => [s, selected.value.includes(s)]),
  )
}

function apply(close: () => void) {
  selected.value = statuses.filter((s) => draft.value[s])
  close()
}
</script>

<template>
  <Popover side="bottom" align="start" @open="load">
    <template #trigger>
      <Button
        icon-left="lucide-list-filter"
        :label="selected.length ? `Status: ${selected.length}` : 'Filter'"
      />
    </template>
    <template #default="{ close }">
      <div class="w-56 p-3">
        <p class="text-sm-medium text-ink-gray-5">Status</p>
        <div class="mt-2 flex flex-col gap-2">
          <Checkbox
            v-for="status in statuses"
            :key="status"
            v-model="draft[status]"
            :label="status"
          />
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <Button label="Cancel" @click="close()" />
          <Button variant="solid" label="Apply" @click="apply(close)" />
        </div>
      </div>
    </template>
  </Popover>
</template>
