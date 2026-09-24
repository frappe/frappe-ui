<script setup lang="ts">
// Figma: espresso-2.0 › Popover › picker › grid sm (30867:37577). A 284px
// emoji picker, 12px radius, lg shadow:
//   tabs    a 34px row (pt 4 · pb 2) of 26 × 28 icon tabs, 4px apart, px 6,
//           ruled beneath; the active one underlined in gray-900
//   search  p 6, subtle sm input with a grid suffix
//   body    p 8, 224px tall, scrolling: a section per tab, 28px emoji
//           buttons 9 across and 2px apart under a 12px gray-500 label
// Tabs jump to their section and follow the scroll; search looks through
// every emoji by name. Picked emoji go to Recent (kept in this browser).
import { computed, nextTick, onMounted, ref } from 'vue'
import { TextInput } from '../../../src'
import { SEARCHABLE, SECTIONS, type Emoji } from './emojiData'

const emit = defineEmits<{ pick: [emoji: string] }>()

// ---- recent: the last 18 picks, newest first, remembered per browser
const RECENT_KEY = 'espresso-v2-recent-emoji'
const recent = ref<Emoji[]>(loadRecent())

function loadRecent(): Emoji[] {
  try {
    const chars: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    const known = new Map(SEARCHABLE.map((e) => [e.char, e]))
    return chars.map((c) => known.get(c) ?? { char: c, name: '' })
  } catch {
    return []
  }
}

function remember(e: Emoji) {
  recent.value = [e, ...recent.value.filter((r) => r.char !== e.char)].slice(0, 18)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value.map((r) => r.char)))
  } catch {
    // storage unavailable: Recent lasts for this visit only
  }
}

const TABS = [{ id: 'recent', label: 'Recent', icon: 'lucide-clock' }, ...SECTIONS]

const sections = computed(() => [
  ...(recent.value.length
    ? [{ id: 'recent', label: 'Recent', emojis: recent.value }]
    : []),
  ...SECTIONS,
])

// ---- search
const query = ref('')
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? SEARCHABLE.filter((e) => e.name.includes(q)) : null
})

// ---- pick
const picked = ref<string>(SECTIONS[0].emojis[0].char)

function pick(e: Emoji) {
  picked.value = e.char
  remember(e)
  emit('pick', e.char)
}

// ---- tabs ↔ scroll
const body = ref<HTMLElement | null>(null)
const active = ref('smileys')
let jumping = false

function sectionEl(id: string) {
  return body.value?.querySelector<HTMLElement>(`[data-section="${id}"]`) ?? null
}

async function jumpTo(id: string) {
  active.value = id
  if (results.value) {
    query.value = ''
    await nextTick()
  }
  const el = sectionEl(id)
  if (!body.value) return
  jumping = true
  body.value.scrollTo({ top: el ? el.offsetTop - 8 : 0, behavior: 'smooth' })
  setTimeout(() => (jumping = false), 400)
}

// The active tab is the last section whose top has scrolled past.
function onScroll() {
  if (jumping || !body.value || results.value) return
  const top = body.value.scrollTop + 16
  let current = sections.value[0]?.id ?? 'smileys'
  for (const s of sections.value) {
    const el = sectionEl(s.id)
    if (el && el.offsetTop <= top) current = s.id
  }
  active.value = current
}

// Open on Smileys, as in the design, even with a Recent section above it.
onMounted(async () => {
  await nextTick()
  const el = sectionEl('smileys')
  if (body.value && el) body.value.scrollTop = el.offsetTop - 8
  active.value = 'smileys'
})
</script>

<template>
  <div
    class="flex w-[284px] flex-col rounded-6 bg-surface-elevation-2 shadow-lg"
    role="dialog"
    aria-label="Emoji picker"
  >
    <div class="pb-0.5 pt-1">
      <div
        class="flex h-7 items-center gap-1 border-b border-outline-gray-1 px-1.5 dark:border-outline-gray-2"
        role="tablist"
        aria-label="Emoji categories"
      >
        <button
          v-for="t in TABS"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="!results && active === t.id"
          :aria-label="t.label"
          :title="t.label"
          class="-mb-px flex h-7 w-[26px] items-center justify-center border-b transition-colors"
          :class="
            !results && active === t.id
              ? 'border-current text-ink-gray-9'
              : 'border-transparent text-ink-gray-6 hover:text-ink-gray-8'
          "
          @click="jumpTo(t.id)"
        >
          <span :class="t.icon" class="size-4" />
        </button>
      </div>
    </div>

    <div class="p-1.5">
      <TextInput v-model="query" size="sm" placeholder="Search by keyword">
        <template #suffix>
          <span class="lucide-layout-grid size-4 text-ink-gray-5" />
        </template>
      </TextInput>
    </div>

    <div
      ref="body"
      class="espresso-emoji-body relative h-[224px] overflow-y-auto p-2"
      @scroll.passive="onScroll"
    >
      <!-- search results -->
      <template v-if="results">
        <div v-if="results.length" class="espresso-emoji-grid">
          <button
            v-for="e in results"
            :key="e.char"
            type="button"
            class="espresso-emoji"
            :class="{ 'is-picked': picked === e.char }"
            :aria-label="e.name"
            :title="e.name"
            @click="pick(e)"
          >
            {{ e.char }}
          </button>
        </div>
        <p v-else class="py-8 text-center text-base text-ink-gray-5">No emoji found</p>
      </template>

      <!-- sections -->
      <template v-else>
        <section
          v-for="(s, i) in sections"
          :key="s.id"
          :data-section="s.id"
          :aria-label="s.label"
          :class="{ 'pt-2': i > 0 }"
        >
          <p class="px-1 pb-1.5 text-xs text-ink-gray-5">{{ s.label }}</p>
          <div class="espresso-emoji-grid">
            <button
              v-for="(e, j) in s.emojis"
              :key="`${s.id}-${j}`"
              type="button"
              class="espresso-emoji"
              :class="{ 'is-picked': picked === e.char }"
              :aria-label="e.name || e.char"
              :title="e.name || undefined"
              @click="pick(e)"
            >
              {{ e.char }}
            </button>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style>
/* 9 across, 2px apart; columns flex so a scrollbar never wraps the row. */
.espresso-emoji-grid {
  @apply grid grid-cols-9 gap-0.5;
}
.espresso-emoji {
  @apply flex h-7 w-full items-center justify-center rounded-4 text-lg leading-none transition-colors hover:bg-surface-gray-2;
}
.espresso-emoji.is-picked {
  @apply bg-surface-gray-3;
}
.espresso-emoji-body {
  scrollbar-width: thin;
}
</style>
