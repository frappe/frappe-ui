<script setup lang="ts">
import { ref } from 'vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import ActivityRun from '../components/ActivityRun.vue'
import ActivityEntry from '../components/ActivityEntry.vue'
import EntryHeader from '../components/EntryHeader.vue'
import EmailCard from '../components/EmailCard.vue'
import type { Attachment } from '../components/EmailCard.vue'
import CommentBubble from '../components/CommentBubble.vue'
import CallCard from '../components/CallCard.vue'
import ChangeGroup from '../components/ChangeGroup.vue'
import ChangeRow from '../components/ChangeRow.vue'
import MonthChip from '../components/MonthChip.vue'

// Each month folds away behind its own chip.
const june = ref(true)
const may = ref(true)

// The attachments on the first message, each with its mark from the design.
const attachments: Attachment[] = [
  { name: 'Satoshi.zip', meta: 'Zip · 5.4 MB', type: 'zip' },
  { name: 'Bose.PDF', meta: 'PDF · 44MB', type: 'pdf' },
  { name: 'Supply_Update.doc', meta: 'Doc · 9.8 MB', type: 'doc' },
]

const openingMail = `Hi Good morning,
We hope this message finds you well.

We are writing to inform you about recent updates to our inventory package that may affect your current and future orders. We've expanded our inventory with new items including Bose. These additions are now available for ordering and can be viewed on our Bose

Thanks & Regards
Templeton Peck`

const turnoverMail = `I think it could be. We should also consider our inventory turnover ratio. If we're holding onto items for too long, it ties up our capital. We need a balance between having enough stock and not overstocking.

Thanks & Regards
Shariq Ansari`

const jitMail = `Absolutely. I also think we should integrate a Just-In-Time (JIT) approach. It's risky but can save a lot of storage costs if done correctly.`

// What "5+ activities from last week" opens out.
const lastWeek = [
  {
    time: '12 Jun',
    parts: [
      { text: 'Significa Well', strong: true },
      { text: ' updated deal status value from ' },
      { text: 'Prospecting', strong: true },
      { text: ' to ' },
      { text: 'Qualified', strong: true },
    ],
  },
  {
    time: '19 Jun',
    parts: [
      { text: 'Gleb Kuznetsov', strong: true },
      { text: ' created a ' },
      { text: 'task', strong: true },
    ],
  },
  {
    time: '19 Jun',
    parts: [
      { text: 'Zhenya Rynzhuk', strong: true },
      { text: ' added a ' },
      { text: 'note', strong: true },
    ],
  },
  {
    time: '20 Jun',
    parts: [
      { text: 'Shariq Ansari', strong: true },
      { text: ' updated status from ' },
      { text: 'Contacted', strong: true },
      { text: ' to ' },
      { text: 'Qualified', strong: true },
    ],
  },
  {
    time: '20 Jun',
    parts: [
      { text: 'Timeless', strong: true },
      { text: ' updated stage from ' },
      { text: 'hot', strong: true },
      { text: ' to ' },
      { text: 'cold', strong: true },
    ],
  },
]
// What "2+ changes from Timeless" opens out.
const timelessChanges = [
  {
    time: '20 Jun',
    parts: [
      { text: 'Timeless', strong: true },
      { text: ' updated ' },
      { text: 'Territory', strong: true },
      { text: ' to ' },
      { text: 'India', strong: true },
    ],
  },
  {
    time: '20 Jun',
    parts: [
      { text: 'Timeless', strong: true },
      { text: ' added ' },
      { text: 'Lead source', strong: true },
      { text: ' as ' },
      { text: 'Referral', strong: true },
    ],
  },
]
</script>

<template>
  <!--
    Everything a deal has been through, newest section last: months fold away
    behind their own chip, and each kind of activity — a message, a comment, a
    call, a field change — gets its own mark on the rail.
  -->
  <ActivityFeed :gap="16">
    <MonthChip v-model="june" label="June" />

    <!-- Entries sit 20 apart inside a month, sections 16 apart. -->
    <ActivityRun :open="june">
      <ActivityEntry person="Templeton Peck" :offset="10">
        <EmailCard
          name="Templeton Peck"
          address="templeton@frappe.io"
          to="Jonathan Higgins, sandeep@timeless.co, +4"
          subject="Package update"
          time="3d ago"
          :body="openingMail"
          :attachments="attachments"
        />
      </ActivityEntry>

      <!-- A message with nothing but a first line shows only that line. -->
      <ActivityEntry person="Eric Gallagher" :offset="10">
        <EmailCard
          preview
          name="Eric Gallagher"
          address="ericgallagher@frappe.io"
          time="18 Jun"
          body="Hi, I placed an order last week. I spoke with Marisa at the time. When will it be delivered?"
        />
      </ActivityEntry>

      <ActivityEntry icon="lucide-message-circle">
        <div class="flex flex-col gap-1">
          <EntryHeader
            name="Sanny Woven"
            action="added a comment"
            time="27 Jun"
            meta-icon="lucide-eye-off"
          />
          <CommentBubble
            mention="@Sandra Bass"
            text=", Great teamwork, everyone. Let’s catch up with our findings."
          />
        </div>
      </ActivityEntry>

      <ActivityEntry dot>
        <ChangeGroup label="5+ activities from last week">
          <ChangeRow
            v-for="(change, index) in lastWeek"
            :key="index"
            :parts="change.parts"
            :time="change.time"
          />
        </ChangeGroup>
      </ActivityEntry>

      <ActivityEntry icon="lucide-message-circle">
        <div class="flex flex-col gap-1">
          <EntryHeader
            name="James Bennett"
            action="added a comment"
            time="20 Jun"
            meta-icon="lucide-eye-off"
          />
          <CommentBubble
            mention="@Eleanor Pena"
            text=", Yeah, I’ve noticed that too. I think we need better forecasting. We often end up with either too much stock or not enough. Maybe we should look into some advanced forecasting software?"
          />
        </div>
      </ActivityEntry>

      <ActivityEntry person="Shariq Ansari" :offset="10">
        <EmailCard
          reply
          name="Shariq Ansari"
          address="shariq@frappe.io"
          to="Jonathan Higgins, sandeep@timeless.co, +4"
          subject="Package update"
          time="18 Jun"
          :body="turnoverMail"
        />
      </ActivityEntry>

      <ActivityEntry dot>
        <ChangeRow
          time=""
          :parts="[
            { text: 'Shariq Ansari', strong: true },
            { text: ' added ' },
            { text: 'Annual Revenue', strong: true },
            { text: ' as ' },
            { text: '45,00,000.00', strong: true },
          ]"
        />
      </ActivityEntry>

      <ActivityEntry person="Sally Potter" :offset="10">
        <EmailCard
          name="Sally Potter"
          address="shariq@frappe.io"
          to="Shariq Ansari"
          subject="Package update"
          time="19 Jun"
          :body="jitMail"
          thread
        />
      </ActivityEntry>

      <ActivityEntry dot>
        <ChangeGroup label="2+ changes from Timeless">
          <ChangeRow
            v-for="(change, index) in timelessChanges"
            :key="index"
            :parts="change.parts"
            :time="change.time"
          />
        </ChangeGroup>
      </ActivityEntry>
    </ActivityRun>

    <MonthChip v-model="may" label="May" />

    <!-- May's entries sit 16 apart, the same as the sections themselves. -->
    <ActivityRun :open="may">
      <ActivityEntry icon="lucide-phone-missed" icon-class="text-ink-red-5">
        <div class="flex flex-col gap-1.5">
          <EntryHeader
            name="Brian Robinson"
            action="has reached out to you."
            time="14 May"
          />
          <CallCard
            title="Inbound Call"
            status="Missed call"
            :people="['Emily Taylor', 'Brian Robinson']"
          />
        </div>
      </ActivityEntry>

      <ActivityEntry icon="lucide-phone-outgoing">
        <div class="flex flex-col gap-1.5">
          <EntryHeader
            name="Sammy Well"
            action="created an call"
            time="16 May"
          />
          <CallCard
            title="Outbound Call"
            :facts="[
              { icon: 'lucide-calendar', label: 'May 16, Friday' },
              { icon: 'lucide-clock', label: '32:48' },
            ]"
            :actions="[
              { icon: 'lucide-play', label: 'Listen' },
              { icon: 'lucide-file-text', label: 'Note' },
            ]"
            :people="['Sammy Well', 'Eleanor Pena']"
          />
        </div>
      </ActivityEntry>

      <ActivityEntry icon="lucide-phone-outgoing">
        <div class="flex flex-col gap-1.5">
          <EntryHeader
            name="Sammy Well"
            action="created an call"
            time="16 May"
          />
          <CallCard
            player
            title="Outbound call"
            :facts="[
              { icon: 'lucide-calendar', label: 'May 18, Wednesday' },
              { icon: 'lucide-clock', label: '32:48' },
            ]"
            :actions="[{ icon: 'lucide-play', label: 'Listen' }]"
            :people="['Emily Taylor', 'Sammy Well', 'Eleanor Pena']"
            :initials="['N']"
          />
        </div>
      </ActivityEntry>

      <!-- The last message carries the thread it answers, opened out. -->
      <ActivityEntry person="Sally Potter" :offset="10">
        <EmailCard
          name="Sally Potter"
          address="shariq@frappe.io"
          to="Shariq Ansari"
          subject="Package update"
          time="19 Jun"
          :body="jitMail"
          thread
          quoted-from="On June 26, 2024 at 3:56 PM GMT+5:30 shariq@frappe.io wrote:"
          :quoted="turnoverMail"
        />
      </ActivityEntry>
    </ActivityRun>
  </ActivityFeed>
</template>
