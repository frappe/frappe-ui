<script setup lang="ts">
// A live Dropdown has to stay open to show this, but its menu portals to
// <body> and doesn't reserve layout space, so an open one on a static page
// overlaps the captions. These reproduce Menu's own classes one to one (`menuClasses` in Menu/utils.ts, ItemListRow's `sm` row) instead
// of approximating them.
const panelClass =
  'divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5'
const groupClass = 'flex flex-col p-1.5'
const groupLabelClass =
  'flex h-7 items-center px-2 text-sm font-medium leading-tighter text-ink-gray-4'
const itemClass =
  'flex min-h-7 items-center gap-2 rounded-4 px-2 py-1.5 text-base text-ink-gray-7'
const iconClass = 'size-4 shrink-0 text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Group relevant items (do-only) -->
    <Guideline
      :mark="false"
      caption="Keep the list easy to scan by grouping relevant items."
    >
      <template #do>
        <div :class="panelClass">
          <div :class="groupClass">
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              List
            </div>
            <div :class="itemClass">
              <span class="lucide-kanban" :class="iconClass" />
              Kanban
            </div>
            <div :class="itemClass">
              <span class="lucide-list-tree" :class="iconClass" />
              Group by
            </div>
          </div>
          <div :class="groupClass">
            <p :class="groupLabelClass">Saved views</p>
            <div :class="itemClass">
              <span class="lucide-kanban" :class="iconClass" />
              Jan '25 Deals
            </div>
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              Deals ready to close
            </div>
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              Lost deals
            </div>
          </div>
          <div :class="groupClass">
            <p :class="groupLabelClass">Public views</p>
            <div :class="itemClass">
              <span
                class="inline-flex size-4 shrink-0 items-center justify-center"
                >🙌</span
              >
              My leads
            </div>
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              My open leads
            </div>
          </div>
          <div :class="groupClass">
            <div :class="itemClass">
              <span class="lucide-plus" :class="iconClass" />
              Create view
            </div>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
