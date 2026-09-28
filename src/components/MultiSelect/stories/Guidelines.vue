<script setup lang="ts">
import { MultiSelect, Badge } from 'frappe-ui'
import { ref } from 'vue'

const options = [
  { label: 'Bug', value: 'bug' },
  { label: 'Feature', value: 'feature' },
  { label: 'Enhancement', value: 'enhancement' },
  { label: 'Documentation', value: 'docs' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Design', value: 'design' },
  { label: 'P0', value: 'p0' },
  { label: 'P1', value: 'p1' },
  { label: 'P2', value: 'p2' },
]

// One model per example so interacting with one doesn't move the others.
const chips = ref<string[]>(['bug', 'p0'])
const count = ref<string[]>(['bug', 'p0'])
const collapse = ref<string[]>(['bug', 'feature', 'docs', 'frontend', 'p0'])
const wrap = ref<string[]>(['bug', 'feature', 'docs', 'frontend', 'p0'])

function removeChip(v: string | number) {
  chips.value = chips.value.filter((x) => x !== v)
}
function removeCollapse(v: string | number) {
  collapse.value = collapse.value.filter((x) => x !== v)
}
function removeWrap(v: string | number) {
  wrap.value = wrap.value.filter((x) => x !== v)
}

const triggerClass =
  'flex w-72 min-h-8 cursor-pointer items-center gap-1.5 rounded-4 border border-[--surface-gray-2] px-1.5 py-1 text-left transition-colors hover:border-outline-elevation-2 data-[state=open]:focus-ring'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Removable chips, not a bare count -->
    <Guideline
      layout="stack"
      caption="Show each selection as a removable chip with an ×, not just a count."
    >
      <template #do>
        <MultiSelect v-model="chips" :options="options">
          <template #trigger="{ open, selectedOptions, setOpen }">
            <button
              type="button"
              :data-state="open ? 'open' : 'closed'"
              :class="triggerClass"
              @click="setOpen(!open)"
            >
              <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                <Badge
                  v-for="o in selectedOptions"
                  :key="o.value"
                  theme="gray"
                  size="md"
                >
                  {{ o.label }}
                  <template #suffix>
                    <span
                      role="button"
                      tabindex="-1"
                      class="-mr-0.5 inline-flex cursor-pointer items-center justify-center rounded-1 p-0.5 opacity-70 hover:opacity-100"
                      @click.stop="removeChip(o.value)"
                      @pointerdown.stop
                    >
                      <span class="lucide-x size-3" />
                    </span>
                  </template>
                </Badge>
                <span
                  v-if="!selectedOptions.length"
                  class="px-1 text-base text-ink-gray-4"
                >
                  Add labels…
                </span>
              </div>
              <span
                :class="[
                  'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform',
                  open && 'rotate-180',
                ]"
              />
            </button>
          </template>
        </MultiSelect>
      </template>
      <template #dont>
        <MultiSelect v-model="count" :options="options" class="w-72" />
      </template>
    </Guideline>

    <!-- 2. Collapse overflow into a "+N more" chip -->
    <Guideline
      layout="stack"
      caption="Collapse overflow into a “+N more” chip so the field height stays predictable."
    >
      <template #do>
        <MultiSelect v-model="collapse" :options="options">
          <template #trigger="{ open, selectedOptions, setOpen }">
            <button
              type="button"
              :data-state="open ? 'open' : 'closed'"
              :class="triggerClass"
              @click="setOpen(!open)"
            >
              <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                <Badge
                  v-for="o in selectedOptions.slice(0, 2)"
                  :key="o.value"
                  theme="gray"
                  size="md"
                >
                  {{ o.label }}
                  <template #suffix>
                    <span
                      role="button"
                      tabindex="-1"
                      class="-mr-0.5 inline-flex cursor-pointer items-center justify-center rounded-1 p-0.5 opacity-70 hover:opacity-100"
                      @click.stop="removeCollapse(o.value)"
                      @pointerdown.stop
                    >
                      <span class="lucide-x size-3" />
                    </span>
                  </template>
                </Badge>
                <span
                  v-if="selectedOptions.length > 2"
                  class="shrink-0 whitespace-nowrap px-1 text-sm text-ink-gray-5"
                >
                  +{{ selectedOptions.length - 2 }} more
                </span>
              </div>
              <span
                :class="[
                  'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform',
                  open && 'rotate-180',
                ]"
              />
            </button>
          </template>
        </MultiSelect>
      </template>
      <template #dont>
        <MultiSelect v-model="wrap" :options="options">
          <template #trigger="{ open, selectedOptions, setOpen }">
            <button
              type="button"
              :data-state="open ? 'open' : 'closed'"
              :class="triggerClass"
              @click="setOpen(!open)"
            >
              <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                <Badge
                  v-for="o in selectedOptions"
                  :key="o.value"
                  theme="gray"
                  size="md"
                >
                  {{ o.label }}
                  <template #suffix>
                    <span
                      role="button"
                      tabindex="-1"
                      class="-mr-0.5 inline-flex cursor-pointer items-center justify-center rounded-1 p-0.5 opacity-70 hover:opacity-100"
                      @click.stop="removeWrap(o.value)"
                      @pointerdown.stop
                    >
                      <span class="lucide-x size-3" />
                    </span>
                  </template>
                </Badge>
              </div>
              <span
                :class="[
                  'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform',
                  open && 'rotate-180',
                ]"
              />
            </button>
          </template>
        </MultiSelect>
      </template>
    </Guideline>
  </div>
</template>
