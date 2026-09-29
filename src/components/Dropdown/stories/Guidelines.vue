<script setup lang="ts">
// A live Dropdown has to stay open to show this, but its menu portals to
// <body> and doesn't reserve layout space, so an open one on a static page
// overlaps the captions. These reproduce Menu's own classes one to one
// (`menuClasses` in Menu/utils.ts, ItemListRow's `sm` row) instead of
// approximating them.
const panelClass =
  'divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5'
const groupClass = 'flex flex-col p-1.5'
const itemClass =
  'flex min-h-7 items-center gap-2 rounded-4 px-2 py-1.5 text-base text-ink-gray-7'
const iconClass = 'size-4 shrink-0 text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Delete between Edit and Duplicate gets clicked by accident. Last, in
         its own group and in red, it's hard to hit by mistake. Red matches
         Menu's `theme: 'red'` item (text-ink-red-7). -->
    <Guideline
      caption="Put destructive actions like Delete last, in their own group, in red."
    >
      <template #do>
        <div :class="[panelClass, 'w-48']">
          <div :class="groupClass">
            <div :class="itemClass">
              <span :class="['lucide-pencil', iconClass]" aria-hidden="true" />
              Edit
            </div>
            <div :class="itemClass">
              <span :class="['lucide-copy', iconClass]" aria-hidden="true" />
              Duplicate
            </div>
            <div :class="itemClass">
              <span
                :class="['lucide-folder-input', iconClass]"
                aria-hidden="true"
              />
              Move to
            </div>
          </div>
          <div :class="groupClass">
            <div :class="[itemClass, 'text-ink-red-7']">
              <span
                class="lucide-trash-2 size-4 shrink-0 text-ink-red-7"
                aria-hidden="true"
              />
              Delete
            </div>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="[panelClass, 'w-48']">
          <div :class="groupClass">
            <div :class="itemClass">
              <span :class="['lucide-pencil', iconClass]" aria-hidden="true" />
              Edit
            </div>
            <div :class="itemClass">
              <span :class="['lucide-trash-2', iconClass]" aria-hidden="true" />
              Delete
            </div>
            <div :class="itemClass">
              <span :class="['lucide-copy', iconClass]" aria-hidden="true" />
              Duplicate
            </div>
            <div :class="itemClass">
              <span
                :class="['lucide-folder-input', iconClass]"
                aria-hidden="true"
              />
              Move to
            </div>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
