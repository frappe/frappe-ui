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
    value: 'alex@example.com',
    email: 'alex@example.com',
    image: 'https://i.pravatar.cc/80?u=alex@example.com',
    role: 'Engineering',
  },
  {
    label: 'Priya Shah',
    value: 'priya@example.com',
    email: 'priya@example.com',
    image: 'https://i.pravatar.cc/80?u=priya@example.com',
    role: 'Design',
  },
  {
    label: 'Marcus Lee',
    value: 'marcus@example.com',
    email: 'marcus@example.com',
    image: 'https://i.pravatar.cc/80?u=marcus@example.com',
    role: 'Product',
  },
  {
    label: 'Sofia Hartmann',
    value: 'sofia@example.com',
    email: 'sofia@example.com',
    image: 'https://i.pravatar.cc/80?u=sofia@example.com',
    role: 'Engineering',
  },
  {
    label: 'Kenji Tanaka',
    value: 'kenji@example.com',
    email: 'kenji@example.com',
    image: 'https://i.pravatar.cc/80?u=kenji@example.com',
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
