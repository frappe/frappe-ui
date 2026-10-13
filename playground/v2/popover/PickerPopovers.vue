<script setup lang="ts">
// Figma: espresso-2.0 › Popover › picker — a pair of grids or a pair of
// lists (`layout`), all on the raised popover surface with the lg shadow.
//   grid sm   (30867:37577) the emoji picker, see EmojiPicker.vue
//   grid md   (31731:20231) meeting reactions, see ReactionsPopover.vue
//   list sm   (30867:37575) 256px "Schedule email", 12px radius, pt 8 ·
//             px 4 · pb 12, 8px gaps: 14 medium title + ghost xs ×; 28px
//             menu items 4px apart (16px icon · 6px · label · time); a
//             solid sm Save (px 8)
//   list md   (31731:25458) 256px "Text style", 12px radius, pt 8 · px 4 ·
//             pb 4, 4px gaps: 16 medium title + ghost xs ×; a ghost search;
//             heading items with "size / line-height"; ghost sm "New style"
import { computed, ref } from 'vue'
import { Button, TextInput } from '../../../src'
import EmojiPicker from './EmojiPicker.vue'
import ReactionsPopover from './ReactionsPopover.vue'

defineProps<{ layout: 'grid' | 'list' }>()

const emit = defineEmits<{
  emoji: [emoji: string]
  react: [emoji: string]
  raiseHand: [raised: boolean]
  schedule: [when: string]
  textStyle: [style: string]
  newStyle: []
  close: []
}>()

// ---- list sm: schedule email
const SCHEDULES = [
  { id: 'today', label: 'Today', icon: 'lucide-calendar', time: '3:00PM' },
  { id: 'tomorrow', label: 'Tomorrow', icon: 'lucide-sun', time: '3:00PM' },
  {
    id: 'weekend',
    label: 'This weekend',
    icon: 'lucide-sofa',
    time: 'Sat, 3:00PM',
  },
  { id: 'custom', label: 'Custom date', icon: 'lucide-calendar-days' },
]
// Save sends the picked time, Today until another is picked.
const schedule = ref<string | null>(null)

// ---- list md: text style
const TEXT_STYLES = [
  { id: 'h1', label: 'Heading 1', icon: 'lucide-heading-1', metric: '48 / 56' },
  { id: 'h2', label: 'Heading 2', icon: 'lucide-heading-2', metric: '40 / 48' },
  { id: 'h3', label: 'Heading 3', icon: 'lucide-heading-3', metric: '32 / 40' },
  { id: 'h4', label: 'Heading 4', icon: 'lucide-heading-4', metric: '24 / 32' },
  { id: 'body-2', label: 'Body 2', icon: null, metric: '16 / 24' },
]
const styleQuery = ref('')
const textStyles = computed(() => {
  const q = styleQuery.value.trim().toLowerCase()
  return q
    ? TEXT_STYLES.filter((s) => s.label.toLowerCase().includes(q))
    : TEXT_STYLES
})
</script>

<template>
  <div
    v-if="layout === 'grid'"
    class="flex flex-wrap items-start justify-center gap-10"
  >
    <!-- grids -->
    <!-- grid sm: emoji picker -->
    <EmojiPicker @pick="emit('emoji', $event)" />

    <!-- grid md: reactions -->
    <ReactionsPopover
      @react="emit('react', $event)"
      @raise-hand="emit('raiseHand', $event)"
    />
  </div>

  <div v-else class="flex flex-wrap items-start justify-center gap-10">
    <!-- lists -->
    <!-- list sm: schedule email -->
    <div
      class="flex w-64 flex-col gap-2 rounded-6 bg-surface-elevation-2 px-1 pb-3 pt-2 shadow-lg"
      role="dialog"
      aria-label="Schedule email"
    >
      <div class="flex h-6 items-center gap-3 pl-2 pr-1">
        <p class="flex-1 truncate text-base-medium text-ink-gray-7">
          Schedule email
        </p>
        <Button variant="ghost" size="xs" label="Close" @click="emit('close')">
          <template #icon
            ><span class="lucide-x size-3.5 text-ink-gray-7"
          /></template>
        </Button>
      </div>

      <div class="flex flex-col gap-1" role="listbox" aria-label="Send time">
        <button
          v-for="s in SCHEDULES"
          :key="s.id"
          type="button"
          role="option"
          :aria-selected="schedule === s.id"
          class="flex h-7 items-center gap-1.5 rounded-4 px-2 text-left transition-colors"
          :class="
            schedule === s.id ? 'bg-surface-gray-3' : 'hover:bg-surface-gray-2'
          "
          @click="schedule = s.id"
        >
          <span :class="s.icon" class="size-4 shrink-0 text-ink-gray-7" />
          <span class="flex-1 truncate text-base text-ink-gray-8">{{
            s.label
          }}</span>
          <span v-if="s.time" class="shrink-0 text-base text-ink-gray-5">{{
            s.time
          }}</span>
        </button>
      </div>

      <div class="px-2">
        <Button
          variant="solid"
          size="sm"
          class="w-full"
          @click="emit('schedule', schedule ?? 'today')"
        >
          Save
        </Button>
      </div>
    </div>

    <!-- list md: text style -->
    <div
      class="flex w-64 flex-col gap-1 rounded-6 bg-surface-elevation-2 px-1 pb-1 pt-2 shadow-lg"
      role="dialog"
      aria-label="Text style"
    >
      <div class="flex flex-col gap-2.5">
        <div class="flex h-6 items-center gap-2.5 pl-2 pr-1">
          <p class="flex-1 truncate text-lg-medium text-ink-gray-7">
            Text style
          </p>
          <Button
            variant="ghost"
            size="xs"
            label="Close"
            @click="emit('close')"
          >
            <template #icon
              ><span class="lucide-x size-3.5 text-ink-gray-7"
            /></template>
          </Button>
        </div>
        <TextInput
          v-model="styleQuery"
          variant="ghost"
          size="sm"
          placeholder="Search"
        >
          <template #prefix>
            <span class="lucide-search size-4 text-ink-gray-5" />
          </template>
        </TextInput>
      </div>

      <div class="flex flex-col gap-1">
        <div
          class="flex flex-col gap-1"
          role="listbox"
          aria-label="Text styles"
        >
          <button
            v-for="s in textStyles"
            :key="s.id"
            type="button"
            role="option"
            :aria-selected="false"
            class="flex h-7 items-center gap-1.5 rounded-4 px-2 text-left transition-colors hover:bg-surface-gray-2"
            @click="emit('textStyle', s.id)"
          >
            <span
              v-if="s.icon"
              :class="s.icon"
              class="size-4 shrink-0 text-ink-gray-7"
            />
            <!-- icon/solid/body: a filled 14px tile with a P -->
            <span
              v-else
              class="flex size-4 shrink-0 items-center justify-center"
            >
              <span
                class="flex size-3.5 items-center justify-center rounded-[3px] bg-current text-ink-gray-7"
              >
                <span
                  class="text-[8px] font-semibold leading-none text-ink-base"
                  >P</span
                >
              </span>
            </span>
            <span class="flex-1 truncate text-base text-ink-gray-8">{{
              s.label
            }}</span>
            <span class="shrink-0 text-base text-ink-gray-5">{{
              s.metric
            }}</span>
          </button>
          <p
            v-if="!textStyles.length"
            class="px-2 py-1.5 text-base text-ink-gray-5"
          >
            No styles found
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          class="self-start"
          @click="emit('newStyle')"
        >
          <template #prefix><span class="lucide-plus size-4" /></template>
          New style
        </Button>
      </div>
    </div>
  </div>
</template>
