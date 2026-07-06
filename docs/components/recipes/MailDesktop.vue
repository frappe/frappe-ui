<script setup>
import { computed, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  DesktopShell,
  Dropdown,
  PageHeaderBase,
  PageHeaderTitle,
  ScrollArea,
  Sidebar,
  SidebarCollapseToggle,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  TabButtons,
} from 'frappe-ui'
import { List, ListCell, ListRow, ListRows } from 'frappe-ui/list'

// Mailboxes and labels — the sidebar navigation. Counts render as a quiet
// suffix.
const mailboxes = [
  { label: 'Inbox', icon: 'lucide-inbox', count: 6 },
  { label: 'Starred', icon: 'lucide-star' },
  { label: 'Sent', icon: 'lucide-send' },
  { label: 'Drafts', icon: 'lucide-file-pen-line', count: 1 },
  { label: 'Trash', icon: 'lucide-trash-2' },
]
const labels = ['Work', 'Personal']
const activeMailbox = ref('Inbox')

// Gmail-style category tabs above the list. `activeTab` filters the rows.
const mailTabs = ['Primary', 'Transactions', 'Updates', 'Promotions']
const activeTab = ref('Primary')

const evan = 'https://avatars.githubusercontent.com/u/499550?v=4'

// Each thread is one row in the list pane and one conversation in the reading
// pane; `category` routes it to a tab.
const threads = [
  {
    id: 1,
    category: 'Primary',
    subject: 'Trouble connecting Slack integration',
    time: '6h',
    unread: false,
    preview:
      'Our team is trying to connect Slack with Northwind, but the authorization process fails with an OAuth error.',
    messages: [
      {
        author: {
          name: 'Sarah Tran',
          email: 'sarah.tran@example.com',
          image: 'https://i.pravatar.cc/150?img=1',
        },
        date: 'Aug 29, 8:03 AM',
        body: [
          'Hi Northwind Support,',
          'Our team is trying to connect Slack with Northwind, but the authorization process fails with the following error message: “OAuth token invalid.”',
          'We’ve tried reconnecting a couple of times and even restarted the workspace, but no luck. Could you help us get this integration working?',
          'Thanks,\nSarah Tran\nOps Manager, BrightWave Marketing',
        ],
      },
      {
        author: {
          name: 'Peter Lann',
          email: 'peter.lann@northwind.com',
          image: evan,
        },
        date: 'Aug 29, 12:56 PM',
        body: [
          'Hi Sarah,',
          'Thanks for reaching out — happy to help! That error usually happens when Slack doesn’t grant Northwind the right permissions during the connection step. Here are a few things to try:',
          '1. Make sure you’re logged into the correct Slack workspace before starting the connection.\n2. Remove Northwind from your Slack app directory, then reconnect from Settings → Integrations.\n3. Confirm an admin is approving the OAuth request — restricted workspaces block it otherwise.',
          'Let me know how it goes and I’ll dig deeper if needed.',
          'Regards,\nPeter Lann',
        ],
      },
    ],
  },
  {
    id: 2,
    category: 'Primary',
    subject: 'Missing files in shared workspace',
    time: '6h',
    unread: true,
    preview:
      'Yesterday I uploaded a set of project files to our shared workspace. Today, two of the files are nowhere to be found.',
    messages: [
      {
        author: {
          name: 'Marcus Feng',
          email: 'marcus@northloop.io',
          image: 'https://i.pravatar.cc/150?img=12',
        },
        date: 'Aug 29, 7:40 AM',
        body: [
          'Hi team,',
          'Yesterday I uploaded a set of project files to our shared workspace. Today, two of the files are nowhere to be found and the folder shows the wrong item count.',
          'Could you check whether they were moved or deleted? These are time-sensitive.',
        ],
      },
    ],
  },
  {
    id: 3,
    category: 'Primary',
    subject: 'Can’t reset my password',
    time: '12h',
    unread: true,
    preview:
      'I tried to reset my Northwind password using the “Forgot Password” link, but the reset email never arrives.',
    messages: [
      {
        author: {
          name: 'Leo Nakamura',
          email: 'leo.n@fieldworks.dev',
          image: 'https://i.pravatar.cc/150?img=33',
        },
        date: 'Aug 28, 9:30 PM',
        body: [
          'Hi,',
          'I tried to reset my Northwind password using the “Forgot Password” link, but the reset email never arrives. I’ve checked spam too.',
          'Can you help me regain access?',
        ],
      },
    ],
  },
  {
    id: 4,
    category: 'Primary',
    subject: 'Dashboard analytics not updating',
    time: '1d',
    unread: false,
    preview:
      'The analytics dashboard stopped updating yesterday around 3 PM. All charts are stuck at the same values.',
    messages: [
      {
        author: {
          name: 'Priya Nair',
          email: 'priya@acme.com',
          image: 'https://i.pravatar.cc/150?img=47',
        },
        date: 'Aug 28, 3:14 PM',
        body: [
          'Hi team,',
          'The analytics dashboard stopped updating yesterday around 3 PM. All charts are stuck at the same values even after a hard refresh.',
          'Is there a known issue?',
        ],
      },
    ],
  },
  {
    id: 5,
    category: 'Primary',
    subject: 'Question about adding team seats',
    time: '1d',
    unread: false,
    preview:
      'We’re growing fast and need to add five more seats. Can we do that mid-cycle, and how is it prorated?',
    messages: [
      {
        author: {
          name: 'Nadia Osei',
          email: 'nadia@brightwave.co',
          image: 'https://i.pravatar.cc/150?img=5',
        },
        date: 'Aug 28, 11:02 AM',
        body: [
          'Hello,',
          'We’re growing fast and need to add five more seats this week. Can we do that mid-cycle, and how is the cost prorated?',
          'Thanks,\nNadia',
        ],
      },
    ],
  },
  {
    id: 6,
    category: 'Primary',
    subject: 'Feedback on the new editor',
    time: '2d',
    unread: false,
    preview:
      'Just wanted to say the new editor is a huge improvement. One small thing — the slash menu sometimes opens off-screen.',
    messages: [
      {
        author: {
          name: 'Tom Becker',
          email: 'tom@fieldworks.dev',
          image: 'https://i.pravatar.cc/150?img=8',
        },
        date: 'Aug 27, 4:45 PM',
        body: [
          'Hi folks,',
          'Just wanted to say the new editor is a huge improvement — the tables especially. One small thing: the slash menu sometimes opens off-screen near the bottom of the page.',
          'Not urgent, just flagging it. Keep up the great work!',
        ],
      },
    ],
  },
  {
    id: 7,
    category: 'Primary',
    subject: 'Follow-up from our onboarding call',
    time: '2d',
    unread: false,
    preview:
      'Thanks for the walkthrough today. Sharing the notes and the two questions the team still had about permissions.',
    messages: [
      {
        author: {
          name: 'Grace Liu',
          email: 'grace@northloop.io',
          image: 'https://i.pravatar.cc/150?img=16',
        },
        date: 'Aug 27, 1:20 PM',
        body: [
          'Hi Priya,',
          'Thanks for the walkthrough today — really helpful. I’m sharing the notes with the team and following up on the two questions we had about role permissions.',
          'Talk soon,\nGrace',
        ],
      },
    ],
  },
  {
    id: 8,
    category: 'Primary',
    subject: 'Hitting API rate limits in production',
    time: '3d',
    unread: true,
    preview:
      'Since this morning we’re getting 429s on the documents endpoint. Traffic hasn’t changed — has the limit been lowered?',
    messages: [
      {
        author: {
          name: 'Victor Alvarez',
          email: 'victor@initech.com',
          image: 'https://i.pravatar.cc/150?img=52',
        },
        date: 'Aug 26, 9:05 AM',
        body: [
          'Hi,',
          'Since this morning we’re getting 429 responses on the documents endpoint in production. Our traffic hasn’t changed — has the rate limit been lowered recently?',
          'This is affecting live users, so any quick guidance would help.',
        ],
      },
    ],
  },
  {
    id: 9,
    category: 'Primary',
    subject: 'Can we enable SSO for our org?',
    time: '4d',
    unread: false,
    preview:
      'Security is asking us to move to SAML SSO. What’s involved on your side, and is it available on our current plan?',
    messages: [
      {
        author: {
          name: 'Elena Fischer',
          email: 'elena@umbrella.co',
          image: 'https://i.pravatar.cc/150?img=20',
        },
        date: 'Aug 25, 2:30 PM',
        body: [
          'Hi team,',
          'Our security team is asking us to move to SAML SSO. What’s involved on your side to set it up, and is it available on our current plan?',
          'Best,\nElena',
        ],
      },
    ],
  },
  {
    id: 10,
    category: 'Transactions',
    subject: 'Receipt for your July payment',
    time: '5d',
    unread: false,
    preview:
      'Thanks for your payment of $480.00. Your receipt for the July billing period is attached below.',
    messages: [
      {
        author: { name: 'Northwind Billing', email: 'billing@northwind.com' },
        date: 'Aug 24, 6:00 AM',
        body: [
          'Hi,',
          'Thanks for your payment of $480.00 for the July billing period. This email is your receipt — no action needed.',
          'You can view or download past invoices anytime from Settings → Billing.',
        ],
      },
    ],
  },
  {
    id: 11,
    category: 'Transactions',
    subject: 'Invoice #2043 is ready to view',
    time: '6d',
    unread: true,
    preview:
      'Your invoice for the upcoming period is ready. The total is $600.00, due on September 1.',
    messages: [
      {
        author: { name: 'Northwind Billing', email: 'billing@northwind.com' },
        date: 'Aug 23, 6:00 AM',
        body: [
          'Hi,',
          'Invoice #2043 for the upcoming billing period is ready to view. The total is $600.00, due on September 1.',
          'No action is needed if you’re on auto-pay — we’ll charge your card on file.',
        ],
      },
    ],
  },
  {
    id: 12,
    category: 'Transactions',
    subject: 'Billing discrepancy on latest invoice',
    time: '6d',
    unread: true,
    preview:
      'Our invoice for this month shows 10 Pro licenses, but we only have 8 active users. Can you review the charge?',
    messages: [
      {
        author: {
          name: 'Dana Whitfield',
          email: 'dana@brightwave.co',
          image: 'https://i.pravatar.cc/150?img=25',
        },
        date: 'Aug 23, 5:12 AM',
        body: [
          'Hello,',
          'Our invoice for this month shows 10 Pro licenses, but we only have 8 active users. Can you review the charge and issue a correction if needed?',
          'Thanks,\nDana',
        ],
      },
    ],
  },
  {
    id: 13,
    category: 'Updates',
    subject: 'What’s new: faster search and saved views',
    time: '1w',
    unread: false,
    preview:
      'This month we rebuilt search to be up to 5× faster and added saved views so you can pin the filters you use most.',
    messages: [
      {
        author: { name: 'Northwind', email: 'product@northwind.com' },
        date: 'Aug 22, 8:00 AM',
        body: [
          'Hi there,',
          'This month we rebuilt search to be up to 5× faster, and added saved views so you can pin the filters you use most.',
          'Read the full changelog in your dashboard under What’s New.',
        ],
      },
    ],
  },
  {
    id: 14,
    category: 'Updates',
    subject: 'New sign-in from Chrome on macOS',
    time: '1w',
    unread: false,
    preview:
      'We noticed a new sign-in to your Northwind account. If this was you, no action is needed.',
    messages: [
      {
        author: { name: 'Northwind Security', email: 'security@northwind.com' },
        date: 'Aug 21, 10:14 PM',
        body: [
          'Hi,',
          'We noticed a new sign-in to your Northwind account from Chrome on macOS, near San Francisco, CA.',
          'If this was you, no action is needed. If not, reset your password and review active sessions right away.',
        ],
      },
    ],
  },
  {
    id: 15,
    category: 'Updates',
    subject: 'Scheduled maintenance this Sunday',
    time: '1w',
    unread: false,
    preview:
      'Northwind will be briefly unavailable on Sunday, 02:00–03:00 UTC while we upgrade our database cluster.',
    messages: [
      {
        author: { name: 'Northwind', email: 'status@northwind.com' },
        date: 'Aug 21, 9:00 AM',
        body: [
          'Hi,',
          'Northwind will be briefly unavailable on Sunday from 02:00 to 03:00 UTC while we upgrade our database cluster.',
          'No action is needed — we’re sharing this so you can plan around the window.',
        ],
      },
    ],
  },
  {
    id: 16,
    category: 'Promotions',
    subject: 'Upgrade to Pro and save 20% this month',
    time: '1w',
    unread: false,
    preview:
      'Unlock automations, advanced permissions, and priority support. Upgrade before month-end to lock in 20% off.',
    messages: [
      {
        author: { name: 'Northwind', email: 'offers@northwind.com' },
        date: 'Aug 20, 8:30 AM',
        body: [
          'Hi there,',
          'Unlock automations, advanced permissions, and priority support with Northwind Pro. Upgrade before month-end to lock in 20% off your first year.',
          'Questions about the plan? Just reply to this email.',
        ],
      },
    ],
  },
  {
    id: 17,
    category: 'Promotions',
    subject: 'You’re invited: automation webinar',
    time: '2w',
    unread: false,
    preview:
      'Join our 30-minute live session on building no-code automations, with time for Q&A at the end.',
    messages: [
      {
        author: { name: 'Northwind Partners', email: 'events@northwind.com' },
        date: 'Aug 15, 12:00 PM',
        body: [
          'Hi,',
          'Join our 30-minute live session on building no-code automations in Northwind, with time for Q&A at the end.',
          'Save your seat from the link in your dashboard — recordings go out to everyone who registers.',
        ],
      },
    ],
  },
]

// The open thread, bound to the list's `v-model:active`. Row `value`s are
// strings, so this is the string id.
const activeId = ref('1')
const selected = computed(
  () => threads.find((t) => String(t.id) === activeId.value) ?? threads[0],
)
const filteredThreads = computed(() =>
  threads.filter((t) => t.category === activeTab.value),
)
// Reading-pane subject reads as a reply once the thread has more than one message.
const readingSubject = computed(() =>
  selected.value.messages.length > 1
    ? `Re: ${selected.value.subject}`
    : selected.value.subject,
)

// Overflow actions for the reading toolbar — mail verbs, not ticket verbs.
const moreActions = [
  { label: 'Star', icon: 'lucide-star' },
  { label: 'Mark as important', icon: 'lucide-bookmark' },
  { label: 'Move to…', icon: 'lucide-folder-input' },
  { label: 'Mute', icon: 'lucide-bell-off' },
  { label: 'Print', icon: 'lucide-printer' },
  { label: 'Report spam', icon: 'lucide-shield-alert' },
  { label: 'Block sender', icon: 'lucide-user-x' },
]

// The list pane can be collapsed from the reading toolbar, like most mail apps.
const showList = ref(true)
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell :scroll="false">
      <template #sidebar>
        <Sidebar width="14rem" class="border-r">
          <SidebarHeader
            title="Northwind"
            subtitle="support@northwind.io"
            logo="https://api.dicebear.com/10.x/disco/svg?seed=Northwind"
            :menu-items="[
              { label: 'Switch mailbox', icon: 'lucide-arrow-left-right' },
              { label: 'Settings', icon: 'lucide-settings' },
              { label: 'Log out', icon: 'lucide-log-out' },
            ]"
          />

          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <nav class="space-y-0.5">
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-search size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">Search</span>
                <template #suffix>
                  <Badge variant="ghost" label="⌘K" />
                </template>
              </SidebarItem>

              <SidebarItem
                v-for="box in mailboxes"
                :key="box.label"
                :active="activeMailbox === box.label"
                @click="activeMailbox = box.label"
              >
                <template #prefix>
                  <span :class="box.icon" class="size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">{{ box.label }}</span>
                <template #suffix>
                  <Badge
                    v-if="box.count"
                    variant="ghost"
                    :label="String(box.count)"
                  />
                </template>
              </SidebarItem>
            </nav>

            <div class="mt-4 flex h-7 items-center">
              <SidebarLabel>Labels</SidebarLabel>
            </div>
            <nav class="mt-0.5 space-y-0.5">
              <SidebarItem v-for="label in labels" :key="label">
                <template #prefix>
                  <span
                    class="lucide-tag size-4 text-ink-gray-5"
                    aria-hidden="true"
                  />
                </template>
                <span class="flex-1 truncate text-sm">{{ label }}</span>
              </SidebarItem>
            </nav>
          </ScrollArea>

          <div class="mt-auto px-2 pb-2">
            <SidebarCollapseToggle />
          </div>
        </Sidebar>
      </template>

      <!--
        One split header, not two. PageHeaderBase teleports its content to the
        shell's pinned PageHeaderTarget (above the scroll region), so the bar
        never scrolls with the panes. Using the padding-free base — rather than
        PageHeader — lets the divider between the two halves line up exactly
        with the column border below.
      -->
      <PageHeaderBase
        class="z-10 flex h-12 border-b border-outline-gray-1 bg-surface-base"
      >
        <!-- List half — width + right border track the list pane below. -->
        <div
          v-show="showList"
          class="flex w-[23rem] shrink-0 items-center justify-between border-r border-outline-gray-1 px-4"
        >
          <PageHeaderTitle title="Inbox" />
          <Button variant="ghost" icon="lucide-pen-line" label="Compose" />
        </div>

        <!-- Reading half — fills the rest. -->
        <div
          class="flex min-w-0 flex-1 items-center justify-between gap-3 px-5"
        >
          <div class="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              :icon="showList ? 'lucide-panel-left-close' : 'lucide-panel-left'"
              label="Toggle list"
              @click="showList = !showList"
            />
            <PageHeaderTitle>{{ readingSubject }}</PageHeaderTitle>
          </div>

          <!-- Mail actions: archive / snooze / delete / mark unread + more. -->
          <div class="flex shrink-0 items-center gap-1">
            <Button variant="ghost" icon="lucide-archive" label="Archive" />
            <Button variant="ghost" icon="lucide-alarm-clock" label="Snooze" />
            <Button variant="ghost" icon="lucide-trash-2" label="Delete" />
            <Button variant="ghost" icon="lucide-mail" label="Mark as unread" />
            <Dropdown :options="moreActions" align="end">
              <Button variant="ghost" icon="lucide-ellipsis" label="More" />
            </Dropdown>
          </div>
        </div>
      </PageHeaderBase>

      <!--
        The panes below carry no headers of their own now — each just owns its
        scroll. DesktopShell `:scroll="false"` makes the content area fill the
        remaining height without page-scrolling, so this two-pane row just fills
        it and each pane's ScrollArea becomes the real scroller.
      -->
      <div class="flex min-h-0 flex-1">
        <!-- Message list pane. -->
        <section
          v-show="showList"
          class="flex h-full min-h-0 w-[23rem] shrink-0 flex-col border-r border-outline-gray-1"
        >
          <!-- Category tabs — pinned above the list; they filter, not scroll. -->
          <div
            class="flex shrink-0 items-center border-b border-outline-gray-1 px-4 py-2"
          >
            <TabButtons
              v-model="activeTab"
              :options="mailTabs.map((tab) => ({ label: tab }))"
            />
          </div>

          <ScrollArea class="min-h-0 flex-1" viewport-class="p-1">
            <!--
              A two-track content / trailing grid — no leading media. Setting
              `columns` flips the divider default from `inset` to `full`, so the
              rules span the row edge to edge instead of clearing an avatar.
              `--list-row-padding-x` widens the row's inline inset to 1rem; the
              cells carry the vertical padding — together they restore the
              roomier px-4 py-3 rhythm of the hand-rolled version.

              `v-model:active` makes the open thread first-class: the List draws
              the highlight and hides the dividers hugging it, and clicking a
              row sets `activeId` — so no per-row :class or @click here.
            -->
            <List
              v-model:active="activeId"
              :columns="['minmax(0,1fr)', 'auto']"
              :style="{ '--list-row-padding-x': '1rem' }"
            >
              <ListRows
                :items="filteredThreads"
                v-slot="{ item: thread, value }"
              >
                <ListRow :value="value">
                  <ListCell>
                    <div class="min-w-0 py-3">
                      <div
                        class="truncate inline-flex items-center text-base text-ink-gray-8"
                        :class="
                          thread.unread && 'font-semibold text-ink-gray-9'
                        "
                      >
                        <!-- Unread dot, inline before the subject — no reserved
                             column, so it only takes space when present. -->
                        <span
                          v-if="thread.unread"
                          class="mr-1.5 inline-block size-2 rounded-full bg-surface-blue-7 align-middle"
                          aria-hidden="true"
                        />{{ thread.subject }}
                      </div>
                      <p class="mt-0.5 line-clamp-2 text-p-sm text-ink-gray-5">
                        {{ thread.preview }}
                      </p>
                    </div>
                  </ListCell>
                  <ListCell class="self-start justify-end pt-3">
                    <span class="shrink-0 text-xs text-ink-gray-5">
                      {{ thread.time }} ago
                    </span>
                  </ListCell>
                </ListRow>
              </ListRows>
            </List>

            <p
              v-if="!filteredThreads.length"
              class="px-3 py-10 text-center text-p-sm text-ink-gray-4"
            >
              No conversations in {{ activeTab }}.
            </p>
          </ScrollArea>
        </section>

        <!-- Reading pane. -->
        <section class="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <ScrollArea class="min-h-0 flex-1">
            <div class="space-y-6 px-6 py-5">
              <article
                v-for="(message, i) in selected.messages"
                :key="i"
                class="border-t border-outline-gray-1 pt-6 first:border-0 first:pt-0"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <Avatar
                      size="xl"
                      :label="message.author.name"
                      :image="message.author.image"
                    />
                    <div class="min-w-0">
                      <div class="text-base font-semibold text-ink-gray-9">
                        {{ message.author.name }}
                      </div>
                      <div class="truncate text-sm mt-0.5 text-ink-gray-5">
                        From {{ message.author.email }}
                      </div>
                    </div>
                  </div>
                  <span class="shrink-0 text-sm text-ink-gray-5">
                    {{ message.date }}
                  </span>
                </div>

                <div class="mt-4 space-y-4">
                  <p
                    v-for="(paragraph, p) in message.body"
                    :key="p"
                    class="whitespace-pre-line text-p-base text-ink-gray-8"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </article>
            </div>
          </ScrollArea>

          <!-- Reply bar, pinned below the scroll region. -->
          <footer
            class="flex shrink-0 items-center gap-2 border-t border-outline-gray-1 px-5 py-3"
          >
            <Button variant="solid" label="Reply" icon-left="lucide-reply" />
            <Button
              variant="ghost"
              label="Reply all"
              icon-left="lucide-reply-all"
            />
            <Button
              variant="ghost"
              label="Forward"
              icon-left="lucide-forward"
            />
          </footer>
        </section>
      </div>
    </DesktopShell>
  </div>
</template>
