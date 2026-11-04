<script setup lang="ts">
import { Avatar, Breadcrumbs, Button, Dropdown } from '../../src'
import { faceFor } from '../components/patterns/designAssets'

/**
 * The app header, to the file exactly (node 35240:71384, `header new`).
 *
 *   48 tall · 12 left, 20 right, 10 top and bottom · a 1px outline-gray-1
 *   rule along the bottom · left slot and right slot pushed apart
 *
 * 48 is the whole height and the contents are 28, which is what the 10/10
 * leaves — so every control in here is a `sm` one (`h-7`). Nothing may make
 * this taller.
 */

const emit = defineEmits<{
  /** New → Event or New → Task, from the header's own menu. */
  new: [kind: 'Event' | 'Task']
}>()

// The file's dropdown under New (node 35208:100256): 220 wide, radius 12,
// two 28px rows — an Event and a Task, each with its glyph. The radius and
// the rows are Dropdown's own; the width is not a prop, so the menu is sent
// to a target the page owns and sized there (`#calendar-new-menu`).
const newOptions = [
  {
    label: 'Event',
    icon: 'lucide-calendar',
    onClick: () => emit('new', 'Event'),
  },
  {
    label: 'Task',
    icon: 'lucide-circle-check-big',
    onClick: () => emit('new', 'Task'),
  },
]

// Five faces at 24px overlapping by 4, the first on top — the file's
// `avatar-group`, which frappe-ui doesn't ship. Built from Avatar until it
// does: `-space-x-1` is the 4px, and the z-index runs down the row so each
// face cuts a clean edge out of the one behind.
const people = [
  'Sally Potter',
  'Emily Taylor',
  'Shariq Ansari',
  'Faris Ansari',
  'Gowtham Sivakumar',
]
</script>

<template>
  <header
    class="flex h-12 shrink-0 items-center justify-between border-b border-outline-gray-1 py-2.5 pl-3 pr-5"
  >
    <!-- The left slot: a breadcrumb, its last crumb the active one. -->
    <Breadcrumbs :items="[{ label: 'Calendar' }]" />

    <!-- The right slot: the group, then Share, then New — 8 apart. -->
    <div class="flex items-center gap-2">
      <div class="flex items-center -space-x-1">
        <Avatar
          v-for="(name, i) in people"
          :key="name"
          size="md"
          :label="name"
          :image="faceFor(name)"
          class="ring-2 ring-[--surface-base]"
          :style="{ zIndex: people.length - i }"
        />
      </div>
      <Button size="sm" label="Share" />

      <!--
        New opens the menu rather than the panel: the file draws the choice
        first, and what is being made — an event or a task — is what the
        panel needs to know before it opens.
      -->
      <Dropdown
        :options="newOptions"
        align="end"
        portal-to="#calendar-new-menu"
      >
        <template #trigger="{ open }">
          <Button size="sm" variant="solid" icon-left="lucide-plus" label="New">
            New
            <template #suffix>
              <span
                class="lucide-chevron-down size-4 transition-transform"
                :class="open && 'rotate-180'"
                aria-hidden="true"
              />
            </template>
          </Button>
        </template>
      </Dropdown>
    </div>
  </header>
</template>
