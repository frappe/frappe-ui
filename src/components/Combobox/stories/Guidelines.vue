<script setup lang="ts">
import { Combobox } from 'frappe-ui'

// The trigger and popover open when the query changes, transitions, and
// portals to <body> for correct floating placement — none of which survives
// being frozen open side by side with other guidelines on a static page. So
// the three "open popover" examples below reproduce the real markup and
// exact utility classes Combobox itself renders (PopoverPanel's shell,
// ComboboxResults' item/group classes), just laid out inline instead of
// floating. Every other example — every closed trigger — is the real,
// interactive `Combobox` component.
const panelClass =
  'overflow-hidden rounded-6 bg-surface-elevation-2 p-1 shadow-2xl ring-1 ring-black ring-opacity-5'
const triggerClass =
  'relative flex min-h-7 items-center gap-2 rounded-4 border border-[--surface-gray-2] bg-surface-gray-2 px-2 text-base text-ink-gray-7'
const groupLabelClass =
  'flex h-7 items-center px-2 text-sm-medium leading-tighter text-ink-gray-4'
const itemClass = 'flex min-h-7 items-center rounded-4 px-2 text-base'

const apps = ['CRM', 'Helpdesk', 'Learning', 'Insights', 'Drive']

const teams = [
  { group: 'Engineering', options: ['Platform Infra', 'Mobile 2.0', 'Growth'] },
  { group: 'Product', options: ['Discovery', 'Roadmap'] },
]

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

    <!-- 2. No separate search field inside the dropdown — trigger="input"
         already searches, so the popover doesn't need one. -->
    <Guideline
      layout="stack"
      caption="Don't add a search field inside the dropdown — the combobox field already searches."
    >
      <template #do>
        <div class="flex w-56 flex-col gap-1">
          <div :class="triggerClass">
            <span>Platform Infra</span>
            <span class="lucide-chevron-up ml-auto size-4 text-ink-gray-6" />
          </div>
          <div :class="panelClass">
            <p :class="groupLabelClass">Engineering</p>
            <div :class="[itemClass, 'justify-between bg-surface-gray-3']">
              Platform Infra
              <span class="lucide-check size-4 text-ink-gray-7" />
            </div>
            <div :class="itemClass">Mobile 2.0</div>
            <div :class="itemClass">Growth</div>
            <p :class="groupLabelClass">Product</p>
            <div :class="itemClass">Discovery</div>
            <div :class="itemClass">Roadmap</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex w-56 flex-col gap-1">
          <div :class="triggerClass">
            <span>Platform Infra</span>
            <span class="lucide-chevron-up ml-auto size-4 text-ink-gray-6" />
          </div>
          <div :class="panelClass">
            <div
              class="mb-1 flex items-center gap-1.5 rounded-4 bg-surface-gray-2 px-2 py-1 text-base text-ink-gray-5"
            >
              <span class="lucide-search size-4" />
              Search
            </div>
            <p :class="groupLabelClass">Engineering</p>
            <div :class="[itemClass, 'bg-surface-gray-3']">Platform Infra</div>
            <div :class="itemClass">Mobile 2.0</div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Keep the label visible after selection (do-only, real component) -->
    <Guideline
      caption="Keep the label visible even after an option is selected."
    >
      <template #do>
        <Combobox
          class="w-56"
          label="App"
          :options="apps"
          model-value="Helpdesk"
        />
      </template>
    </Guideline>

    <!-- 4. Clear feedback for no results and error states. The "do" side
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

    <!-- 5. Allow clearing the selection (do-only, real component). The
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
