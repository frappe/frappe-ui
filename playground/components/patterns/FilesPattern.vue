<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { filePreviewIsPhoto, filePreviews } from './designAssets'
import { espressoListView } from './listViewClasses'

type FileRow = {
  id: number
  title: string
  size: string
  type: string
  date: string
  time: string
}

// Laid out the way Tasks is: Title names the row and takes the width, the rest
// are sized to what they hold and sit together on the right. The last column
// stays empty until the row is hovered.
const columns = [
  { label: 'Title', key: 'title', width: '1fr' },
  { label: 'Size', key: 'size', width: '88px' },
  { label: 'Type', key: 'type', width: '112px' },
  { label: 'Date', key: 'date', width: '200px' },
  { label: '', key: 'actions', width: '104px' },
]

const files: FileRow[] = [
  { id: 1, title: 'Youtube-thumbnail.png', size: '1.6 MB', type: 'PNG image', date: 'Yesterday', time: '11:32 PM' },
  { id: 2, title: 'Socials-final.png', size: '2.4 MB', type: 'PNG image', date: 'Apr 12, 2026', time: '11:32 AM' },
  { id: 3, title: 'leading-craft.pdf', size: '12 MB', type: 'PDF', date: 'Apr 12, 2026', time: '12:44 AM' },
  { id: 4, title: 'Why-frappe.png', size: '1.6 MB', type: 'PNG image', date: 'Apr 16, 2026', time: '9:53 AM' },
  { id: 5, title: 'golf-together.png', size: '1.8 MB', type: 'PNG image', date: 'Apr 17, 2026', time: '2:16 PM' },
  { id: 6, title: 'Fsuite-case-study.pdf', size: '19 MB', type: 'PDF', date: 'Apr 18, 2026', time: '12:32 PM' },
  { id: 7, title: 'Thumbnail-draft.png', size: '1.6 MB', type: 'PNG image', date: 'Apr 20, 2026', time: '4:55 PM' },
  { id: 8, title: 'Branding-inspi.png', size: '1.6 MB', type: 'PNG image', date: 'Apr 24, 2026', time: '11:32 PM' },
  { id: 9, title: 'ticket-helpdesk.html', size: '12 MB', type: 'HTML file', date: 'Apr 29, 2026', time: '6:44 PM' },
  { id: 10, title: 'geist-font-v1.7.0.zip', size: '235 KB', type: 'ZIP folder', date: 'May 1, 2026', time: '10:32 AM' },
]

// `name` mirrors the id — ListView finds a selected row's neighbours by `name`.
// The preview comes from the design frame, matched to the row it was drawn on.
const rows = files.map((file, index) => ({
  ...file,
  name: file.id,
  preview: filePreviews[index],
  isPhoto: filePreviewIsPhoto[index],
}))

const opened = ref<string | null>(null)
</script>

<template>
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      The three actions only appear on the row under the cursor. Tailwind's
      `group` has to sit on the element itself and ListView owns the row, so
      the hover is expressed as "inside a hovered row" instead — the rows are
      the `.transition-all` elements.
    -->
    <ListView
      :class="`!w-full ${espressoListView} [&_.transition-all.flex-col:hover_[data-row-actions]]:!opacity-100`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{
        selectable: false,
        showTooltip: false,
        rowHeight: 40,
        onRowClick: (row: FileRow) => (opened = row.title),
      }"
    >
      <!--
        `align: 'right'` on a column does nothing: ListView puts `justify-end`
        on the cell, which isn't a flex box. The push comes from inside.
      -->
      <template #cell="{ item, row, column }">
        <span
          class="flex min-w-0 items-center gap-2"
          :class="column.key === 'actions' ? 'w-full justify-end' : ''"
        >
          <!--
            The file's own preview is the title cell's prefix, at the size the
            design draws it: 31x20, corner radius 3. The photographs carry the
            frame's shadow; the document pages don't — they bring their own,
            and a box shadow would draw a rectangle around a cut-out page.
          -->
          <img
            v-if="column.key === 'title'"
            :src="(row as any).preview"
            class="h-5 w-[31px] shrink-0 rounded-[3px] object-cover"
            :class="
              (row as any).isPhoto
                ? 'shadow-[0_0.4px_1px_rgba(0,0,0,0.14),0_0_0.3px_rgba(0,0,0,0.16)]'
                : ''
            "
            alt=""
          />

          <!-- Date and time, split by the design's middle dot. -->
          <template v-else-if="column.key === 'date'">
            <span class="truncate text-base text-ink-gray-6">
              {{ (row as FileRow).date }}
            </span>
            <span class="text-base text-ink-gray-4" aria-hidden="true">·</span>
            <span class="truncate text-base text-ink-gray-6">
              {{ (row as FileRow).time }}
            </span>
          </template>

          <!-- Download, share, more — only while the row is hovered. -->
          <span
            v-else-if="column.key === 'actions'"
            data-row-actions
            class="flex items-center gap-1 opacity-0 transition-opacity"
          >
            <Button variant="ghost" size="sm" icon="lucide-download" aria-label="Download" @click.stop />
            <Button variant="ghost" size="sm" icon="lucide-forward" aria-label="Share" @click.stop />
            <Button variant="ghost" size="sm" icon="lucide-ellipsis" aria-label="More" @click.stop />
          </span>

          <span
            v-if="column.key === 'title' || column.key === 'size' || column.key === 'type'"
            class="truncate"
            :class="
              column.key === 'title'
                ? 'text-base-medium text-ink-gray-8'
                : 'text-base text-ink-gray-6'
            "
          >
            {{ item }}
          </span>
        </span>
      </template>
    </ListView>
  </div>
</template>
