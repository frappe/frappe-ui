<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import { List, ListRow, ListCell } from 'frappe-ui/list'

const documents = [
  {
    id: '1',
    title: 'Q3 launch brief',
    icon: 'lucide-file-text',
    updated: '2 h',
  },
  {
    id: '2',
    title: 'Hiring pipeline',
    icon: 'lucide-file-spreadsheet',
    updated: '5 h',
  },
  {
    id: '3',
    title: 'Onboarding flow',
    icon: 'lucide-file-image',
    updated: '1 d',
  },
  {
    id: '4',
    title: 'Retention report',
    icon: 'lucide-file-chart-column',
    updated: '3 d',
  },
  {
    id: '5',
    title: 'Support playbook',
    icon: 'lucide-file-text',
    updated: '6 d',
  },
]

const opened = ref<string>()
const starred = ref<string[]>(['2'])

function toggleStar(id: string) {
  starred.value = starred.value.includes(id)
    ? starred.value.filter((s) => s !== id)
    : [...starred.value, id]
}
</script>

<template>
  <div class="w-full">
    <div class="mb-2 flex h-7 items-center justify-end text-sm text-ink-gray-5">
      <span>
        {{ starred.length }} starred
        {{ opened ? ` · Opened: ${opened}` : ' · Click a row to open it' }}
      </span>
    </div>
    <!-- A row is one interactive element, so these rows stay static: the
         content cell stretches an "open" button over the row (rows are
         `position: relative`) and the star button layers above it with
         `relative` — the overlay's sibling, so no stopPropagation. The
         hover/active classes and list-row-px-3 restore the interactive look
         and inset a static row doesn't get for free. -->
    <List class="list-row-px-3" :row-height="48">
      <ListRow
        v-for="doc in documents"
        :key="doc.id"
        class="active:bg-surface-gray-2 sm:rounded-[10px] sm:hover:bg-surface-gray-1"
      >
        <ListCell>
          <span
            :class="doc.icon"
            class="size-4 text-ink-gray-5"
            aria-hidden="true"
          />
        </ListCell>
        <ListCell>
          <button
            class="absolute inset-0"
            :aria-label="`Open ${doc.title}`"
            @click="opened = doc.title"
          />
          <span class="truncate text-base text-ink-gray-8">
            {{ doc.title }}
          </span>
        </ListCell>
        <ListCell class="justify-end gap-3">
          <span class="text-sm text-ink-gray-5">{{ doc.updated }}</span>
          <Button
            class="relative"
            variant="ghost"
            :label="
              starred.includes(doc.id)
                ? `Unstar ${doc.title}`
                : `Star ${doc.title}`
            "
            :aria-pressed="starred.includes(doc.id)"
            @click="toggleStar(doc.id)"
          >
            <!-- Colour lives on an #icon-slot span: Button's ghost classes
                 already set an ink colour on the button element, and without
                 tailwind-merge the stylesheet order — not this template —
                 would decide which class wins there. -->
            <template #icon>
              <span
                class="lucide-star size-4"
                :class="
                  starred.includes(doc.id)
                    ? 'text-ink-gray-9'
                    : 'text-ink-gray-4'
                "
                aria-hidden="true"
              />
            </template>
          </Button>
        </ListCell>
      </ListRow>
    </List>
  </div>
</template>
