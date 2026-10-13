<script setup lang="ts">
// Figma: espresso-2.0 › modal (30884:48961) — "modal new", variant
// quick-edit, size 2xl (960px). A 48px header over two panes:
//   header  p 10, outline-gray-1 rule; subtle sm select (phone prefix) on
//           the left; ghost sm icon buttons 6px apart on the right, split
//           by vertical dividers: ‹ › | duplicate share details | ×
//   left    632px, p 20, 8px gaps, ruled on the right: gray lg badge, 20/600
//           title, 16/24 body filling the space, then 28px avatar · 8px ·
//           outline sm comment input
//   right   328px, p 12 / pb 20: rows 6px apart of a 112px 14px gray-700
//           label (pl 6) · 12px · a 180px ghost sm field; 13px gray-700
//           "Created on …" at the foot
import { ref, watch } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Divider,
  Rating,
  Select,
  TextInput,
} from '../../../src'
import anita from '../assets/960/avatar-anita.png'
import emily from '../assets/960/avatar-emily.png'
import me from '../assets/960/avatar-me.png'
import './modal.css'

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  previous: []
  next: []
  duplicate: []
  share: []
  details: []
  comment: [text: string]
}>()

const projects = ['Product launch', 'Q4 roadmap', 'Hiring plan'].map((p) => ({
  label: p,
  value: p,
}))

const people = [
  { label: 'Anita Kumar', value: 'Anita Kumar', image: anita },
  { label: 'Emily Charlton', value: 'Emily Charlton', image: emily },
  { label: 'Sandeep', value: 'Sandeep', image: me },
]

const imageOf = (name: string | null | undefined) =>
  people.find((p) => p.value === name)?.image

const initial = () => ({
  project: 'Product launch',
  title: 'New product marketing',
  body: 'From the very early days, we believed that software should be open source by default. Our code has been open since 2008 on first Google Code and then on GitHub. Open source gives us the ability to work with a diverse set of users and engineers to build a world class and robust ERP product',
  from: 'October 1',
  due: 'December 31',
  member: 'Anita Kumar',
  customer: 'Emily Charlton',
  rating: 3.5,
})

const note = ref(initial())
const comment = ref('')

watch(open, (isOpen) => {
  if (isOpen) {
    note.value = initial()
    comment.value = ''
  }
})

function sendComment() {
  const text = comment.value.trim()
  if (!text) return
  emit('comment', text)
  comment.value = ''
}
</script>

<template>
  <Dialog v-model:open="open" size="4xl" bare>
    <template #default="{ close }">
      <div class="espresso-modal espresso-modal--960 espresso-modal--2xl flex h-[591px] max-h-[85vh] flex-col">
        <!-- header -->
        <div
          class="flex h-12 shrink-0 items-center justify-between border-b border-outline-gray-1 p-2.5"
        >
          <Select
            v-model="note.project"
            class="w-auto"
            size="sm"
            :options="projects"
          >
            <template #prefix>
              <span class="lucide-phone size-4 text-ink-gray-7" />
            </template>
          </Select>

          <div class="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" label="Previous" @click="emit('previous')">
              <template #icon><span class="lucide-chevron-left size-4 text-ink-gray-7" /></template>
            </Button>
            <Button variant="ghost" size="sm" label="Next" @click="emit('next')">
              <template #icon><span class="lucide-chevron-right size-4 text-ink-gray-7" /></template>
            </Button>
            <Divider orientation="vertical" class="!h-5" />
            <Button variant="ghost" size="sm" label="Duplicate" @click="emit('duplicate')">
              <template #icon><span class="lucide-copy size-4 text-ink-gray-7" /></template>
            </Button>
            <Button variant="ghost" size="sm" label="Share" @click="emit('share')">
              <template #icon><span class="lucide-forward size-4 text-ink-gray-7" /></template>
            </Button>
            <Button variant="ghost" size="sm" label="Details" @click="emit('details')">
              <template #icon><span class="lucide-square-menu size-4 text-ink-gray-7" /></template>
            </Button>
            <Divider orientation="vertical" class="!h-5" />
            <Button variant="ghost" size="sm" label="Close" @click="close">
              <template #icon><span class="lucide-x size-4 text-ink-gray-7" /></template>
            </Button>
          </div>
        </div>

        <div class="flex min-h-0 flex-1">
          <!-- left pane: badge · title · body · comment -->
          <div
            class="flex w-[632px] shrink-0 flex-col gap-2 border-r border-outline-gray-1 p-5"
          >
            <Badge theme="gray" variant="subtle" size="lg" class="self-start">
              # 21
            </Badge>
            <input
              v-model="note.title"
              aria-label="Title"
              class="border-none bg-transparent p-0 text-3xl-semibold text-ink-gray-9 focus:ring-0"
            />
            <textarea
              v-model="note.body"
              aria-label="Note"
              class="min-h-0 flex-1 resize-none border-none bg-transparent p-0 text-p-lg text-ink-gray-9 focus:ring-0"
            />
            <form class="flex items-center gap-2" @submit.prevent="sendComment">
              <Avatar size="lg" shape="circle" :image="me" label="Sandeep" />
              <TextInput
                v-model="comment"
                class="flex-1"
                variant="outline"
                placeholder="Add a comment"
              />
            </form>
          </div>

          <!-- right pane: properties, then the created line -->
          <div class="flex min-w-0 flex-1 flex-col justify-between p-3 pb-5">
            <dl class="flex flex-col gap-1.5">
              <div class="quick-row">
                <dt>From</dt>
                <dd><TextInput v-model="note.from" variant="ghost" /></dd>
              </div>
              <div class="quick-row">
                <dt>Due</dt>
                <dd><TextInput v-model="note.due" variant="ghost" /></dd>
              </div>
              <div class="quick-row">
                <dt>Member</dt>
                <dd>
                  <Select v-model="note.member" variant="ghost" :options="people">
                    <template #prefix>
                      <Avatar
                        class="size-4"
                        shape="circle"
                        :image="imageOf(note.member)"
                        :label="note.member"
                      />
                    </template>
                    <!-- no chevron in the design: an empty suffix replaces it -->
                    <template #suffix><span /></template>
                  </Select>
                </dd>
              </div>
              <div class="quick-row">
                <dt>Customer</dt>
                <dd>
                  <Select v-model="note.customer" variant="ghost" :options="people">
                    <template #prefix>
                      <Avatar
                        class="size-4"
                        shape="circle"
                        :image="imageOf(note.customer)"
                        :label="note.customer"
                      />
                    </template>
                    <!-- no chevron in the design: an empty suffix replaces it -->
                    <template #suffix><span /></template>
                  </Select>
                </dd>
              </div>
              <div class="quick-row">
                <dt>Average rating</dt>
                <dd class="flex h-7 items-center pl-2">
                  <Rating v-model="note.rating" :step="0.5" size="sm" />
                </dd>
              </div>
            </dl>

            <p class="text-sm text-ink-gray-6">Created on 24 May, 2023 by Sandeep</p>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style>
/* property row: 112px label (pl 6) · 12px · 180px ghost field */
.quick-row {
  @apply flex items-center gap-3;
}
.quick-row > dt {
  @apply w-28 shrink-0 truncate pl-1.5 text-base text-ink-gray-6;
}
.quick-row > dd {
  @apply w-[180px] min-w-0;
}
</style>
