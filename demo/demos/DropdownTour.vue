<script setup>
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'

// One dropdown that uses every part of the API: grouped sections, icons,
// shortcut suffixes, selected state, submenus (two levels),
// switch rows, a disabled row and a destructive row.

// Recording aid: `?pos=bottom-right` pins the trigger against the viewport
// corner, where the menu flips up and right-aligns to stay in view.
const pos =
  new URLSearchParams(location.search).get('pos') === 'bottom-right'
    ? 'bottom-right'
    : 'center'

const status = ref('Backlog')
const comments = ref(true)
const lineNumbers = ref(false)
const compact = ref(false)
function run(label) {
  console.log(label)
}

const statuses = ['Backlog', 'In progress', 'In review', 'Done']

const options = computed(() => [
  {
    group: 'Edit',
    options: [
      {
        label: 'Rename',
        icon: 'lucide-pen',
        shortcut: ['F2'],
        onClick: () => run('Rename'),
      },
      {
        label: 'Duplicate',
        icon: 'lucide-copy',
        shortcut: ['⌘', 'D'],
        onClick: () => run('Duplicate'),
      },
    ],
  },
  {
    group: 'Organize',
    options: [
      {
        label: 'Move to',
        icon: 'lucide-folder-input',
        submenu: statuses.map((name) => ({
          label: name,
          selected: status.value === name,
          onClick: () => {
            status.value = name
            run(`Moved to ${name}`)
          },
        })),
      },
      {
        label: 'Share',
        icon: 'lucide-share-2',
        submenu: [
          {
            label: 'Copy link',
            icon: 'lucide-link',
            shortcut: ['⌘', '⇧', 'C'],
            onClick: () => run('Copy link'),
          },
          {
            label: 'Invite people',
            icon: 'lucide-user-plus',
            submenu: [
              {
                label: 'By email',
                icon: 'lucide-mail',
                onClick: () => run('Invite by email'),
              },
              {
                label: 'Send to Slack',
                icon: 'lucide-message-circle',
                onClick: () => run('Send to Slack'),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    group: 'View',
    options: [
      {
        label: 'Comments',
        icon: 'lucide-message-square',
        switch: true,
        switchValue: comments.value,
        onClick: (value) => (comments.value = value),
      },
      {
        label: 'Line numbers',
        icon: 'lucide-list-ordered',
        switch: true,
        switchValue: lineNumbers.value,
        onClick: (value) => (lineNumbers.value = value),
      },
      {
        label: 'Compact rows',
        icon: 'lucide-rows-3',
        switch: true,
        switchValue: compact.value,
        onClick: (value) => (compact.value = value),
      },
    ],
  },
  {
    group: 'Danger',
    options: [
      {
        label: 'Archive',
        icon: 'lucide-archive',
        disabled: true,
        onClick: () => run('Archive'),
      },
      {
        label: 'Delete',
        icon: 'lucide-trash-2',
        theme: 'red',
        shortcut: ['⌫'],
        onClick: () => run('Delete'),
      },
    ],
  },
])
</script>

<template>
  <div class="min-h-screen bg-surface-base p-6 text-ink-gray-9">
    <div
      :class="
        pos === 'center'
          ? 'mx-auto mt-16 flex h-40 max-w-md items-center justify-center rounded-lg bg-surface-white p-4'
          : 'fixed bottom-8 right-8'
      "
    >
      <Dropdown
        :options="options"
        :button="{ label: 'Actions' }"
        :align="pos === 'center' ? 'start' : 'end'"
      >
        <template #item-suffix="{ item, selected }">
          <span
            v-if="selected"
            class="lucide-check size-4 text-ink-gray-7"
            aria-hidden="true"
          />
          <div v-else-if="item.shortcut" class="flex items-center gap-px">
            <kbd
              v-for="(key, i) in item.shortcut"
              :key="i"
              class="font-sans text-xs leading-4 text-ink-gray-5"
            >
              {{ key }}
            </kbd>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
