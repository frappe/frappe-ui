<script setup lang="ts">
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import BrandingPattern from './patterns/BrandingPattern.vue'
import TablePattern from './patterns/TablePattern.vue'
import TableSwitchControlsPattern from './patterns/TableSwitchControlsPattern.vue'
import TableBadgesPattern from './patterns/TableBadgesPattern.vue'
import TableDataGridPattern from './patterns/TableDataGridPattern.vue'
import InvitePeoplePattern from './patterns/InvitePeoplePattern.vue'
import FormsPattern from './patterns/FormsPattern.vue'
import MyProfilePattern from './patterns/MyProfilePattern.vue'
import ListControlsPattern from './patterns/ListControlsPattern.vue'
import ListDefaultPattern from './patterns/ListDefaultPattern.vue'
import AccountsPattern from './patterns/AccountsPattern.vue'

// The building blocks of the settings modal's body. One file per pattern in
// `patterns/`, one entry here; V1's six full screens are parked at `/v1`.
const patterns: Pattern[] = [
  { id: 'branding', title: 'Branding', component: BrandingPattern },
  { id: 'table', title: 'Table', component: TablePattern },
  {
    id: 'table-switch-controls',
    title: 'Table - with switch controls',
    component: TableSwitchControlsPattern,
  },
  {
    id: 'table-badges',
    title: 'Table - with badges',
    component: TableBadgesPattern,
  },
  {
    id: 'table-data-grid',
    title: 'Table - data grid',
    component: TableDataGridPattern,
  },
  { id: 'forms', title: 'Forms', component: FormsPattern },
  { id: 'my-profile', title: 'My Profile', component: MyProfilePattern },
  {
    id: 'list-controls',
    title: 'List (Radio, Checkbox and Switch)',
    component: ListControlsPattern,
  },
  { id: 'list', title: 'List', component: ListDefaultPattern },
  { id: 'accounts', title: 'Accounts', component: AccountsPattern },
  // Last on purpose: least common, and the one with open questions.
  {
    id: 'invite-people',
    title: 'Invite people',
    component: InvitePeoplePattern,
  },
]
</script>

<template>
  <!-- The modal's body is 700px, so every pattern is drawn at that width. -->
  <PatternsPage
    title="Settings modal patterns"
    description="The building blocks of the settings modal's body, each at its 700px width."
    width="700px"
    :patterns="patterns"
  />
</template>
