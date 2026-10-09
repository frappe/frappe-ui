<script setup lang="ts">
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import LeadsPattern from './patterns/LeadsPattern.vue'
import TicketsPattern from './patterns/TicketsPattern.vue'
import GroupsPattern from './patterns/GroupsPattern.vue'
import TasksPattern from './patterns/TasksPattern.vue'
import DataGridPattern from './patterns/DataGridPattern.vue'
import StreaksPattern from './patterns/StreaksPattern.vue'
import PlansPattern from './patterns/PlansPattern.vue'
import FilesPattern from './patterns/FilesPattern.vue'
import CheckboxesPattern from './patterns/CheckboxesPattern.vue'
import MembersPattern from './patterns/MembersPattern.vue'

// Table patterns, built with frappe-ui and checked against Espresso. Each one
// gets its own file in `patterns/` and an entry here.
//
// Articles is parked in `patterns/stashed/` — it's a list rather than a table,
// so it comes back only if it belongs here. Its own file says what it needs.
const patterns: Pattern[] = [
  { id: 'leads', title: 'Leads', component: LeadsPattern },
  { id: 'tickets', title: 'Tickets', component: TicketsPattern },
  { id: 'groups', title: 'Groups', component: GroupsPattern },
  { id: 'tasks', title: 'Tasks', component: TasksPattern },
  { id: 'data-grid', title: 'Data grid', component: DataGridPattern },
  { id: 'streaks', title: 'Streaks', component: StreaksPattern },
  { id: 'plans', title: 'Plans', component: PlansPattern },
  { id: 'files', title: 'Files', component: FilesPattern },
  { id: 'checkboxes', title: 'Checkboxes', component: CheckboxesPattern },
  { id: 'members', title: 'Members', component: MembersPattern },
]
</script>

<template>
  <!--
    1180px is the viewable width of a table; a table whose columns run wider
    scrolls sideways inside that, rather than widening the page.
  -->
  <PatternsPage
    title="Table patterns"
    description="How tables are put together across the Frappe apps."
    width="1180px"
    :patterns="patterns"
  />
</template>
