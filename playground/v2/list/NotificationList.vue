<script setup lang="ts">
// Figma: espresso-2.0 › List › Notification (34945:113760). A 700px column
// of notification "cells", ruled between:
//   row      p 14, 32px avatar · 8px · body; the avatar centres on a
//            one-block row and sits at the top when there's an attachment
//   message  14/21 — actor and object in 14 medium gray-900, the action in
//            gray-700 — with the 14 gray-700 time on the right
//   extras   8px under the message: a surface-gray-2 comment bubble (12px
//            radius, px 12 · py 7.5) or a raised course card (12px radius,
//            p 6, 96 × 60 thumbnail)
import { ref } from 'vue'
import { Avatar, Badge } from '../../../src'
import adam from '../assets/list/notif-avatar-adam.png'
import james from '../assets/list/notif-avatar-james.png'
import lokesh from '../assets/list/notif-avatar-lokesh.png'
import maya from '../assets/list/notif-avatar-maya.png'
import sophia from '../assets/list/notif-avatar-sophia.png'
import courseThumb from '../assets/list/notif-course-thumb.png'
import instructorA from '../assets/list/notif-instructor-1.png'
import instructorB from '../assets/list/notif-instructor-2.png'

/** A run of the message: `strong` runs are the actor / object. */
type Run = { text: string; strong?: boolean }

interface Notification {
  id: number
  actor: string
  avatar?: string
  message: Run[]
  time: string
  comment?: { mention: string; text: string }
  course?: {
    title: string
    meta: string
    instructors: number
    isNew?: boolean
  }
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    actor: 'Adam',
    avatar: adam,
    message: [
      { text: 'Adam', strong: true },
      { text: ' commented on your submission for project 2 in course ' },
      { text: 'Mobile App Development', strong: true },
    ],
    time: '2h ago',
    comment: { mention: '@faris,', text: 'great, thanks!' },
  },
  {
    id: 2,
    actor: 'James Cooper',
    avatar: james,
    message: [
      { text: 'James Cooper', strong: true },
      { text: ' mentioned you in a discussion ' },
      { text: 'ERPNext Associate Certification January 2026', strong: true },
    ],
    time: '3h ago',
    course: {
      title: 'Production planning and Execution',
      meta: '8 chapters · 18 lessons',
      instructors: 7,
      isNew: true,
    },
  },
  {
    id: 3,
    actor: 'Maya',
    avatar: maya,
    message: [
      { text: 'Maya', strong: true },
      { text: ' commented on your submission for project 2 in course ' },
      { text: 'Mobile App Development', strong: true },
    ],
    time: '7h ago',
    comment: {
      mention: '@faris,',
      text: 'I didn’t understand the second question, could you clarify?',
    },
  },
  {
    id: 4,
    actor: 'Gowthamraj',
    message: [
      { text: 'Gowthamraj', strong: true },
      { text: ' created new batch ' },
      { text: 'Frappe Framework Certification', strong: true },
    ],
    time: '2d ago',
  },
  {
    id: 5,
    actor: 'Lokesh',
    avatar: lokesh,
    message: [
      { text: 'Lokesh', strong: true },
      { text: ' posted results for Quiz 1 ' },
      { text: '“Basic of usability”', strong: true },
      { text: ' on your course ' },
      { text: 'Full-stack App Development with Frappe Framework', strong: true },
    ],
    time: '3d ago',
  },
  {
    id: 6,
    actor: 'Carlos',
    message: [
      { text: 'Carlos', strong: true },
      { text: ' shared new resources ' },
      { text: 'for Python Programming in the course Advanced Data Science', strong: true },
    ],
    time: '3d ago',
  },
  {
    id: 7,
    actor: 'Sophia',
    avatar: sophia,
    message: [
      { text: 'Sophia', strong: true },
      { text: ' introduced a new chapter assignment for the course ' },
      { text: 'Web Development Basics', strong: true },
    ],
    time: '4d ago',
  },
])

const instructors = [
  { label: 'Priya', image: instructorA },
  { label: 'Mei', image: instructorB },
  { label: 'Nikhil' },
]

const emit = defineEmits<{ open: [notification: Notification] }>()
</script>

<template>
  <ul class="w-[700px] max-w-full" aria-label="Notifications">
    <li
      v-for="n in notifications"
      :key="n.id"
      class="flex cursor-pointer gap-2 border-b border-outline-gray-1 p-3.5 transition-colors last:border-b-0 hover:bg-surface-gray-1 dark:border-outline-gray-2 dark:hover:bg-surface-gray-2"
      :class="n.comment || n.course ? 'items-start' : 'items-center'"
      @click="emit('open', n)"
    >
      <Avatar size="xl" shape="circle" :image="n.avatar" :label="n.actor" />

      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <!-- message · time -->
        <div class="flex items-start gap-1">
          <p class="min-w-0 flex-1 text-p-base text-ink-gray-6">
            <template v-for="(run, i) in n.message" :key="i">
              <span v-if="run.strong" class="font-medium text-ink-gray-9">{{ run.text }}</span>
              <template v-else>{{ run.text }}</template>
            </template>
          </p>
          <span class="shrink-0 pt-0.5 text-base text-ink-gray-6">{{ n.time }}</span>
        </div>

        <!-- comment bubble -->
        <p
          v-if="n.comment"
          class="rounded-6 bg-surface-gray-2 px-3 py-[7.5px] text-p-base text-ink-gray-7"
        >
          <span class="font-medium text-ink-gray-9">{{ n.comment.mention }}</span>
          {{ n.comment.text }}
        </p>

        <!-- course card: raised, p 6, 96 × 60 thumbnail -->
        <div
          v-if="n.course"
          class="flex gap-2 rounded-6 bg-surface-elevation-2 p-1.5 shadow-sm"
        >
          <img
            :src="courseThumb"
            alt=""
            class="h-[60px] w-24 shrink-0 rounded-[7px] object-cover"
          />
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="flex items-start justify-between gap-1">
              <div class="flex min-w-0 flex-col items-start gap-1">
                <Badge v-if="n.course.isNew" theme="violet" variant="subtle" size="sm">
                  New
                </Badge>
                <p class="truncate text-base-medium text-ink-gray-8">
                  {{ n.course.title }}
                </p>
              </div>
              <!-- 11px hint · 8px · 16px avatars, 2px ring, overlapping 2px -->
              <div class="flex shrink-0 items-center gap-2">
                <span class="text-2xs text-ink-gray-7">
                  {{ n.course.instructors }} instructors
                </span>
                <div class="flex -space-x-0.5">
                  <Avatar
                    v-for="a in instructors"
                    :key="a.label"
                    size="xs"
                    shape="circle"
                    class="shadow-[0_0_0_2px_var(--surface-elevation-2)] [&>div]:text-2xs-medium [&>div]:text-ink-gray-7"
                    :image="a.image"
                    :label="a.label"
                  />
                </div>
              </div>
            </div>
            <p class="truncate text-base text-ink-gray-6">{{ n.course.meta }}</p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
