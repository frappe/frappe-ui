<script setup lang="ts">
import ActivityFeed from '../components/ActivityFeed.vue'
import ActivityRun from '../components/ActivityRun.vue'
import ActivityEntry from '../components/ActivityEntry.vue'
import EntryHeader from '../components/EntryHeader.vue'
import CallCard from '../components/CallCard.vue'
import type { CallAction, CallFact } from '../components/CallCard.vue'

type Call = {
  name: string
  action: string
  time: string
  icon: string
  iconClass?: string
  title: string
  status?: string
  facts?: CallFact[]
  actions?: CallAction[]
  people: string[]
  initials?: string[]
}

// An inbound call that never connected is marked in red on the rail; an
// outbound one is a plain grey glyph.
const calls: Call[] = [
  {
    name: 'Brian Robinson',
    action: 'has reached out to you',
    time: '18 May',
    icon: 'lucide-phone-missed',
    iconClass: 'text-ink-red-5',
    title: 'Inbound Call',
    status: 'Missed call',
    people: ['Emily Taylor', 'Brian Robinson'],
  },
  {
    name: 'Sammy Well',
    action: 'created an call',
    time: '18 May',
    icon: 'lucide-phone-outgoing',
    title: 'Outbound Call',
    facts: [
      { icon: 'lucide-calendar', label: 'Jun 27, Friday' },
      { icon: 'lucide-clock', label: '32:48' },
    ],
    actions: [
      { icon: 'lucide-play', label: 'Listen' },
      { icon: 'lucide-file-text', label: 'Notes' },
    ],
    people: ['Sammy Well', 'Emily Taylor'],
  },
  {
    name: 'Emily Taylor',
    action: 'has reached out to you.',
    time: '18 May',
    icon: 'lucide-phone-incoming',
    iconClass: 'text-ink-red-5',
    title: 'Inbound Call',
    status: 'Rejected',
    people: ['Sammy Well', 'Brian Robinson'],
  },
  {
    name: 'Eleanor Pena',
    action: 'created a call',
    time: '18 May',
    icon: 'lucide-phone-outgoing',
    title: 'Outbound Call',
    facts: [
      { icon: 'lucide-calendar', label: 'May 18, Wednesday' },
      { icon: 'lucide-clock', label: '32:48' },
    ],
    actions: [{ icon: 'lucide-play', label: 'Listen' }],
    people: ['Eleanor Pena'],
    initials: ['N'],
  },
]
</script>

<template>
  <ActivityFeed>
    <ActivityRun>
      <ActivityEntry
        v-for="call in calls"
        :key="call.name + call.title + call.time"
        :icon="call.icon"
        :icon-class="call.iconClass"
      >
        <div class="flex flex-col gap-1.5">
          <EntryHeader
            :name="call.name"
            :action="call.action"
            :time="call.time"
          />
          <CallCard
            :title="call.title"
            :status="call.status"
            :facts="call.facts"
            :actions="call.actions"
            :people="call.people"
            :initials="call.initials"
          />
        </div>
      </ActivityEntry>
    </ActivityRun>
  </ActivityFeed>
</template>
