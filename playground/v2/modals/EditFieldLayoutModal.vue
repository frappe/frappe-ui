<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 720 (34967:149564) — "modal new",
// variant form. Left, a 304px layout editor: surface-gray-1 section headers
// and outline field rows (28px, 6px apart) that drag to reorder, an outline
// "Add field" per section and a subtle "Add section". Right, 16px over, an
// outline-gray-1, p 12 preview panel that mirrors the layout as label / placeholder
// pairs. Toolbar and footer sit 16px from the columns.
import { computed, ref, watch } from 'vue'
import { Button, Divider, Dropdown, Select, Switch } from '../../../src'
import EspressoModal from './EspressoModal.vue'

interface Section {
  id: number
  label: string
  collapsed: boolean
  fields: string[]
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ save: [layout: { doctype: string | null; sections: { label: string; fields: string[] }[] }] }>()

const doctypes = ['Lead', 'Deal', 'Contact', 'Organisation'].map((d) => ({
  label: d,
  value: d,
}))

const ALL_FIELDS = [
  'Details',
  'Organisation',
  'Website',
  'Industry',
  'Lead owner',
  'First name',
  'Last name',
  'Email address',
  'Phone number',
  'Mobile no.',
  'Job title',
  'Territory',
  'Annual revenue',
  'No. of employees',
]

let nextId = 1
const initial = (): Section[] => [
  {
    id: nextId++,
    label: 'Details',
    collapsed: false,
    fields: ['Details', 'Organisation', 'Website', 'Industry', 'Lead owner'],
  },
  {
    id: nextId++,
    label: 'Personal',
    collapsed: false,
    fields: ['First name', 'Last name', 'Email address', 'Phone number'],
  },
]

const doctype = ref<string | null>(null)
const preview = ref(true)
const sections = ref<Section[]>(initial())
const previewCollapsed = ref<Record<number, boolean>>({})

watch(open, (isOpen) => {
  if (!isOpen) return
  doctype.value = null
  preview.value = true
  sections.value = initial()
  previewCollapsed.value = {}
})

const used = computed(() => new Set(sections.value.flatMap((s) => s.fields)))

function addFieldOptions(section: Section) {
  const free = ALL_FIELDS.filter((f) => !used.value.has(f))
  return free.length
    ? free.map((f) => ({ label: f, onClick: () => section.fields.push(f) }))
    : [{ label: 'All fields are placed', disabled: true }]
}

function addSection() {
  sections.value.push({
    id: nextId++,
    label: `Section ${sections.value.length + 1}`,
    collapsed: false,
    fields: [],
  })
}

// Drag a field row within or across sections.
const dragging = ref<{ section: number; index: number } | null>(null)

function onDrop(section: Section, index: number) {
  const from = dragging.value
  dragging.value = null
  if (!from) return
  const source = sections.value.find((s) => s.id === from.section)
  if (!source) return
  const [field] = source.fields.splice(from.index, 1)
  const at = source === section && from.index < index ? index - 1 : index
  section.fields.splice(at, 0, field)
}

function save(close: () => void) {
  emit('save', {
    doctype: doctype.value,
    sections: sections.value.map((s) => ({ label: s.label, fields: [...s.fields] })),
  })
  close()
}
</script>

<template>
  <EspressoModal
    v-model:open="open"
    title="Edit field layout"
    variant="form"
    width="720"
  >
    <template #default="{ close }">
      <div class="flex flex-col gap-4">
        <!-- toolbar: sm subtle select · Preview switch -->
        <div class="flex items-center justify-between">
          <Select
            v-model="doctype"
            class="w-auto"
            size="sm"
            placeholder="Select"
            :options="doctypes"
          />
          <Switch v-model="preview" label="Preview" control-position="start" />
        </div>

        <div class="flex items-stretch gap-4">
          <!-- editor column -->
          <div class="flex w-[304px] shrink-0 flex-col gap-4">
            <div v-for="section in sections" :key="section.id" class="flex flex-col gap-1.5">
              <!-- section header: 28px, surface-gray-2 -->
              <div class="flex h-7 items-center gap-1 rounded-4 bg-surface-gray-1 pl-1 pr-1 dark:bg-surface-gray-2">
                <Button
                  variant="ghost"
                  size="xs"
                  :label="section.collapsed ? 'Expand section' : 'Collapse section'"
                  @click="section.collapsed = !section.collapsed"
                >
                  <template #icon>
                    <span
                      class="size-4 text-ink-gray-7"
                      :class="section.collapsed ? 'lucide-chevron-right' : 'lucide-chevron-down'"
                    />
                  </template>
                </Button>
                <input
                  v-model="section.label"
                  aria-label="Section name"
                  class="min-w-0 flex-1 border-none bg-transparent p-0 text-base-medium text-ink-gray-8 focus:ring-0"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  label="Remove section"
                  @click="sections = sections.filter((s) => s !== section)"
                >
                  <template #icon><span class="lucide-x size-4 text-ink-gray-7" /></template>
                </Button>
              </div>

              <template v-if="!section.collapsed">
                <!-- field row: 28px outline, grip · label · remove -->
                <div
                  v-for="(field, i) in section.fields"
                  :key="field"
                  draggable="true"
                  class="flex h-7 cursor-grab items-center gap-1 rounded-4 border border-outline-gray-1 bg-surface-base pl-1 pr-1 active:cursor-grabbing"
                  :class="{ 'opacity-50': dragging?.section === section.id && dragging.index === i }"
                  @dragstart="dragging = { section: section.id, index: i }"
                  @dragend="dragging = null"
                  @dragover.prevent
                  @drop.prevent="onDrop(section, i)"
                >
                  <span class="lucide-grip-vertical size-4 shrink-0 px-1 text-ink-gray-5" />
                  <span class="flex-1 truncate text-base text-ink-gray-8">{{ field }}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    :label="`Remove ${field}`"
                    @click="section.fields.splice(i, 1)"
                  >
                    <template #icon><span class="lucide-x size-4 text-ink-gray-5" /></template>
                  </Button>
                </div>

                <Dropdown :options="addFieldOptions(section)" match-trigger-width>
                  <Button
                    class="w-full"
                    variant="outline"
                    size="md"
                    @dragover.prevent
                    @drop.prevent="onDrop(section, section.fields.length)"
                  >
                    <template #prefix><span class="lucide-plus size-4" /></template>
                    Add field
                  </Button>
                </Dropdown>
              </template>
            </div>

            <Button class="w-full" variant="subtle" size="md" @click="addSection">
              <template #prefix><span class="lucide-plus size-4" /></template>
              Add section
            </Button>
          </div>

          <!-- preview panel: always there; with Preview off it stays as an
               empty box so the layout doesn't shift, its content fading -->
          <div
            class="flex min-w-0 flex-1 flex-col rounded-6 border border-outline-gray-1 bg-surface-elevation-1 p-3"
            :aria-hidden="!preview || undefined"
          >
            <Transition name="field-preview">
            <div v-if="preview" class="flex flex-col">
            <template v-for="(section, s) in sections" :key="section.id">
              <Divider v-if="s > 0" flex-item class="my-3" />
              <button
                type="button"
                class="flex h-7 items-center gap-2 text-base-medium text-ink-gray-8"
                @click="previewCollapsed[section.id] = !previewCollapsed[section.id]"
              >
                <span
                  class="size-4 text-ink-gray-7"
                  :class="previewCollapsed[section.id] ? 'lucide-chevron-right' : 'lucide-chevron-down'"
                />
                {{ section.label }}
              </button>
              <dl v-if="!previewCollapsed[section.id]" class="mt-2 flex flex-col gap-5">
                <div
                  v-for="field in section.fields"
                  :key="field"
                  class="grid grid-cols-2 gap-4 text-base"
                >
                  <dt class="truncate text-ink-gray-5">{{ field }}</dt>
                  <dd class="truncate text-ink-gray-4">{{ field }}</dd>
                </div>
                <p v-if="!section.fields.length" class="text-base text-ink-gray-4">
                  No fields yet
                </p>
              </dl>
            </template>
            </div>
            </Transition>
          </div>
        </div>

        <div class="flex items-center justify-end gap-1.5">
          <Button variant="subtle" size="md" @click="close">Cancel</Button>
          <Button variant="solid" size="md" @click="save(close)">Save</Button>
        </div>
      </div>
    </template>
  </EspressoModal>
</template>

<style>
.field-preview-enter-active,
.field-preview-leave-active {
  transition:
    opacity 200ms ease,
    filter 200ms ease;
}
.field-preview-enter-from,
.field-preview-leave-to {
  opacity: 0;
  filter: blur(2px);
}
@media (prefers-reduced-motion: reduce) {
  .field-preview-enter-active,
  .field-preview-leave-active {
    transition: none;
  }
}
</style>
