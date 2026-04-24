<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Combobox } from 'frappe-ui'

type Member = {
  label: string
  value: string
  email: string
  image: string
  role: string
}

const value = ref<string>('')
const lastAction = ref<string>('')

// Using pravatar.cc for stable, realistic avatar photos keyed by email.
const members: Member[] = [
  {
    label: 'Alex Rivera',
    value: 'alex@frappe.io',
    email: 'alex@frappe.io',
    image: 'https://i.pravatar.cc/80?u=alex@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Priya Shah',
    value: 'priya@frappe.io',
    email: 'priya@frappe.io',
    image: 'https://i.pravatar.cc/80?u=priya@frappe.io',
    role: 'Design',
  },
  {
    label: 'Marcus Lee',
    value: 'marcus@frappe.io',
    email: 'marcus@frappe.io',
    image: 'https://i.pravatar.cc/80?u=marcus@frappe.io',
    role: 'Product',
  },
  {
    label: 'Sofia Hartmann',
    value: 'sofia@frappe.io',
    email: 'sofia@frappe.io',
    image: 'https://i.pravatar.cc/80?u=sofia@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Kenji Tanaka',
    value: 'kenji@frappe.io',
    email: 'kenji@frappe.io',
    image: 'https://i.pravatar.cc/80?u=kenji@frappe.io',
    role: 'Design',
  },
]

// Members appear as regular selectable options. The invite row is a custom
// action with `condition: () => true` so the picker always offers it,
// regardless of the current query.
const options = [
  ...members,
  {
    type: 'custom' as const,
    key: 'invite',
    label: 'Invite new member',
    slot: 'invite',
    condition: () => true,
    onClick: ({ query }: { query: string }) => {
      lastAction.value = query ? `Invited "${query}"` : 'Opened invite dialog'
    },
  },
]

const selected = computed(
  () => members.find((m) => m.value === value.value) ?? null,
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
        <Avatar v-if="selected" :image="selected.image" size="sm" />
      </template>

      <template #item-prefix="{ item }">
        <Avatar
          v-if="item.type !== 'custom'"
          :image="(item as Member).image"
          :label="item.label"
          size="sm"
        />
        <div
          v-else
          class="flex size-6 items-center justify-center rounded-full bg-surface-blue-2 text-ink-blue-600"
        >
          <span class="lucide-user-plus size-3.5" />
        </div>
      </template>

      <template #item-label="{ item }">
        <div v-if="item.type !== 'custom'" class="min-w-0">
          <div class="truncate">{{ item.label }}</div>
          <div class="truncate text-p-sm text-ink-gray-5">
            {{ (item as Member).email }}
          </div>
        </div>
      </template>

      <template #item-invite="{ query }">
        <span class="truncate text-ink-blue-600">
          {{ query ? `Invite "${query}"` : 'Invite new member' }}
        </span>
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
