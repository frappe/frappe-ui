<script setup lang="ts">
// Figma: espresso-2.0 › Popover › onboarding — one 320 × 860 popover, 16px
// radius, lg shadow, a ghost xs × top-right, two views sharing a footer of
// ghost sm "Help centre" / "Keyboard shortcuts" rows:
//   steps      (30869:37720) pt 24 · px 12 · pb 12. Centred 32px app logo ·
//              16px · 14 medium title over 14/21 gray-600 progress · 32px ·
//              an amber "N% completed" badge with a ghost "Skip all", then
//              28px step rows 6px apart: 16px icon · 8px · 14 label. Done
//              steps are struck through, locked ones gray-400, and the next
//              step sits on gray-2 with a ghost "Skip" (pr 2)
//   shortcuts  (30869:37719) p 18. ‹ + 14 medium title · 16px · sections
//              ruled apart (14px gaps): a 14 medium heading, then 28px rows
//              6px apart of a 14 gray-600 action and 28px gray-2 key chips
// Clicking a step completes it (standing in for doing the task); locked
// steps open once the step they depend on is done.
import { computed, ref } from 'vue'
import { Badge, Button } from '../../../src'
import helpdeskLogo from '../assets/helpdesk-logo.png'

type View = 'steps' | 'shortcuts'

const props = withDefaults(defineProps<{ initialView?: View }>(), {
  initialView: 'steps',
})

const emit = defineEmits<{ close: []; helpCentre: [] }>()

const view = ref<View>(props.initialView)

// ---- steps
interface Step {
  id: string
  label: string
  icon: string
  /** Locked until this step is done. */
  after?: string
}

const STEPS: Step[] = [
  { id: 'password', label: 'Setup your password', icon: 'lucide-lock' },
  { id: 'lead', label: 'Create your first lead', icon: 'lucide-users' },
  { id: 'invite', label: 'Invite your team', icon: 'lucide-circle-user-round' },
  { id: 'convert', label: 'Convert lead to deal', icon: 'lucide-refresh-cw', after: 'lead' },
  { id: 'task', label: 'Create your first task', icon: 'lucide-circle-check' },
  { id: 'note', label: 'Create your first note', icon: 'lucide-file-text' },
  { id: 'comment', label: 'Add your first comment', icon: 'lucide-message-circle', after: 'note' },
  { id: 'email', label: 'Send email', icon: 'lucide-mail-open', after: 'invite' },
  { id: 'status', label: 'Change deal status', icon: 'lucide-shapes', after: 'convert' },
]

const done = ref(new Set<string>(['password']))

const isDone = (s: Step) => done.value.has(s.id)
const isLocked = (s: Step) => !!s.after && !done.value.has(s.after) && !isDone(s)
const next = computed(() => STEPS.find((s) => !isDone(s) && !isLocked(s)))

const doneCount = computed(() => done.value.size)
const percent = computed(() => Math.round((doneCount.value / STEPS.length) * 100))
const allDone = computed(() => doneCount.value === STEPS.length)

function complete(s: Step) {
  if (isLocked(s)) return
  const set = new Set(done.value)
  set.has(s.id) ? set.delete(s.id) : set.add(s.id)
  // undoing a step relocks, and clears, the steps that wait on it
  if (!set.has(s.id)) {
    for (const t of STEPS) if (t.after === s.id) set.delete(t.id)
  }
  done.value = set
}

function skipAll() {
  done.value = new Set(STEPS.map((s) => s.id))
}

// ---- shortcuts
const SHORTCUTS: { title: string; items: { label: string; keys: string[] }[] }[] = [
  {
    title: 'General',
    items: [
      { label: 'Open command palette', keys: ['⌘', 'K'] },
      { label: 'Open settings', keys: ['⌘', ','] },
      { label: 'Show keyboard shortcuts', keys: ['⌘', '/'] },
    ],
  },
  {
    title: 'Communication',
    items: [
      { label: 'Open reply box', keys: ['R'] },
      { label: 'Open comment box', keys: ['C'] },
    ],
  },
  {
    title: 'Ticket Management',
    items: [
      { label: 'Change ticket type', keys: ['T'] },
      { label: 'Change priority', keys: ['P'] },
      { label: 'Change team', keys: ['Shift', 'T'] },
      { label: 'Assign ticket', keys: ['A'] },
      { label: 'Change status', keys: ['S'] },
      { label: 'Copy ticket id', keys: ['⌘', '.'] },
      { label: 'Copy ticket URL', keys: ['⌘', 'Shift', '.'] },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { label: 'Next ticket', keys: ['Shift', '>'] },
      { label: 'Previous ticket', keys: ['Shift', '<'] },
    ],
  },
]

const keyName = (k: string) => (k === '⌘' ? 'Command' : k)
</script>

<template>
  <div
    class="relative flex h-[860px] w-80 flex-col overflow-hidden rounded-7 bg-surface-elevation-2 shadow-lg"
    role="dialog"
    :aria-label="view === 'steps' ? 'Getting started' : 'Keyboard shortcuts'"
  >
    <Button
      variant="ghost"
      size="xs"
      label="Close"
      class="absolute right-3 top-3 z-10"
      @click="emit('close')"
    >
      <template #icon><span class="lucide-x size-3.5 text-ink-gray-7" /></template>
    </Button>

    <Transition :name="view === 'shortcuts' ? 'onb-forward' : 'onb-back'">
      <!-- steps -->
      <div
        v-if="view === 'steps'"
        key="steps"
        class="absolute inset-0 flex flex-col justify-between px-3 pb-3 pt-6"
      >
        <div class="flex flex-col items-center gap-8">
          <div class="flex w-full flex-col items-center gap-4">
            <img :src="helpdeskLogo" alt="" class="size-8" />
            <div class="text-center">
              <p class="text-base-medium text-ink-gray-9">Welcome to Frappe Helpdesk</p>
              <p class="text-p-base text-ink-gray-6">
                {{ doneCount }}/{{ STEPS.length }} Steps completed
              </p>
            </div>
          </div>

          <div class="flex w-full flex-col gap-4">
            <div class="flex h-6 items-center justify-between pl-0.5">
              <Badge :theme="allDone ? 'green' : 'amber'" variant="subtle" size="md">
                {{ allDone ? 'All done' : `${percent}% completed` }}
              </Badge>
              <Button
                v-if="!allDone"
                variant="ghost"
                size="xs"
                class="!text-sm"
                @click="skipAll"
              >
                Skip all
              </Button>
            </div>

            <ul class="flex flex-col gap-1.5" aria-label="Setup steps">
              <li
                v-for="s in STEPS"
                :key="s.id"
                class="onb-step group"
                :class="{
                  'is-next': next?.id === s.id,
                  'is-done': isDone(s),
                  'is-locked': isLocked(s),
                }"
              >
                <button
                  type="button"
                  class="flex min-w-0 flex-1 items-center gap-2 text-left"
                  :disabled="isLocked(s)"
                  :aria-pressed="isDone(s)"
                  :title="isLocked(s) ? 'Finish the step before this first' : undefined"
                  @click="complete(s)"
                >
                  <span :class="s.icon" class="size-4 shrink-0" />
                  <span class="truncate">{{ s.label }}</span>
                </button>
                <Button
                  v-if="!isDone(s) && !isLocked(s)"
                  variant="ghost"
                  size="xs"
                  class="onb-skip !text-base"
                  :label="`Skip ${s.label}`"
                  @click="complete(s)"
                >
                  Skip
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <Button variant="ghost" size="sm" class="onb-footer-link" @click="emit('helpCentre')">
            <template #prefix><span class="lucide-circle-help size-4" /></template>
            Help centre
          </Button>
          <Button variant="ghost" size="sm" class="onb-footer-link" @click="view = 'shortcuts'">
            <template #prefix><span class="lucide-command size-4" /></template>
            Keyboard shortcuts
          </Button>
        </div>
      </div>

      <!-- keyboard shortcuts -->
      <div
        v-else
        key="shortcuts"
        class="absolute inset-0 flex flex-col justify-between gap-4 p-[18px]"
      >
        <div class="flex min-h-0 flex-col gap-4">
          <button
            type="button"
            class="flex h-4 items-center gap-2 self-start text-ink-gray-9"
            @click="view = 'steps'"
          >
            <span class="lucide-chevron-left size-4 text-ink-gray-7" />
            <span class="text-base-medium">Keyboard shortcuts</span>
          </button>

          <div class="-mr-2 flex min-h-0 flex-col gap-3.5 overflow-y-auto pr-2">
            <template v-for="(section, i) in SHORTCUTS" :key="section.title">
              <hr v-if="i > 0" class="border-outline-gray-1 dark:border-outline-gray-2" />
              <section class="flex flex-col gap-1.5" :aria-label="section.title">
                <p class="flex h-7 items-center text-base-medium text-ink-gray-9">
                  {{ section.title }}
                </p>
                <dl class="flex flex-col gap-1.5">
                  <div
                    v-for="item in section.items"
                    :key="item.label"
                    class="flex h-7 items-center justify-between gap-2"
                  >
                    <dt class="truncate text-base text-ink-gray-6">{{ item.label }}</dt>
                    <dd class="flex shrink-0 gap-1" :aria-label="item.keys.map(keyName).join(' + ')">
                      <kbd
                        v-for="k in item.keys"
                        :key="k"
                        class="inline-flex h-7 min-w-7 items-center justify-center rounded-4 bg-surface-gray-2 px-2 font-sans text-base text-ink-gray-7 dark:bg-surface-gray-3"
                        aria-hidden="true"
                      >
                        <span v-if="k === '⌘'" class="lucide-command size-4" />
                        <template v-else>{{ k }}</template>
                      </kbd>
                    </dd>
                  </div>
                </dl>
              </section>
            </template>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <Button variant="ghost" size="sm" class="onb-footer-link" @click="emit('helpCentre')">
            <template #prefix><span class="lucide-circle-help size-4" /></template>
            Help centre
          </Button>
          <Button variant="ghost" size="sm" class="onb-footer-link" aria-current="page">
            <template #prefix><span class="lucide-command size-4" /></template>
            Keyboard shortcuts
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* a 28px step: px 8, icon · 8px · label; Skip rides the right edge (pr 2) */
.onb-step {
  @apply flex h-7 items-center gap-2 rounded-4 pl-2 pr-0.5 text-base text-ink-gray-8 transition-colors hover:bg-surface-gray-1;
}
.onb-step > button:first-child > span:first-child {
  @apply text-ink-gray-7;
}
.onb-step.is-next {
  @apply bg-surface-gray-2 dark:bg-surface-gray-3;
}
.onb-step.is-done {
  @apply line-through;
}
.onb-step.is-locked {
  @apply text-ink-gray-4 hover:bg-transparent;
}
.onb-step.is-locked > button:first-child {
  @apply cursor-not-allowed;
}
.onb-step.is-locked > button:first-child > span:first-child {
  @apply text-ink-gray-4;
}
/* Skip shows on the next step, and on any open step while hovered */
.onb-skip {
  @apply shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100;
}
.onb-step.is-next .onb-skip {
  @apply opacity-100;
}
.onb-footer-link {
  @apply w-full !justify-start;
}

/* views slide sideways: forward into shortcuts, back to the steps */
.onb-forward-enter-active,
.onb-forward-leave-active,
.onb-back-enter-active,
.onb-back-leave-active {
  transition:
    transform 280ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 200ms ease;
}
.onb-forward-enter-from,
.onb-back-leave-to {
  transform: translateX(24px);
  opacity: 0;
}
.onb-forward-leave-to,
.onb-back-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .onb-forward-enter-from,
  .onb-forward-leave-to,
  .onb-back-enter-from,
  .onb-back-leave-to {
    transform: none;
  }
}
</style>
