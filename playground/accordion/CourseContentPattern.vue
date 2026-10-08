<script setup lang="ts">
// Course content (node 35898:51987): a course's chapters, each opening on
// its lessons. Built on frappe-ui's Accordion (experimental) with the
// file's look:
//
//   card       700 wide, white (surface-elevation-1), radius 12, the base
//              shadow, no rules between chapters
//   chapter    50 tall, 16 / 20 in, 12 apart: the file's chevron (16,
//              ink-gray-6) pointing right, turned down when open — first,
//              where the library's own (last, hidden) would be — the title
//              at 16 medium ink-gray-8, and at the right "5 lessons · 28 min"
//              at 14 ink-gray-7, the dot between a 2px ink-gray-4 disc
//   lessons    under an open chapter, 8 below it: rows 42 tall overlapping
//              by 2 (40 apart), 12 / 20 in, 12 apart — the file's lesson
//              glyph (18, ink-gray-8), the title at 14 ink-gray-8 and its
//              length at 14 ink-gray-7; 5 under the last
import { Accordion } from '../../experimental/Accordion'
import AccordionIcon from './AccordionIcon.vue'

type Chapter = {
  value: string
  title: string
  lessons: number
  minutes: number
  items: { title: string; length: string }[]
}

const intro = [
  'How to use this courses?',
  'Introduction',
  'Life coaches in design',
  'Make it pretty',
  'Summary',
].map((title) => ({ title, length: '08:49' }))

// the file's eight chapters; Introduction, open in the file, carries its
// lessons and the rest carry as many as their count says
const lessonsFor = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Lesson ${i + 1}`,
    length: '04:12',
  }))
const chapters: Chapter[] = [
  {
    value: 'introduction',
    title: 'Introduction',
    lessons: 5,
    minutes: 28,
    items: intro,
  },
  {
    value: 'what-is-design',
    title: 'What is design',
    lessons: 4,
    minutes: 12,
    items: lessonsFor(4),
  },
  {
    value: 'getting-started',
    title: 'Getting starting',
    lessons: 2,
    minutes: 10,
    items: lessonsFor(2),
  },
  {
    value: 'design-process',
    title: 'Design process',
    lessons: 3,
    minutes: 8,
    items: lessonsFor(3),
  },
  {
    value: 'create-your-process',
    title: 'Create your process',
    lessons: 4,
    minutes: 12,
    items: lessonsFor(4),
  },
  {
    value: 'critical-thinking',
    title: 'Critical thinking',
    lessons: 2,
    minutes: 3,
    items: lessonsFor(2),
  },
  {
    value: 'analyse',
    title: 'Analyse',
    lessons: 5,
    minutes: 15,
    items: lessonsFor(5),
  },
  {
    value: 'creativity',
    title: 'Creativity',
    lessons: 3,
    minutes: 10,
    items: lessonsFor(3),
  },
]
const chapterOf = (value: string) => chapters.find((c) => c.value === value)!
</script>

<template>
  <div
    class="course w-[700px] overflow-hidden rounded-6 bg-surface-elevation-1 shadow"
  >
    <Accordion
      :items="chapters"
      type="multiple"
      :default-value="['introduction']"
      heading-tag="h4"
    >
      <template #item-label="{ item }">
        <span class="flex min-w-0 items-center gap-3">
          <AccordionIcon
            name="chapter-closed"
            class="course-chevron size-4 text-ink-gray-6"
          />
          <span
            class="truncate text-lg font-medium leading-[18px] text-ink-gray-8"
            >{{ item.title }}</span
          >
        </span>
      </template>
      <template #item-suffix="{ item }">
        <span
          class="flex shrink-0 items-center gap-2 text-base font-normal leading-4 text-ink-gray-7"
        >
          <span>{{ chapterOf(item.value).lessons }} lessons</span>
          <span
            class="size-0.5 rounded-full bg-current text-ink-gray-4"
            aria-hidden="true"
          />
          <span>{{ chapterOf(item.value).minutes }} min</span>
        </span>
      </template>
      <template #item-content="{ item }">
        <ul class="flex flex-col pb-[5px] pt-2">
          <li
            v-for="lesson in chapterOf(item.value).items"
            :key="lesson.title"
            class="course-lesson flex h-[42px] items-center gap-3 px-5"
          >
            <AccordionIcon name="lesson" class="size-[18px] text-ink-gray-8" />
            <span
              class="min-w-0 flex-1 truncate text-base leading-4 text-ink-gray-8"
            >
              {{ lesson.title }}
            </span>
            <span class="shrink-0 text-base leading-4 text-ink-gray-7">
              {{ lesson.length }}
            </span>
          </li>
        </ul>
      </template>
    </Accordion>
  </div>
</template>

<style scoped>
/* no rule between chapters; the trigger is the file's 50 row, 16 / 20 in,
   12 apart, its own end chevron gone — the file's is first */
.course :deep([data-slot='root'] > [data-slot='item'] + [data-slot='item']) {
  border-top-width: 0;
}
.course :deep([data-slot='trigger']) {
  height: 50px;
  padding: 16px 20px;
  gap: 12px;
  border-radius: 0;
}
.course :deep([data-slot='trigger'] > .lucide-chevron-down) {
  display: none;
}
.course :deep([data-slot='trigger'] .course-chevron) {
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}
.course :deep([data-slot='trigger'][data-state='open'] .course-chevron) {
  transform: rotate(90deg);
}
.course :deep([data-slot='content'] > div) {
  padding: 0;
}
/* the lessons overlap by 2, as the file's 42 rows sit 40 apart */
.course-lesson + .course-lesson {
  margin-top: -2px;
}
</style>
