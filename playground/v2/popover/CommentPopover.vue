<script setup lang="ts">
// Figma: espresso-2.0 › Popover › comments (30873:37770). A 300px comment
// thread, 12px radius, lg shadow, pb 10, 14px gaps:
//   header  32px, pl 10 · pr 4 · py 4, ruled beneath: 14 medium gray-500
//           "Comment" and ghost xs ⋯ · ✓ (resolve) · ×
//   body    px 10, comments 14px apart: 24px avatar · 8px · 14 medium
//           gray-800 name and 13 gray-500 "• 4d ago", a ghost ⋯ on the
//           right, over 14/21 gray-600 text
//   footer  24px avatar · 8px · subtle sm "Reply" input with a ↑ send
// Replies post as "You"; ✓ resolves the thread; each ⋯ can delete.
import { computed, nextTick, ref } from 'vue'
import { Button, Dropdown, TextInput } from '../../../src'
import bray from '../assets/popover/av-bray.png'
import james from '../assets/popover/av-james.png'
import me from '../assets/popover/av-me.png'

const emit = defineEmits<{
  close: []
  resolve: [resolved: boolean]
  reply: [text: string]
}>()

interface Comment {
  id: number
  author: string
  avatar: string
  time: string
  text: string
}

let nextId = 3
const comments = ref<Comment[]>([
  { id: 1, author: 'James Fenimore', avatar: james, time: '4d ago', text: 'Okay cool, shall i finalise this design then?' },
  { id: 2, author: 'Bray Bill', avatar: bray, time: '6h ago', text: 'No major issues. Let’s get feedback from the dev team once.' },
])

const resolved = ref(false)
const reply = ref('')
const canSend = computed(() => reply.value.trim().length > 0)
const list = ref<HTMLElement | null>(null)

async function send() {
  const text = reply.value.trim()
  if (!text) return
  comments.value.push({ id: nextId++, author: 'You', avatar: me, time: 'now', text })
  reply.value = ''
  emit('reply', text)
  await nextTick()
  list.value?.scrollTo({ top: list.value.scrollHeight, behavior: 'smooth' })
}

function toggleResolved() {
  resolved.value = !resolved.value
  emit('resolve', resolved.value)
}

const threadActions = computed(() => [
  {
    label: resolved.value ? 'Reopen thread' : 'Resolve thread',
    icon: resolved.value ? 'lucide-rotate-ccw' : 'lucide-circle-check',
    onClick: toggleResolved,
  },
  {
    label: 'Copy link',
    icon: 'lucide-link',
    onClick: () => navigator.clipboard?.writeText(`${location.href}#comment-thread`),
  },
])

const commentActions = (c: Comment) => [
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red' as const,
    onClick: () => (comments.value = comments.value.filter((x) => x !== c)),
  },
]
</script>

<template>
  <div
    class="flex w-[300px] flex-col gap-3.5 rounded-6 bg-surface-elevation-2 pb-2.5 shadow-lg"
    role="dialog"
    aria-label="Comment"
  >
    <!-- header -->
    <div
      class="flex h-8 items-center gap-1 border-b border-outline-gray-1 py-1 pl-2.5 pr-1 dark:border-outline-gray-2"
    >
      <p class="flex flex-1 items-center gap-1.5 truncate text-base-medium text-ink-gray-5">
        Comment
        <span
          v-if="resolved"
          class="text-sm font-normal text-ink-green-6"
        >
          · Resolved
        </span>
      </p>
      <Dropdown :options="threadActions" align="end">
        <Button variant="ghost" size="xs" label="Thread actions">
          <template #icon><span class="lucide-ellipsis size-3.5 text-ink-gray-7" /></template>
        </Button>
      </Dropdown>
      <Button
        variant="ghost"
        size="xs"
        :label="resolved ? 'Reopen thread' : 'Resolve thread'"
        :aria-pressed="resolved"
        @click="toggleResolved"
      >
        <template #icon>
          <span
            class="size-3.5"
            :class="resolved ? 'lucide-circle-check-big text-ink-green-6' : 'lucide-circle-check text-ink-gray-7'"
          />
        </template>
      </Button>
      <Button variant="ghost" size="xs" label="Close" @click="emit('close')">
        <template #icon><span class="lucide-x size-3.5 text-ink-gray-7" /></template>
      </Button>
    </div>

    <div class="flex flex-col gap-2.5 px-2.5">
      <!-- comments -->
      <ul ref="list" class="flex max-h-[320px] flex-col gap-3.5 overflow-y-auto" aria-label="Comments">
        <li v-for="c in comments" :key="c.id" class="group flex gap-2">
          <img :src="c.avatar" alt="" class="size-6 shrink-0 rounded-full object-cover" />
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex h-6 items-center gap-2">
              <p class="flex min-w-0 flex-1 items-center gap-2">
                <span class="truncate text-base-medium text-ink-gray-8">{{ c.author }}</span>
                <span class="shrink-0 text-sm text-ink-gray-5">• {{ c.time }}</span>
              </p>
              <Dropdown :options="commentActions(c)" align="end">
                <Button variant="ghost" size="xs" :label="`Actions for ${c.author}'s comment`">
                  <template #icon><span class="lucide-ellipsis size-4 text-ink-gray-6" /></template>
                </Button>
              </Dropdown>
            </div>
            <p class="whitespace-pre-line break-words text-p-base text-ink-gray-6">{{ c.text }}</p>
          </div>
        </li>
        <li v-if="!comments.length" class="py-2 text-base text-ink-gray-5">No comments yet</li>
      </ul>

      <!-- reply -->
      <form class="flex items-center gap-2" @submit.prevent="send">
        <img :src="me" alt="" class="size-6 shrink-0 rounded-full object-cover" />
        <TextInput v-model="reply" class="flex-1" placeholder="Reply" aria-label="Reply">
          <template #suffix>
            <button
              type="submit"
              class="-mr-1 flex size-5 items-center justify-center rounded-3 transition-colors"
              :class="canSend ? 'text-ink-gray-8 hover:bg-surface-gray-3' : 'text-ink-gray-5'"
              :disabled="!canSend"
              aria-label="Send reply"
            >
              <span class="lucide-arrow-up size-4" />
            </button>
          </template>
        </TextInput>
      </form>
    </div>
  </div>
</template>
