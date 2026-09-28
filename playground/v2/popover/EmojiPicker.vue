<script setup lang="ts">
// Figma: espresso-2.0 › Popover › picker › grid sm (30867:37577). A 284px
// emoji picker, 12px radius, lg shadow:
//   tabs    a 34px row (pt 4 · pb 2) of 26 × 28 icon tabs, 4px apart, px 6,
//           ruled beneath; the active one underlined in gray-900. They are
//           frappe-ui's underline tabs, so the underline slides between them
//   search  p 6, subtle sm input with a grid suffix
//   body    p 8, 224px tall, scrolling: a section per tab, 28px emoji
//           buttons 9 across and 2px apart under a 12px gray-500 label
// Tabs jump to their section and follow the scroll; search looks through
// every emoji by name. Picked emoji go to Recent (kept in this browser).
import { computed, nextTick, onMounted, ref } from 'vue'
import { TabList, Tabs, TabTrigger, TextInput } from '../../../src'
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
  recent.value = [e, ...recent.value.filter((r) => r.char !== e.char)].slice(
    0,
    18,
  )
  try {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(recent.value.map((r) => r.char)),
    )
  } catch {
    // storage unavailable: Recent lasts for this visit only
  }
}

const TABS = [
  { id: 'recent', label: 'Recent', icon: 'lucide-clock' },
  ...SECTIONS,
]

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
  return (
    body.value?.querySelector<HTMLElement>(`[data-section="${id}"]`) ?? null
  )
}

async function jumpTo(id: string) {
  active.value = id
  if (results.value) {
    query.value = ''
    await nextTick()
  }
  const el = sectionEl(id)
  if (!body.value) return
  // The scroll follows the tab, not the other way round, until the smooth
  // scroll has ended — a fixed timer let a long trip hand the tab back to
  // the section it was passing, and the underline doubled back with it.
  jumping = true
  const done = () => {
    jumping = false
    clearTimeout(fallback)
  }
  body.value.addEventListener('scrollend', done, { once: true })
  // scrollend is not everywhere yet; a timer closes the gap
  const fallback = setTimeout(done, 1200)
  body.value.scrollTo({ top: el ? el.offsetTop - 8 : 0, behavior: 'smooth' })
}

// What the tab list selects: the active section. It stays selected while
// search results are up — frappe-ui's Tabs never leave nothing selected, so
// an empty model would fall back to Recent and jump there — and picking a
// tab clears the search and goes to its section.
const tabModel = computed({
  get: () => active.value,
  set: (id) => jumpTo(String(id)),
})

// Once the body has scrolled, a short fade at its top edge lets the emoji
// slip under the search bar instead of being cut off by it.
const scrolled = ref(false)

// The active tab is the last section whose top has scrolled past.
function onScroll() {
  if (!body.value) return
  scrolled.value = body.value.scrollTop > 0
  if (jumping || results.value) return
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
  scrolled.value = (body.value?.scrollTop ?? 0) > 0
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
      <!-- the library's underline tabs; only the gap and side padding are
           the picker's own, so nine 26px tabs fit its 284px -->
      <Tabs v-model="tabModel">
        <TabList
          variant="underline"
          size="sm"
          class="h-7 !gap-1 px-1.5"
          aria-label="Emoji categories"
        >
          <TabTrigger
            v-for="t in TABS"
            :key="t.id"
            :value="t.id"
            :label="t.label"
            :icon="t.icon"
          />
        </TabList>
      </Tabs>
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
      <!-- the fade: 16px stuck to the top edge, taking no room in the flow
           (its margins cancel its height and the body's top padding). It
           sticks 8px above the content box, i.e. at the body's own edge —
           the scroller's padding is inside the sticky rectangle. -->
      <div
        class="espresso-emoji-fade pointer-events-none sticky -top-2 z-10 -mx-2 -mb-2 -mt-2 h-4 transition-opacity duration-150"
        :class="scrolled ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
      />

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
        <p v-else class="py-8 text-center text-base text-ink-gray-5">
          No emoji found
        </p>
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
.espresso-emoji-fade {
  background: linear-gradient(
    to bottom,
    var(--surface-elevation-2),
    transparent
  );
}
</style>
