<script setup lang="ts">
// Command palette — the canonical reason to reach for `bare: true`.
// The visual is a floating search panel with input + list + hint footer,
// not a card with padding and a header, so we strip the auto-chrome and
// lay out the body directly. `Dialog.Title` keeps the heading accessible
// without rendering one.
import { computed, ref, watch } from 'vue'
import { Button, Dialog, KeyboardShortcut, TextInput } from 'frappe-ui'

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)

type Command = {
  label: string
  hint: string
  icon: string
  combo?: string
}

const commands: Command[] = [
  {
    label: 'New project',
    hint: 'Create',
    icon: 'lucide-folder-plus',
    combo: 'Mod+N',
  },
  { label: 'New task', hint: 'Create', icon: 'lucide-plus', combo: 'Mod+T' },
  { label: 'Invite teammate', hint: 'People', icon: 'lucide-user-plus' },
  {
    label: 'Search documents',
    hint: 'Find',
    icon: 'lucide-file-search',
    combo: 'Mod+/',
  },
  {
    label: 'Open settings',
    hint: 'Workspace',
    icon: 'lucide-settings',
    combo: 'Mod+,',
  },
  { label: 'Switch theme', hint: 'Preferences', icon: 'lucide-moon-star' },
  { label: 'Log out', hint: 'Account', icon: 'lucide-log-out' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return commands
  return commands.filter((c) => c.label.toLowerCase().includes(q))
})

watch([query, open], () => {
  activeIndex.value = 0
})

function run(cmd: Command) {
  // eslint-disable-next-line no-console
  console.log('run:', cmd.label)
  open.value = false
}

function move(delta: number) {
  if (!filtered.value.length) return
  activeIndex.value =
    (activeIndex.value + delta + filtered.value.length) % filtered.value.length
}

function onEnter() {
  const cmd = filtered.value[activeIndex.value]
  if (cmd) run(cmd)
}
</script>

<template>
  <Button @click="open = true">
    <template #prefix>
      <span class="lucide-search size-4" />
    </template>
    Open command palette
  </Button>

  <Dialog v-model:open="open" size="lg" bare>
    <Dialog.Title as-child>
      <h2 class="sr-only">Command palette</h2>
    </Dialog.Title>

    <div class="flex flex-col">
      <ul class="max-h-80 overflow-y-auto p-2">
        <TextInput
          class="mb-2"
          v-model="query"
          size="md"
          placeholder="Type a command…"
          autofocus
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="onEnter"
          @keydown.esc="open = false"
        >
          <template #prefix>
            <span class="lucide-search size-4 text-ink-gray-5" />
          </template>
        </TextInput>

        <li
          v-if="!filtered.length"
          class="px-3 py-8 text-center text-p-sm text-ink-gray-5"
        >
          No commands match "{{ query }}"
        </li>
        <li
          v-for="(cmd, i) in filtered"
          :key="cmd.label"
          class="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-base"
          :class="
            i === activeIndex
              ? 'bg-surface-gray-2 text-ink-gray-9'
              : 'text-ink-gray-7 hover:bg-surface-gray-2'
          "
          @mouseenter="activeIndex = i"
          @click="run(cmd)"
        >
          <span
            :class="[cmd.icon, 'size-4 text-ink-gray-6']"
            aria-hidden="true"
          />
          <span class="flex-1 truncate">{{ cmd.label }}</span>
          <span class="text-p-xs text-ink-gray-5">{{ cmd.hint }}</span>
          <KeyboardShortcut v-if="cmd.combo" :combo="cmd.combo" bg />
        </li>
      </ul>

      <div
        class="flex items-center gap-4 border-t border-outline-elevation-2 px-4 py-2 text-p-xs text-ink-gray-5"
      >
        <span class="flex items-center gap-1.5">
          <KeyboardShortcut combo="ArrowUp" bg />
          <KeyboardShortcut combo="ArrowDown" bg />
          Navigate
        </span>
        <span class="flex items-center gap-1.5">
          <KeyboardShortcut combo="Enter" bg />
          Select
        </span>
        <span class="ml-auto flex items-center gap-1.5">
          <KeyboardShortcut combo="Escape" bg />
          Close
        </span>
      </div>
    </div>
  </Dialog>
</template>
