<script setup lang="ts">
import { ref } from 'vue'
import { Link } from 'frappe-ui/frappe'
import { useMockSearchLink, MOCK_LOST_REASONS } from './_mock'

// Local copy of the seed list so created rows don't leak into the sibling
// Labeling story on the same docs page. Both variations share this list —
// pushing through either Link makes the new option visible in the other.
const reasons = [...MOCK_LOST_REASONS]
useMockSearchLink({ 'CRM Lost Reason': reasons })

const reasonA = ref<string | null>(null)
const openA = ref(false)
const lastCreateA = ref<string | null>(null)

function handleCreateA(query: string) {
  // Real apps open a create dialog and persist the record; on success they
  // assign the new primary key back to v-model. Here we mimic that flow:
  // append to the mock dataset, select it, and close the popover.
  if (!reasons.some((r) => r.value === query)) reasons.push({ value: query })
  reasonA.value = query
  openA.value = false
  lastCreateA.value = query
}

const reasonB = ref<string | null>(null)
const openB = ref(false)

function handleCreateB(query: string) {
  if (!reasons.some((r) => r.value === query)) reasons.push({ value: query })
  reasonB.value = query
  openB.value = false
}
</script>

<template>
  <div class="w-full !py-20 grid place-items-center">
    <div class="grid w-96 gap-8">
      <div class="grid gap-3">
        <Link
          v-model="reasonA"
          v-model:open="openA"
          doctype="CRM Lost Reason"
          label="Lost reason"
          placeholder="Select or create a reason"
          creatable
          @create="handleCreateA"
        />

        <div class="text-sm text-ink-gray-5">
          Selected: <code class="text-ink-gray-7">{{ reasonA || 'None' }}</code>
        </div>
        <div v-if="lastCreateA" class="text-sm text-ink-gray-5">
          Last <code>@create</code> query:
          <code class="text-ink-gray-7">{{ lastCreateA }}</code>
        </div>
      </div>

      <div class="grid gap-3">
        <div class="text-base text-ink-gray-5">Customised create row</div>
        <Link
          v-model="reasonB"
          v-model:open="openB"
          doctype="CRM Lost Reason"
          label="Lost reason"
          placeholder="Type a new reason…"
          creatable
          @create="handleCreateB"
        >
          <template #item-create="{ query }">
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="lucide-plus size-3.5 text-ink-gray-5 shrink-0"
              />
              <span class="truncate">
                Add new reason
                <span
                  v-if="query"
                  class="font-medium text-ink-gray-8 italic"
                >
                  “{{ query }}”
                </span>
              </span>
            </div>
          </template>
        </Link>

        <p class="text-p-xs text-ink-gray-5">
          Use <code>#item-create</code> to override the default create row —
          add an icon, helper text, or any markup. Slot scope is
          <code>{ query }</code>.
        </p>
      </div>
    </div>
  </div>
</template>
