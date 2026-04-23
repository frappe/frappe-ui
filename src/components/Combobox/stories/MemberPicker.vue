<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { Avatar, Combobox } from 'frappe-ui'
import LucideUserPlus from '~icons/lucide/user-plus'

type Member = {
  label: string
  value: string
  email: string
  role: string
  status: 'online' | 'away' | 'offline'
}

const value = ref<string>('')
const lastAction = ref<string>('')

const members: Member[] = [
  {
    label: 'Alex Rivera',
    value: 'alex@frappe.io',
    email: 'alex@frappe.io',
    role: 'Engineering',
    status: 'online',
  },
  {
    label: 'Priya Shah',
    value: 'priya@frappe.io',
    email: 'priya@frappe.io',
    role: 'Design',
    status: 'away',
  },
  {
    label: 'Marcus Lee',
    value: 'marcus@frappe.io',
    email: 'marcus@frappe.io',
    role: 'Product',
    status: 'online',
  },
  {
    label: 'Sofia Hartmann',
    value: 'sofia@frappe.io',
    email: 'sofia@frappe.io',
    role: 'Engineering',
    status: 'offline',
  },
  {
    label: 'Kenji Tanaka',
    value: 'kenji@frappe.io',
    email: 'kenji@frappe.io',
    role: 'Design',
    status: 'online',
  },
]

const options = [
  ...members,
  {
    type: 'custom' as const,
    key: 'invite',
    label: 'Invite new member',
    slots: {
      item: ({ query }: { query: string }) =>
        h(
          'div',
          { class: 'flex items-center gap-2 text-ink-blue-600' },
          [
            h(LucideUserPlus, { class: 'size-4' }),
            h(
              'span',
              {},
              query ? `Invite "${query}"` : 'Invite new member…',
            ),
          ],
        ),
    },
    onClick: ({ query }: { query: string }) => {
      lastAction.value = query ? `Sent invite to ${query}` : 'Invite clicked'
    },
  },
]

const statusRing = {
  online: 'ring-green-500',
  away: 'ring-yellow-500',
  offline: 'ring-gray-300',
} as const

const selected = computed(() =>
  members.find((m) => m.value === value.value) ?? null,
)
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="options"
      placeholder="Assign to…"
      open-on-focus
      class="w-80"
    >
      <template #prefix>
        <Avatar
          v-if="selected"
          :label="selected.label.charAt(0)"
          size="sm"
          :class="['ring-2 ring-offset-1 ring-offset-surface-gray-2', statusRing[selected.status]]"
        />
      </template>

      <template #item-prefix="{ item }">
        <Avatar
          :label="item.label.charAt(0)"
          size="sm"
          :class="['ring-2 ring-offset-1 ring-offset-surface-white', statusRing[(item as Member).status]]"
        />
      </template>

      <template #item-label="{ item }">
        <div class="min-w-0">
          <div class="truncate">{{ item.label }}</div>
          <div class="truncate text-p-sm text-ink-gray-5">
            {{ (item as Member).email }}
          </div>
        </div>
      </template>
    </Combobox>

    <div class="text-sm text-ink-gray-5">
      {{
        selected
          ? `Assigned to ${selected.label}`
          : lastAction || 'No one assigned'
      }}
    </div>
  </div>
</template>
