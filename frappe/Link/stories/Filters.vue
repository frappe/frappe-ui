<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import { Link } from 'frappe-ui/frappe'
import { useMockSearchLink, MOCK_USERS } from './_mock'

useMockSearchLink({ User: MOCK_USERS })

const assignee = ref<string | null>(null)
const department = ref<string>('All')

const departments = [
  { label: 'All', value: 'All' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Design', value: 'Design' },
  { label: 'Product', value: 'Product' },
  { label: 'Sales', value: 'Sales' },
]

const filters = computed<Record<string, unknown>>(() => {
  const base: Record<string, unknown> = { enabled: 1 }
  if (department.value !== 'All') base.department = department.value
  return base
})

const filterSummary = computed(() =>
  department.value === 'All'
    ? 'Showing active users'
    : `Showing active users in ${department.value}`,
)

function handleCreate(query: string) {
  assignee.value = query
}
</script>

<template>
  <div class="w-full !py-20 grid place-items-center">
    <div class="grid w-96 gap-3">
      <div class="text-base text-ink-gray-5">Assign To</div>

      <TabButtons v-model="department" :buttons="departments" />

      <Link
        v-model="assignee"
        doctype="User"
        placeholder="Type to search or create…"
        :filters="filters"
        creatable
        @create="handleCreate"
      >
        <template #footer>
          <div
            class="-mx-1 -mb-1 mt-1 flex items-center gap-1.5 border-t border-outline-gray-1 px-2.5 py-2 text-p-xs text-ink-gray-5"
          >
            <span class="lucide-filter size-3 shrink-0" />
            <span class="truncate">{{ filterSummary }}</span>
          </div>
        </template>
      </Link>

      <div class="text-sm text-ink-gray-5">
        Selected: <code class="text-ink-gray-7">{{ assignee || 'None' }}</code>
      </div>
    </div>
  </div>
</template>
