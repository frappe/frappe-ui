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
  { label: 'Alex Rivera', value: 'alex@example.com', image: 'https://i.pravatar.cc/80?u=alex@example.com', role: 'Engineering' },
  { label: 'Alexandra Chen', value: 'alexandra@example.com', image: 'https://i.pravatar.cc/80?u=alexandra@example.com', role: 'Design' },
  { label: 'Alexei Volkov', value: 'alexei@example.com', image: 'https://i.pravatar.cc/80?u=alexei@example.com', role: 'Engineering' },
  { label: 'Priya Shah', value: 'priya@example.com', image: 'https://i.pravatar.cc/80?u=priya@example.com', role: 'Design' },
  { label: 'Priyanka Mehta', value: 'priyanka@example.com', image: 'https://i.pravatar.cc/80?u=priyanka@example.com', role: 'Product' },
  { label: 'Marcus Lee', value: 'marcus@example.com', image: 'https://i.pravatar.cc/80?u=marcus@example.com', role: 'Product' },
  { label: 'Marco Silva', value: 'marco@example.com', image: 'https://i.pravatar.cc/80?u=marco@example.com', role: 'Engineering' },
  { label: 'Maria Garcia', value: 'maria@example.com', image: 'https://i.pravatar.cc/80?u=maria@example.com', role: 'Marketing' },
  { label: 'Sofia Hartmann', value: 'sofia@example.com', image: 'https://i.pravatar.cc/80?u=sofia@example.com', role: 'Engineering' },
  { label: 'Sophie Laurent', value: 'sophie@example.com', image: 'https://i.pravatar.cc/80?u=sophie@example.com', role: 'Sales' },
  { label: 'Kenji Tanaka', value: 'kenji@example.com', image: 'https://i.pravatar.cc/80?u=kenji@example.com', role: 'Design' },
  { label: 'Kenta Mori', value: 'kenta@example.com', image: 'https://i.pravatar.cc/80?u=kenta@example.com', role: 'Engineering' },
  { label: 'Nadia Okafor', value: 'nadia@example.com', image: 'https://i.pravatar.cc/80?u=nadia@example.com', role: 'Product' },
  { label: 'Diego Alvarez', value: 'diego@example.com', image: 'https://i.pravatar.cc/80?u=diego@example.com', role: 'Engineering' },
  { label: 'Lina Petrova', value: 'lina@example.com', image: 'https://i.pravatar.cc/80?u=lina@example.com', role: 'Marketing' },
  { label: 'Liam Connor', value: 'liam@example.com', image: 'https://i.pravatar.cc/80?u=liam@example.com', role: 'Product' },
  { label: 'Hassan Iqbal', value: 'hassan@example.com', image: 'https://i.pravatar.cc/80?u=hassan@example.com', role: 'Sales' },
  { label: 'Ava Nguyen', value: 'ava@example.com', image: 'https://i.pravatar.cc/80?u=ava@example.com', role: 'Engineering' },
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
</template>
