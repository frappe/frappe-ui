<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Avatar, MultiSelect } from 'frappe-ui'

type Member = {
  label: string
  value: string
  image: string
  role: string
}

const ALL_MEMBERS: Member[] = [
  {
    label: 'Alex Rivera',
    value: 'alex@frappe.io',
    image: 'https://i.pravatar.cc/80?u=alex@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Alexandra Chen',
    value: 'alexandra@frappe.io',
    image: 'https://i.pravatar.cc/80?u=alexandra@frappe.io',
    role: 'Design',
  },
  {
    label: 'Alexei Volkov',
    value: 'alexei@frappe.io',
    image: 'https://i.pravatar.cc/80?u=alexei@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Priya Shah',
    value: 'priya@frappe.io',
    image: 'https://i.pravatar.cc/80?u=priya@frappe.io',
    role: 'Design',
  },
  {
    label: 'Priyanka Mehta',
    value: 'priyanka@frappe.io',
    image: 'https://i.pravatar.cc/80?u=priyanka@frappe.io',
    role: 'Product',
  },
  {
    label: 'Marcus Lee',
    value: 'marcus@frappe.io',
    image: 'https://i.pravatar.cc/80?u=marcus@frappe.io',
    role: 'Product',
  },
  {
    label: 'Marco Silva',
    value: 'marco@frappe.io',
    image: 'https://i.pravatar.cc/80?u=marco@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Maria Garcia',
    value: 'maria@frappe.io',
    image: 'https://i.pravatar.cc/80?u=maria@frappe.io',
    role: 'Marketing',
  },
  {
    label: 'Sofia Hartmann',
    value: 'sofia@frappe.io',
    image: 'https://i.pravatar.cc/80?u=sofia@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Sophie Laurent',
    value: 'sophie@frappe.io',
    image: 'https://i.pravatar.cc/80?u=sophie@frappe.io',
    role: 'Sales',
  },
  {
    label: 'Kenji Tanaka',
    value: 'kenji@frappe.io',
    image: 'https://i.pravatar.cc/80?u=kenji@frappe.io',
    role: 'Design',
  },
  {
    label: 'Kenta Mori',
    value: 'kenta@frappe.io',
    image: 'https://i.pravatar.cc/80?u=kenta@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Nadia Okafor',
    value: 'nadia@frappe.io',
    image: 'https://i.pravatar.cc/80?u=nadia@frappe.io',
    role: 'Product',
  },
  {
    label: 'Diego Alvarez',
    value: 'diego@frappe.io',
    image: 'https://i.pravatar.cc/80?u=diego@frappe.io',
    role: 'Engineering',
  },
  {
    label: 'Lina Petrova',
    value: 'lina@frappe.io',
    image: 'https://i.pravatar.cc/80?u=lina@frappe.io',
    role: 'Marketing',
  },
  {
    label: 'Liam Connor',
    value: 'liam@frappe.io',
    image: 'https://i.pravatar.cc/80?u=liam@frappe.io',
    role: 'Product',
  },
  {
    label: 'Hassan Iqbal',
    value: 'hassan@frappe.io',
    image: 'https://i.pravatar.cc/80?u=hassan@frappe.io',
    role: 'Sales',
  },
  {
    label: 'Ava Nguyen',
    value: 'ava@frappe.io',
    image: 'https://i.pravatar.cc/80?u=ava@frappe.io',
    role: 'Engineering',
  },
]

// Mocks a server endpoint: 400ms latency + substring match on label/value.
function searchMembersApi(query: string): Promise<Member[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase()
      const matches = q
        ? ALL_MEMBERS.filter(
            (m) =>
              m.label.toLowerCase().includes(q) ||
              m.value.toLowerCase().includes(q),
          )
        : ALL_MEMBERS
      resolve(matches.slice(0, 6))
    }, 400)
  })
}

const value = ref<string[]>([])
const results = ref<Member[]>([])
const loading = ref(false)
const knownById = ref(new Map<string, Member>())

let requestId = 0
async function fetchMembers(query: string) {
  const id = ++requestId
  loading.value = true
  const members = await searchMembersApi(query)
  // Drop stale responses so an earlier-but-slower request can't overwrite
  // the latest results.
  if (id !== requestId) return
  results.value = members
  for (const m of members) knownById.value.set(m.value, m)
  loading.value = false
}

const onQueryChange = useDebounceFn(fetchMembers, 250)

// Merge currently-selected members into the options so chips stay
// resolvable after the query narrows the result set.
const options = computed<Member[]>(() => {
  const byId = new Map<string, Member>()
  for (const m of results.value) byId.set(m.value, m)
  for (const id of value.value) {
    if (!byId.has(id)) {
      const existing = knownById.value.get(id)
      if (existing) byId.set(id, existing)
    }
  }
  return Array.from(byId.values())
})

function onOpen(isOpen: boolean) {
  if (isOpen && results.value.length === 0) fetchMembers('')
}
</script>

<template>
  <div class="w-full flex flex-wrap gap-3 items-center justify-center !py-20">
    <MultiSelect
      v-model="value"
      :options="options"
      :loading="loading"
      placeholder="Search members…"
      empty-text="No members found"
      class="w-80"
      @update:query="onQueryChange"
      @update:open="onOpen"
    >
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
  </div>
</template>
