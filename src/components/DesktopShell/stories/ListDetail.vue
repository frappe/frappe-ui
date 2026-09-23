<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, DesktopShell, PageHeader, ScrollArea } from 'frappe-ui'

const tickets = Array.from({ length: 20 }, (_, i) => ({
  id: 1040 + i,
  subject: [
    'Cannot reset my password',
    'Invoice shows the wrong tax rate',
    'Export to CSV times out',
    'Add a second admin to our account',
    'Emails land in spam',
  ][i % 5],
  customer: ['Priya Nair', 'Sam Rivera', 'Ana Costa', 'Liam Fischer'][i % 4],
}))

const selectedId = ref(tickets[0].id)
const selected = computed(
  () => tickets.find((t) => t.id === selectedId.value) ?? tickets[0],
)
</script>

<template>
  <div
    class="h-[480px] w-full overflow-hidden rounded-5 border bg-surface-white"
  >
    <!-- scroll=false: each pane scrolls on its own. -->
    <DesktopShell :scroll="false">
      <PageHeader>
        <span class="text-lg font-semibold text-ink-gray-8">Tickets</span>
      </PageHeader>

      <div class="flex min-h-0 flex-1">
        <ScrollArea class="w-72 shrink-0 border-r">
          <div class="p-2">
            <button
              v-for="t in tickets"
              :key="t.id"
              type="button"
              class="flex w-full flex-col gap-1 rounded-4 px-3 py-2 text-left"
              :class="
                t.id === selectedId
                  ? 'bg-surface-gray-3'
                  : 'hover:bg-surface-gray-2'
              "
              @click="selectedId = t.id"
            >
              <span class="truncate text-base-medium text-ink-gray-8">
                {{ t.subject }}
              </span>
              <span class="text-sm text-ink-gray-5">
                #{{ t.id }} · {{ t.customer }}
              </span>
            </button>
          </div>
        </ScrollArea>

        <ScrollArea class="flex-1">
          <div class="space-y-4 p-5">
            <div class="flex items-center gap-2">
              <Avatar :label="selected.customer" size="md" />
              <span class="text-base-medium text-ink-gray-8">
                {{ selected.customer }}
              </span>
            </div>
            <div class="text-xl font-semibold text-ink-gray-9">
              {{ selected.subject }}
            </div>
            <p v-for="n in 8" :key="n" class="text-p-base text-ink-gray-7">
              Hi team, this started after the last update. I have tried the
              steps in the help article, but the problem is still there. Can you
              take a look?
            </p>
          </div>
        </ScrollArea>
      </div>
    </DesktopShell>
  </div>
</template>
