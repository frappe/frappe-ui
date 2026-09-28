<script setup lang="ts">
// The open popover and specific chip states can't be frozen from the live
// component on a static page, so these examples reproduce MultiSelect's
// trigger, chip and popover markup inline with the same utility classes.
const panel =
  'w-64 overflow-hidden rounded-6 bg-surface-elevation-2 p-1 shadow-2xl ring-1 ring-black ring-opacity-5'
const trigger =
  'flex w-64 min-h-8 flex-wrap items-center gap-1 rounded-4 border border-outline-gray-2 bg-surface-base px-1.5 py-1'
const item = 'flex min-h-7 items-center justify-between rounded-4 px-2 text-base text-ink-gray-7'
const chip =
  'inline-flex items-center gap-1 rounded-2 bg-surface-gray-2 px-1.5 py-0.5 text-sm text-ink-gray-7'

const brands = ['Samsung', 'Sony', 'Apple', 'Google', 'Panasonic', 'LG']
const picked = ['Apple', 'Google']
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Highlight selected options -->
    <Guideline
      layout="stack"
      caption="Highlight and check selected options so users can see what's already picked."
    >
      <template #do>
        <div :class="panel">
          <div
            v-for="b in brands"
            :key="b"
            :class="[item, picked.includes(b) && 'bg-surface-gray-3']"
          >
            {{ b }}
            <span
              v-if="picked.includes(b)"
              class="lucide-check size-4 text-ink-gray-7"
            />
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="panel">
          <div v-for="b in brands" :key="b" :class="item">{{ b }}</div>
        </div>
      </template>
    </Guideline>

    <!-- 2. Removable chips, not a count -->
    <Guideline
      layout="stack"
      caption="Show each selection as a removable chip with an ×, not a count."
    >
      <template #do>
        <div :class="trigger">
          <span v-for="p in picked" :key="p" :class="chip">
            {{ p }}
            <span class="lucide-x size-3 text-ink-gray-5" />
          </span>
          <span class="lucide-chevron-down ml-auto size-4 text-ink-gray-5" />
        </div>
      </template>
      <template #dont>
        <div :class="trigger">
          <span class="px-0.5 text-base text-ink-gray-6">2 items selected</span>
          <span class="lucide-chevron-down ml-auto size-4 text-ink-gray-5" />
        </div>
      </template>
    </Guideline>

    <!-- 3. Search field for long lists -->
    <Guideline
      layout="stack"
      caption="Add a search field for long lists so users can filter instead of scrolling."
    >
      <template #do>
        <div :class="panel">
          <div
            class="mb-1 flex items-center gap-1.5 rounded-4 bg-surface-gray-2 px-2 py-1 text-base text-ink-gray-5"
          >
            <span class="lucide-search size-4" />
            Search
          </div>
          <div v-for="b in brands" :key="b" :class="item">{{ b }}</div>
        </div>
      </template>
      <template #dont>
        <div :class="panel">
          <div v-for="b in brands" :key="b" :class="item">{{ b }}</div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Cap the height with a +N more chip -->
    <Guideline
      layout="stack"
      caption="Collapse extra selections into a “+N more” chip to keep the field height predictable."
    >
      <template #do>
        <div :class="trigger">
          <span v-for="p in ['Apple', 'Google', 'Sony']" :key="p" :class="chip">
            {{ p }}
            <span class="lucide-x size-3 text-ink-gray-5" />
          </span>
          <span :class="chip">+2 more</span>
          <span class="lucide-chevron-down ml-auto size-4 text-ink-gray-5" />
        </div>
      </template>
      <template #dont>
        <div :class="trigger">
          <span
            v-for="p in [
              'Apple',
              'Google',
              'Sony',
              'Panasonic',
              'LG',
              'Samsung',
              'Philips',
              'Motorola',
            ]"
            :key="p"
            :class="chip"
          >
            {{ p }}
            <span class="lucide-x size-3 text-ink-gray-5" />
          </span>
        </div>
      </template>
    </Guideline>
  </div>
</template>
