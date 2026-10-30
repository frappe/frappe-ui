<!--
  STASHED — not on the page.

  Articles is a list, not a table, so it came off /tables until that's settled.
  Everything it needs is still here; re-register it in TablePatterns.vue (or
  wherever it belongs) to bring it back. What was built:

  - One full-width ListView column, laid out as a flex line rather than on the
    column grid. That is what makes the hover work: the three metadata blocks
    drop out of the line (`group-hover` expressed as "inside a hovered row",
    since ListView owns the row element) and the description grows into the
    space they leave. A grid can't reflow like that — ListView clips each cell.
  - 68px rows, 8px top and bottom, per the design's own row (node 35034:53957).
  - No label row: the design hides it.
  - 40px thumbnail, 12px to the text, 2px between title and description.
  - Metadata cells at the design's 160/160/112, with 8px on the last one so the
    time finishes 16px inside the row.
  - Author avatars from the Espresso file via `faceFor`.
-->
<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Button } from '../../../../src'
import { ListView } from '../../../../experimental/ListView'
import { faceFor } from '../designAssets'
import { espressoListView } from '../listViewClasses'

type Article = {
  id: number
  title: string
  author: string
  category: string
  icon: string
  when: string
  /** Theme variable the stand-in thumbnail is filled with. */
  thumb: string
}

const description =
  'Use ‘Quick Links’ to access your customer or company information in other tools, directly from the Help Desk.'

// One full-width column. Every other table on this page lays its cells out on
// ListView's own grid, but this row rearranges itself on hover — the three
// metadata columns give way to three actions and the description takes the
// width they leave behind. A grid can't reflow like that (ListView clips each
// cell), so the row is a flex line instead: dropping the metadata out of the
// line is what lets the description grow.
const columns = [{ label: 'Article', key: 'title', width: '1fr' }]

const articles: Article[] = [
  { id: 1, title: 'Building your first platform', author: 'Layla Green', category: 'Tickets', icon: 'lucide-ticket', when: '6 hours ago', thumb: '--surface-blue-4' },
  { id: 2, title: 'How to lodge a ticket?', author: 'Stacy Kreed', category: 'Getting started', icon: 'lucide-circle-play', when: '6 hours ago', thumb: '--surface-gray-4' },
  { id: 3, title: 'Getting started with Helpdesk', author: 'Stacy kreed', category: 'Tickets', icon: 'lucide-ticket', when: '45 min ago', thumb: '--surface-amber-4' },
  { id: 4, title: 'How to install helpdesk for companies', author: 'Stacy kreed', category: 'Getting started', icon: 'lucide-circle-play', when: '45 min ago', thumb: '--surface-blue-5' },
  { id: 5, title: 'How is CPU usage calculated and throttled?', author: 'Matt Daemon', category: 'FAQ', icon: 'lucide-circle-help', when: '45 min ago', thumb: '--surface-red-4' },
  { id: 6, title: 'Automatically forward emails to Help desk', author: 'Matt Daemon', category: 'FAQ', icon: 'lucide-circle-help', when: '45 min ago', thumb: '--surface-amber-5' },
  { id: 7, title: 'Dynamically link to other tools from the Help desk', author: 'Stacy kreed', category: 'Wiki', icon: 'lucide-book-open', when: '45 min ago', thumb: '--surface-green-4' },
  { id: 8, title: 'Tickets explained', author: 'Liam Steel', category: 'Getting started', icon: 'lucide-circle-play', when: '45 min ago', thumb: '--surface-violet-4' },
  { id: 9, title: 'How is site usage calculated and charged?', author: 'Kate Sharma', category: 'Best practices', icon: 'lucide-shield-check', when: '45 min ago', thumb: '--surface-violet-5' },
  { id: 10, title: 'Keeping your knowledge base tidy', author: 'Layla Green', category: 'Wiki', icon: 'lucide-book-open', when: '2 days ago', thumb: '--surface-green-5' },
]

// `name` mirrors the id — ListView finds a selected row's neighbours by `name`.
const rows = articles.map((article) => ({ ...article, name: article.id }))

const opened = ref<string | null>(null)
</script>

<template>
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      The design hides this table's label row, so there isn't one.
      The hover swap is expressed as "inside a hovered row" — Tailwind's
      `group` would have to sit on the row, and ListView owns that element.
      Rows are the `.transition-all` elements.
    -->
    <ListView
      :class="`!w-full ${espressoListView} [&_.grid.rounded-4.bg-surface-gray-2]:!hidden [&_.transition-all.flex-col:hover_[data-row-meta]]:hidden [&_.transition-all.flex-col:hover_[data-row-actions]]:!flex`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{
        selectable: false,
        showTooltip: false,
        rowHeight: 68,
        onRowClick: (row: Article) => (opened = row.title),
      }"
    >
      <template #cell="{ row }">
        <span class="flex w-full min-w-0 items-center gap-3">
          <span
            class="size-10 shrink-0 rounded-3"
            :style="{ background: `var(${(row as Article).thumb})` }"
            aria-hidden="true"
          />

          <span class="min-w-0 flex-1">
            <span class="block truncate text-base-medium text-ink-gray-8">
              {{ (row as Article).title }}
            </span>
            <span class="mt-[2px] block truncate text-p-base text-ink-gray-6">
              {{ description }}
            </span>
          </span>

          <!--
            Author, category and time — they step aside on hover. The design's
            cells are 160/160/112 and each carries 8px of padding, so the last
            value finishes 16px inside the row, not 8.
          -->
          <span data-row-meta class="flex shrink-0 items-center pr-2">
            <span class="flex w-[160px] items-center gap-2">
              <Avatar
                size="sm"
                :image="faceFor((row as Article).author)"
                :label="(row as Article).author"
              />
              <span class="truncate text-base text-ink-gray-6">
                {{ (row as Article).author }}
              </span>
            </span>
            <span class="flex w-[160px] items-center gap-2">
              <span
                class="size-4 shrink-0 text-ink-gray-5"
                :class="(row as Article).icon"
                aria-hidden="true"
              />
              <span class="truncate text-base text-ink-gray-6">
                {{ (row as Article).category }}
              </span>
            </span>
            <span class="w-[112px] truncate text-base text-ink-gray-6">
              {{ (row as Article).when }}
            </span>
          </span>

          <span data-row-actions class="hidden shrink-0 items-center gap-1">
            <Button variant="ghost" size="sm" icon="lucide-square-pen" aria-label="Edit" @click.stop />
            <Button variant="ghost" size="sm" icon="lucide-trash-2" aria-label="Delete" @click.stop />
            <Button variant="ghost" size="sm" icon="lucide-forward" aria-label="Share" @click.stop />
          </span>
        </span>
      </template>
    </ListView>
  </div>
</template>
