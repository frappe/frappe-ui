<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '../../../src'
import ActivityFeed from '../components/ActivityFeed.vue'
import ActivityRun from '../components/ActivityRun.vue'
import ActivityEntry from '../components/ActivityEntry.vue'
import EntryHeader from '../components/EntryHeader.vue'
import EventCard from '../components/EventCard.vue'
import MonthChip from '../components/MonthChip.vue'

type Invite = {
  name: string
  action: string
  time: string
  title: string
  slot: string
  badge?: string
  people: string[]
  initials?: string[]
}

// The month below the chip folds away with it.
const jun = ref(true)

const upcoming: Invite = {
  name: 'Brian Robinson',
  action: 'is invited you to an Event',
  time: 'In 2 days',
  title: 'Supply Chain Sync',
  slot: '2:30 PM - 3:00 PM',
  badge: 'Awaiting response',
  people: ['Sally Potter'],
  initials: ['N'],
}

const june: Invite[] = [
  {
    name: 'Sally Potter',
    action: 'was invited you to an event',
    time: '18 May',
    title: 'Frappe + Timeless Weekly Call',
    slot: '2:30pm-3:00 pm',
    people: ['Sammy Well', 'Emily Taylor', 'Eleanor Pena'],
    initials: ['N'],
  },
  {
    name: 'Faris Ansari',
    action: 'was invited you to an event',
    time: '18 May',
    title: 'Inventory Innovation Call',
    slot: '2:30pm-3:00 pm',
    people: ['Brian Robinson', 'Faris Ansari'],
  },
  {
    name: 'Eleanor Pena',
    action: 'was invited you to an event',
    time: '18 May',
    title: 'Order Flow Discussion',
    slot: '2:30pm-3:00 pm',
    people: ['Eleanor Pena', 'Emily Taylor', 'Sanny Woven'],
  },
]
</script>

<template>
  <ActivityFeed :gap="20">
    <!-- What hasn't happened yet is called out before the first entry. -->
    <Badge
      data-rail-cap
      class="relative self-start"
      theme="amber"
      size="lg"
      variant="subtle"
      label="Upcoming"
    />

    <ActivityRun>
      <ActivityEntry icon="lucide-calendar">
        <div class="flex flex-col gap-1.5">
          <EntryHeader
            :name="upcoming.name"
            :action="upcoming.action"
            :time="upcoming.time"
          />
          <EventCard
            :title="upcoming.title"
            :time="upcoming.slot"
            :badge="upcoming.badge"
            :people="upcoming.people"
            :initials="upcoming.initials"
          />
        </div>
      </ActivityEntry>
    </ActivityRun>

    <MonthChip v-model="jun" label="Jun" />

    <!-- The month below the chip is its own run, folded away by it. -->
    <ActivityRun :open="jun" :feed-gap="20">
      <ActivityEntry
        v-for="invite in june"
        :key="invite.title"
        icon="lucide-calendar"
      >
        <div class="flex flex-col gap-1.5">
          <EntryHeader
            :name="invite.name"
            :action="invite.action"
            :time="invite.time"
          />
          <EventCard
            :title="invite.title"
            :time="invite.slot"
            :people="invite.people"
            :initials="invite.initials"
          />
        </div>
      </ActivityEntry>
    </ActivityRun>
  </ActivityFeed>
</template>
