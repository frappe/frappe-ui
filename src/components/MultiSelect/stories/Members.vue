<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, MultiSelect } from 'frappe-ui'

type Member = {
  label: string
  value: string
  image: string
  role: string
}

const members: Member[] = [
  {
    label: 'Alex Rivera',
    value: 'alex@example.com',
    image: 'https://i.pravatar.cc/80?u=alex@example.com',
    role: 'Engineering',
  },
  {
    label: 'Priya Shah',
    value: 'priya@example.com',
    image: 'https://i.pravatar.cc/80?u=priya@example.com',
    role: 'Design',
  },
  {
    label: 'Marcus Lee',
    value: 'marcus@example.com',
    image: 'https://i.pravatar.cc/80?u=marcus@example.com',
    role: 'Product',
  },
  {
    label: 'Sofia Hartmann',
    value: 'sofia@example.com',
    image: 'https://i.pravatar.cc/80?u=sofia@example.com',
    role: 'Engineering',
  },
  {
    label: 'Kenji Tanaka',
    value: 'kenji@example.com',
    image: 'https://i.pravatar.cc/80?u=kenji@example.com',
    role: 'Design',
  },
  {
    label: 'Nadia Okafor',
    value: 'nadia@example.com',
    image: 'https://i.pravatar.cc/80?u=nadia@example.com',
    role: 'Product',
  },
]

const value = ref<string[]>(['alex@example.com', 'priya@example.com'])

const MAX_AVATARS = 3

const visibleSelected = computed(() =>
  (
    value.value
      .map((v) => members.find((m) => m.value === v))
      .filter(Boolean) as Member[]
  ).slice(0, MAX_AVATARS),
)

const overflowCount = computed(() =>
  Math.max(0, value.value.length - MAX_AVATARS),
)
</script>

<template>
  <MultiSelect
    v-model="value"
    :options="members"
    placeholder="Assign reviewers…"
    class="w-80"
  >
    <template #prefix>
      <div v-if="visibleSelected.length" class="flex -space-x-1.5">
        <Avatar
          v-for="m in visibleSelected"
          :key="m.value"
          :image="m.image"
          :label="m.label"
          size="sm"
        />
        <span
          v-if="overflowCount > 0"
          class="z-10 grid size-5 place-items-center rounded-full bg-surface-gray-3 text-p-xs-medium text-ink-gray-7"
        >
          +{{ overflowCount }}
        </span>
      </div>
      <span v-else class="lucide-users size-4 text-ink-gray-5" />
    </template>

    <template #summary="{ selectedOptions, summary }">
      <template v-if="selectedOptions.length">
        {{ selectedOptions.map((o) => o.label).join(', ') }}
      </template>
      <template v-else>{{ summary }}</template>
    </template>

    <template #item-prefix="{ item }">
      <Avatar :image="(item as Member).image" :label="item.label" size="sm" />
    </template>

    <template #item-label="{ item }">
      <div class="min-w-0 flex justify-between">
        <div class="truncate">{{ item.label }}</div>
        <div class="truncate text-p-sm text-ink-gray-5">
          {{ (item as Member).role }}
        </div>
      </div>
    </template>
  </MultiSelect>
</template>
