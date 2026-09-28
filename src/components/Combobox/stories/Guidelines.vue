<script setup lang="ts">
import { Combobox } from 'frappe-ui'

// The trigger and popover open when the query changes, transitions, and
// portals to <body> for correct floating placement, none of which survives
// being frozen open side by side with other guidelines on a static page. So
// the two "open popover" examples below reproduce the real markup and
// exact utility classes Combobox itself renders (PopoverPanel's shell,
// ComboboxResults' item classes), just laid out inline instead of floating.
// Every other example, every closed trigger, is the real,
// interactive `Combobox` component.
const panelClass =
  'overflow-hidden rounded-6 bg-surface-elevation-2 p-1 shadow-2xl ring-1 ring-black ring-opacity-5'
const triggerClass =
  'relative flex min-h-7 items-center gap-2 rounded-4 border border-[--surface-gray-2] bg-surface-gray-2 px-2 text-base text-ink-gray-7'
const itemClass = 'flex min-h-7 items-center rounded-4 px-2 text-base'

const apps = ['CRM', 'Helpdesk', 'Learning', 'Insights', 'Drive']

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango']

const timezones = [
  'Eastern Standard Time (EST)',
  'Central Standard Time (CST)',
  'Pacific Standard Time (PST)',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Open the dropdown immediately -->
    <Guideline
      layout="stack"
      caption="Open the dropdown immediately so users can search and select."
    >
      <template #do>
        <div class="flex w-56 flex-col gap-1">
          <div :class="triggerClass">
            <span>Learn<span class="text-ink-gray-4">|</span></span>
            <span class="lucide-chevron-up ml-auto size-4 text-ink-gray-6" />
          </div>
          <div :class="panelClass">
            <div
              v-for="a in apps"
              :key="a"
              :class="[itemClass, a === 'Learning' && 'bg-surface-gray-3']"
            >
              {{ a }}
            </div>
          </div>
        </div>
      </template>
      <template #dont>
        <Combobox class="w-56" :options="apps" model-value="Learning" />
      </template>
    </Guideline>

    <!-- 2. Clear feedback for no results and error states. The "do" side
         copies Combobox's own built-in empty state one to one: the same
         `px-2 py-1.5 text-base text-ink-gray-5` row and the same fallback
         copy ("No results") it renders when `showEmpty` is true. -->
    <Guideline
      layout="stack"
      caption="Show clear feedback for no results and error states."
    >
      <template #do>
        <div class="flex w-56 flex-col gap-1">
          <div :class="triggerClass">
            <span>Learning<span class="text-ink-gray-4">|</span></span>
            <span class="lucide-chevron-up ml-auto size-4 text-ink-gray-6" />
          </div>
          <div :class="panelClass">
            <div class="px-2 py-1.5 text-base text-ink-gray-5">No results</div>
          </div>
        </div>
      </template>
      <template #dont>
        <Combobox class="w-56" :options="fruits" query="Learning" />
      </template>
    </Guideline>

    <!-- 3. Allow clearing the selection (do-only, real component). The
         `#suffix` slot and `clear()` are the documented pattern from the
         Clear button section above. -->
    <Guideline caption="Let users clear their selection when appropriate.">
      <template #do>
        <Combobox
          class="w-64"
          label="Timezone"
          :options="timezones"
          model-value="Eastern Standard Time (EST)"
        >
          <template #suffix="{ clear }">
            <button
              type="button"
              class="text-ink-gray-5"
              @click.stop="clear"
              @pointerdown.stop
            >
              <span class="lucide-x size-4" aria-hidden="true" />
            </button>
          </template>
        </Combobox>
      </template>
    </Guideline>
  </div>
</template>
