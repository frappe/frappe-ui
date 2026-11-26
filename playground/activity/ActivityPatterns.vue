<script setup lang="ts">
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import DefaultPattern from './patterns/DefaultPattern.vue'
import CallLogPattern from './patterns/CallLogPattern.vue'
import EventsPattern from './patterns/EventsPattern.vue'

// Activity patterns, built with frappe-ui and checked against Espresso
// (node 35076-52595). One file per pattern in `patterns/`, one entry here.
const patterns: Pattern[] = [
  { id: 'default', title: 'Default', component: DefaultPattern },
  { id: 'call-log', title: 'Call log', component: CallLogPattern },
  { id: 'events', title: 'Events', component: EventsPattern },
]
</script>

<template>
  <!-- An activity feed is 788px wide, whatever it sits in. -->
  <PatternsPage
    title="Activity patterns"
    description="How an activity feed is put together across the Frappe apps."
    width="788px"
    :patterns="patterns"
  />
</template>
