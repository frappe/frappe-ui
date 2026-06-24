<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { FloatingWindow, Checkbox, TextInput, Button } from 'frappe-ui'

// Geometry persists via `storage-key`; the task list persists via its own
// `useStorage` key. Add or tick off tasks, move or resize the window, reload
// the page, and both the layout and your list come back.
const tasks = useStorage('frappe-ui:docs:tasks', [
  { id: 1, label: 'Reply to ticket #1423', done: true },
  { id: 2, label: "Review this week's SLA report", done: false },
  { id: 3, label: 'Close stale tickets', done: false },
])

const draft = ref('')

function addTask() {
  const label = draft.value.trim()
  if (!label) return
  const id = Math.max(0, ...tasks.value.map((task) => task.id)) + 1
  tasks.value.push({ id, label, done: false })
  draft.value = ''
}

function removeTask(id: number) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}
</script>

<template>
  <div class="w-[440px]">
    <FloatingWindow title="My tasks" storage-key="frappe-ui:docs:tasks-window">
      <div class="flex flex-col gap-0.5 px-2 py-2">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="group flex items-center justify-between gap-2 rounded px-1.5 py-1 hover:bg-surface-gray-2"
        >
          <Checkbox v-model="task.done">
            <template #label>
              <span
                class="text-p-sm"
                :class="
                  task.done
                    ? 'text-ink-gray-4 line-through'
                    : 'text-ink-gray-8'
                "
              >
                {{ task.label }}
              </span>
            </template>
          </Checkbox>
          <button
            type="button"
            aria-label="Remove task"
            class="flex shrink-0 rounded p-0.5 text-ink-gray-5 opacity-0 transition hover:bg-surface-gray-3 group-hover:opacity-100"
            @click="removeTask(task.id)"
          >
            <LucideX class="h-3.5 w-3.5" />
          </button>
        </div>

        <p
          v-if="!tasks.length"
          class="px-1.5 py-8 text-center text-p-sm text-ink-gray-4"
        >
          All clear. Add a task below.
        </p>
      </div>

      <template #footer>
        <div
          class="flex items-center gap-2 border-t border-outline-gray-1 px-3 py-2"
        >
          <TextInput
            v-model="draft"
            class="flex-1"
            placeholder="Add a task…"
            @keydown.enter="addTask"
          />
          <Button
            variant="solid"
            label="Add"
            :disabled="!draft.trim()"
            @click="addTask"
          />
        </div>
      </template>
    </FloatingWindow>
  </div>
</template>
