<script setup lang="ts">
// The open-dropdown states can't be shown with the live component frozen open,
// so those examples are mocked with plain markup that mirrors the combobox.
const field =
  'flex w-56 items-center justify-between rounded-2 border border-outline-gray-2 bg-surface-base px-2.5 py-1.5 text-base text-ink-gray-8'
const menu =
  'w-56 rounded-2 border border-outline-gray-1 bg-surface-base p-1 shadow-sm'
const item = 'rounded px-2 py-1 text-base text-ink-gray-7'
const group = 'px-2 pt-1.5 pb-0.5 text-sm text-ink-gray-5'

const apps = ['CRM', 'Helpdesk', 'Learning', 'Insights', 'Drive']
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
          <div :class="field">
            <span>Learn<span class="text-ink-gray-4">|</span></span>
            <span class="lucide-chevron-up size-4 text-ink-gray-5" />
          </div>
          <div :class="menu">
            <div
              v-for="a in apps"
              :key="a"
              :class="[item, a === 'Learning' ? 'bg-surface-gray-3' : '']"
            >
              {{ a }}
            </div>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="field">
          <span>Learn<span class="text-ink-gray-4">|</span></span>
          <span class="lucide-chevron-down size-4 text-ink-gray-5" />
        </div>
      </template>
    </Guideline>

    <!-- 2. No search field inside the dropdown -->
    <Guideline
      layout="stack"
      caption="Don't add a search field inside the dropdown — the combobox field already searches."
    >
      <template #do>
        <div class="flex w-56 flex-col gap-1">
          <div :class="field">
            <span>Platform Infra</span>
            <span class="lucide-chevron-up size-4 text-ink-gray-5" />
          </div>
          <div :class="menu">
            <p :class="group">Engineering</p>
            <div :class="[item, 'flex justify-between bg-surface-gray-3']">
              Platform Infra
              <span class="lucide-check size-4 text-ink-gray-7" />
            </div>
            <div :class="item">Mobile 2.0</div>
            <div :class="item">Growth</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex w-56 flex-col gap-1">
          <div :class="field">
            <span>Platform Infra</span>
            <span class="lucide-chevron-up size-4 text-ink-gray-5" />
          </div>
          <div :class="menu">
            <div
              class="mb-1 flex items-center gap-1.5 rounded bg-surface-gray-2 px-2 py-1 text-base text-ink-gray-5"
            >
              <span class="lucide-search size-4" />
              Search
            </div>
            <p :class="group">Engineering</p>
            <div :class="item">Platform Infra</div>
            <div :class="item">Mobile 2.0</div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Keep the label visible after selection (do-only) -->
    <Guideline caption="Keep the label visible even after an option is selected.">
      <template #do>
        <div class="flex w-56 flex-col gap-1">
          <span class="text-sm text-ink-gray-5">App</span>
          <div :class="field">
            <span>Helpdesk</span>
            <span class="lucide-chevron-down size-4 text-ink-gray-5" />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Clear feedback for no results -->
    <Guideline
      layout="stack"
      caption="Show clear feedback for no results and error states."
    >
      <template #do>
        <div class="flex w-56 flex-col gap-1">
          <div :class="field">
            <span>Learning<span class="text-ink-gray-4">|</span></span>
            <span class="lucide-chevron-up size-4 text-ink-gray-5" />
          </div>
          <div :class="menu">
            <div :class="[item, 'text-ink-gray-5']">No results</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="field">
          <span>Learning<span class="text-ink-gray-4">|</span></span>
          <span class="lucide-chevron-down size-4 text-ink-gray-5" />
        </div>
      </template>
    </Guideline>

    <!-- 5. Allow clearing the selection (do-only) -->
    <Guideline caption="Let users clear their selection when appropriate.">
      <template #do>
        <div class="flex w-64 flex-col gap-1">
          <span class="text-sm text-ink-gray-5">Timezone</span>
          <div :class="field">
            <span>Eastern Standard Time (EST)</span>
            <span class="lucide-x size-4 text-ink-gray-5" />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
