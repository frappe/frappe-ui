<script setup lang="ts">
import { computed, ref } from 'vue'
import { Combobox } from 'frappe-ui'

// From Frappe Builder's style panel: a color property like Background picks
// a color token, and an empty value is "unset", so the block falls back to
// its default. "Unset" isn't an option in the list, so without a clear button
// there's no way back to it. Both sides are live.
const tokens = [
  { label: 'accent', value: 'accent', color: '#5b5bd6' },
  { label: 'accent-2', value: 'accent-2', color: '#d6409f' },
  { label: 'accent-3', value: 'accent-3', color: '#f0a33c' },
  { label: 'accent-soft', value: 'accent-soft', color: '#eef0ff' },
  { label: 'surface', value: 'surface', color: '#f3f3f3' },
  { label: 'ink', value: 'ink', color: '#171717' },
]
const withClear = ref<string | null>('accent-2')
const withoutClear = ref<string | null>('accent-2')

// A property row: the name on the left, the picker on the right.
const row = 'flex w-72 items-center justify-between gap-3'
const property = 'text-sm text-ink-gray-6'
const swatch = 'size-4 shrink-0 rounded-full ring-1 ring-inset ring-black/10'

// Card 2, from HRMS's link fields: records are named by generated IDs, and
// the readable name is what people scan for. The ID stays as a muted hint.
const employees = [
  { label: 'Jane Cooper', value: 'HR-EMP-00042' },
  { label: 'Arjun Mehta', value: 'HR-EMP-00043' },
  { label: 'Sofia Hartmann', value: 'HR-EMP-00051' },
  { label: 'Kenji Tanaka', value: 'HR-EMP-00058' },
]
const byId = employees.map((e) => ({ label: e.value, value: e.value }))
const named = ref('HR-EMP-00042')
const bareId = ref('HR-EMP-00042')

// Card 3, from Frappe Builder's analytics: any route is a valid filter, even
// one with no visits yet, so what people type is used as is. A value that
// matches no option is kept (see Free text); the custom row commits it.
const routes = ['/', '/pricing', '/blog', '/careers', '/contact']
const freeRoute = ref<string | null>('/pricing/enterprise')
const listOnlyRoute = ref<string | null>(null)
const routeOptions = computed(() => [
  ...routes,
  {
    type: 'custom' as const,
    key: 'use-typed',
    label: 'Use typed route',
    slot: 'use-typed',
    keepOpen: false,
    condition: ({ query }: { query: string }) => {
      const q = query.trim()
      return Boolean(q) && !routes.includes(q) && q !== freeRoute.value
    },
    onClick: ({ query }: { query: string }) => {
      freeRoute.value = query.trim()
    },
  },
])
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A generated ID alone makes people read codes instead of names.
         Both sides are live; open them to compare the lists. -->
    <Guideline
      layout="stack"
      caption="Show a record's name, with its ID as a hint, not the ID alone."
    >
      <template #do>
        <Combobox
          v-model="named"
          class="w-64"
          aria-label="Employee"
          :options="employees"
        >
          <template #item-suffix="{ item }">
            <span class="text-sm text-ink-gray-5">{{ item.value }}</span>
          </template>
        </Combobox>
      </template>
      <template #dont>
        <Combobox
          v-model="bareId"
          class="w-64"
          aria-label="Employee"
          :options="byId"
        />
      </template>
    </Guideline>

    <!-- 2. When any value is valid, a list that only takes its own options
         blocks real input. "Do" already holds a route that isn't listed;
         type one into "don't" to see it rejected. -->
    <Guideline
      layout="stack"
      caption="When any value is valid, like a route or a font, let people use what they type."
    >
      <template #do>
        <Combobox
          v-model="freeRoute"
          class="w-64"
          aria-label="Filter by route"
          placeholder="Filter by route"
          :options="routeOptions"
        >
          <template #item-use-typed="{ query }">
            <span class="truncate">
              Use
              <span class="font-medium text-ink-gray-8">{{ query }}</span>
            </span>
          </template>
        </Combobox>
      </template>
      <template #dont>
        <Combobox
          v-model="listOnlyRoute"
          class="w-64"
          aria-label="Filter by route"
          placeholder="Try /pricing/enterprise"
          :options="routes"
        />
      </template>
    </Guideline>

    <!-- 3. When empty means something ("unset", so the style falls back to
         its default), give the field a clear button. `#suffix` and
         `clear()` are the pattern from the Clear button section. -->
    <Guideline
      layout="stack"
      caption="Add a clear button when empty means something, like a style that falls back to unset."
    >
      <template #do>
        <div :class="row">
          <span :class="property">Background</span>
          <Combobox
            v-model="withClear"
            class="w-40"
            aria-label="Background"
            placeholder="unset"
            :options="tokens"
          >
            <template #prefix>
              <span :class="[swatch, 'bg-surface-gray-3']" />
            </template>
            <template #item-prefix="{ item }">
              <span :class="swatch" :style="{ background: item.color }" />
            </template>
            <template #suffix="{ clear }">
              <button
                v-if="withClear"
                type="button"
                aria-label="Clear"
                class="text-ink-gray-5"
                @click.stop="clear"
                @pointerdown.stop
              >
                <span class="lucide-x size-4" aria-hidden="true" />
              </button>
            </template>
          </Combobox>
        </div>
      </template>
      <template #dont>
        <div :class="row">
          <span :class="property">Background</span>
          <Combobox
            v-model="withoutClear"
            class="w-40"
            aria-label="Background"
            placeholder="unset"
            :options="tokens"
          >
            <template #prefix>
              <span :class="[swatch, 'bg-surface-gray-3']" />
            </template>
            <template #item-prefix="{ item }">
              <span :class="swatch" :style="{ background: item.color }" />
            </template>
          </Combobox>
        </div>
      </template>
    </Guideline>
  </div>
</template>
