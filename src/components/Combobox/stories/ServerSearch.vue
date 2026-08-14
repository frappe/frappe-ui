<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Avatar, Combobox } from 'frappe-ui'

type Member = {
  label: string
  value: string
  image: string
  role: string
}

const ALL_MEMBERS: Member[] = [
  {
    label: 'Alex Rivera',
    value: 'alex@example.com',
    image: 'https://i.pravatar.cc/80?u=alex@example.com',
    role: 'Engineering',
  },
  {
    label: 'Alexandra Chen',
    value: 'alexandra@example.com',
    image: 'https://i.pravatar.cc/80?u=alexandra@example.com',
    role: 'Design',
  },
  {
    label: 'Priya Shah',
    value: 'priya@example.com',
    image: 'https://i.pravatar.cc/80?u=priya@example.com',
    role: 'Design',
  },
  {
    label: 'Priyanka Mehta',
    value: 'priyanka@example.com',
    image: 'https://i.pravatar.cc/80?u=priyanka@example.com',
    role: 'Product',
  },
  {
    label: 'Marcus Lee',
    value: 'marcus@example.com',
    image: 'https://i.pravatar.cc/80?u=marcus@example.com',
    role: 'Product',
  },
  {
    label: 'Maria Garcia',
    value: 'maria@example.com',
    image: 'https://i.pravatar.cc/80?u=maria@example.com',
    role: 'Marketing',
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
  {
    label: 'Diego Alvarez',
    value: 'diego@example.com',
    image: 'https://i.pravatar.cc/80?u=diego@example.com',
    role: 'Engineering',
  },
]

// Mocks a server endpoint: 400ms latency + substring match on label/value.
// A real backend would rank and fuzzy-match, which is why the picker below
// passes `:filterable="false"` — a second client-side substring pass would
// silently drop anything the server matched but the query doesn't contain.
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

const value = ref<string>('')
const query = ref('')
const results = ref<Member[]>([])
const loading = ref(false)
const knownById = ref(new Map<string, Member>())

let requestId = 0
async function fetchMembers(next: string) {
  const id = ++requestId
  loading.value = true
  const members = await searchMembersApi(next)
  // Drop stale responses so an earlier-but-slower request can't overwrite
  // the latest results.
  if (id !== requestId) return
  results.value = members
  for (const m of members) knownById.value.set(m.value, m)
  loading.value = false
}

const onQueryChange = useDebounceFn(fetchMembers, 250)

// Merge the selected member into the options so the trigger stays
// resolvable after the query narrows the result set.
const options = computed<Member[]>(() => {
  const byId = new Map<string, Member>()
  for (const m of results.value) byId.set(m.value, m)
  if (value.value && !byId.has(value.value)) {
    const existing = knownById.value.get(value.value)
    if (existing) byId.set(value.value, existing)
  }
  return Array.from(byId.values())
})

function onOpen(isOpen: boolean) {
  if (!isOpen) return
  // Binding `query` — or merely listening for `@update:query` — hands
  // ownership over, so the open-time reset the combobox does for an unbound
  // query is ours to do. Without it the committed label stays in the search
  // box and the next keystroke appends to it.
  query.value = ''
  if (results.value.length === 0) fetchMembers('')
}
</script>

<template>
  <!-- The `as` casts on the two handlers below exist because these model
       emits are declared twice; drop them when #1096 removes the duplicates. -->
  <Combobox
    v-model="value"
    v-model:query="query"
    :options="options"
    :loading="loading"
    :filterable="false"
    trigger="button"
    placeholder="Search members…"
    empty-text="No members found"
    class="w-80"
    @update:query="(q) => onQueryChange(q as string)"
    @update:open="(isOpen) => onOpen(isOpen as boolean)"
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
  </Combobox>
</template>
