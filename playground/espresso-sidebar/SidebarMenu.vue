<template>
  <!-- An app's menu: its rows, with the disclosure sections folding the rows
       they own. Shared by the Espresso sidebar and the v2 shell, so a
       chevron behaves the same wherever the menu is drawn. -->
  <div class="flex flex-col" :style="{ gap: `${scenario.menuGap}px` }">
    <template v-for="(segment, i) in menuSegments" :key="`${scenario.id}-${i}`">
      <SidebarRow v-if="segment.kind === 'row'" :row="segment.row" />
      <!-- A disclosure section and the rows it folds. The rows sit in a grid
           track that eases between its content height and zero; the menu's
           gap moves inside it as top padding, so nothing is left behind when
           folded. -->
      <div v-else class="flex flex-col">
        <SidebarRow :row="segment.header" />
        <div
          class="grid transition-[grid-template-rows] duration-200 ease-in-out"
          :class="
            segment.header.expanded === false
              ? 'grid-rows-[0fr]'
              : 'grid-rows-[1fr]'
          "
          :inert="segment.header.expanded === false || undefined"
        >
          <div class="min-h-0 overflow-hidden">
            <div
              class="flex flex-col"
              :style="{
                gap: `${scenario.menuGap}px`,
                paddingTop: `${scenario.menuGap}px`,
              }"
            >
              <SidebarRow
                v-for="(row, j) in segment.rows"
                :key="j"
                :row="row"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SidebarRow from './SidebarRow.vue'
import type { Scenario } from './scenarios'
import type { Row, SectionRow } from './types'

const props = defineProps<{ scenario: Scenario }>()

// Disclosure sections (a chevron header: Public Views, My Calendars,
// Delegated Calendar) own the rows beneath them, up to the next divider or
// section. Each folds on its own; the open state lives for the session, and
// an app opens with all of its sections showing.
const foldedSections = ref(new Set<string>())
watch(
  () => props.scenario.id,
  () => (foldedSections.value = new Set()),
)

type MenuSegment =
  | { kind: 'row'; row: Row }
  | { kind: 'section'; header: SectionRow; rows: Row[] }

const menuSegments = computed<MenuSegment[]>(() => {
  const segments: MenuSegment[] = []
  let open: Extract<MenuSegment, { kind: 'section' }> | null = null
  for (const row of props.scenario.rows) {
    if (row.type === 'divider' || row.type === 'section') open = null
    if (row.type === 'section' && row.chevron) {
      const key = `${props.scenario.id}:${row.label}`
      open = {
        kind: 'section',
        header: {
          ...row,
          expanded: !foldedSections.value.has(key),
          onToggle: () => {
            const next = new Set(foldedSections.value)
            next.has(key) ? next.delete(key) : next.add(key)
            foldedSections.value = next
          },
        },
        rows: [],
      }
      segments.push(open)
    } else if (open) {
      open.rows.push(row)
    } else {
      segments.push({ kind: 'row', row })
    }
  }
  return segments
})
</script>
