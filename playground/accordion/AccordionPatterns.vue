<script setup lang="ts">
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import RecordsPattern from './RecordsPattern.vue'
import CourseContentPattern from './CourseContentPattern.vue'

// Accordion patterns, built on frappe-ui's Accordion and checked against
// Espresso. The page's sections feed the shell's "On this page" outline,
// as the Table page's do.
const patterns: Pattern[] = [
  { id: 'records', title: 'Records', component: RecordsPattern },
  {
    id: 'course-content',
    title: 'Course content',
    component: CourseContentPattern,
  },
]
</script>

<template>
  <PatternsPage
    title="Accordion patterns"
    description="How sections that open and close are put together across the Frappe apps."
    :patterns="patterns"
  />
</template>
