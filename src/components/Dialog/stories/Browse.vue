<script setup lang="ts">
// Adapted from gameplan/RevisionsDialog.vue — a read-only browse dialog
// with a master/detail layout, dynamic title, large size, and no
// footer actions.
import { computed, ref } from 'vue'
import { Button, Dialog } from 'frappe-ui'

const open = ref(false)

const revisions = [
  {
    id: 'r-4',
    when: 'Today, 10:42',
    author: 'Faris',
    diff: '<p>+ Wire up <strong>release notes</strong></p>',
  },
  {
    id: 'r-3',
    when: 'Yesterday, 17:12',
    author: 'Ankush',
    diff: '<p>~ Tighten <em>copy</em> on hero</p>',
  },
  {
    id: 'r-2',
    when: 'Mon, 09:30',
    author: 'Shariq',
    diff: '<p>+ Add Dialog spec link</p>',
  },
  {
    id: 'r-1',
    when: 'Last week',
    author: 'Faris',
    diff: '<p>Initial draft</p>',
  },
]
const activeIndex = ref(0)
const active = computed(() => revisions[activeIndex.value])

const title = computed(() => `${revisions.length} revisions`)
</script>

<template>
  <Button @click="open = true">View revisions</Button>

  <Dialog v-model:open="open" :title="title" size="5xl">
    <div class="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <div class="max-h-[60vh] space-y-1 overflow-y-auto pr-1" role="listbox">
        <button
          v-for="(rev, i) in revisions"
          :key="rev.id"
          role="option"
          :aria-selected="i === activeIndex"
          class="flex w-full flex-col items-start rounded px-2 py-1.5 text-left"
          :class="
            i === activeIndex
              ? 'bg-surface-gray-3 text-ink-gray-9'
              : 'text-ink-gray-7 hover:bg-surface-gray-2'
          "
          @click="activeIndex = i"
        >
          <span class="text-p-sm font-medium">{{ rev.when }}</span>
          <span class="text-p-xs text-ink-gray-5">{{ rev.author }}</span>
        </button>
      </div>

      <div
        class="prose prose-sm max-h-[60vh] overflow-y-auto rounded border border-outline-gray-modals bg-surface-gray-1 p-4 w-full max-w-none"
        v-html="active.diff"
      />
    </div>
  </Dialog>
</template>
