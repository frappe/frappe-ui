<script setup>
import { computed, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  DesktopShell,
  Dropdown,
  PageHeader,
  PageHeaderTitle,
  Rail,
  RailItem,
  ScrollArea,
  Select,
  SettingsBody,
  SettingsContent,
  SettingsDialog,
  SettingsHeader,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsPanel,
  SettingsRow,
  SettingsSidebar,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  Switch,
  TabButtons,
  Textarea,
  TextInput,
  Tooltip,
} from 'frappe-ui'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
  ListRows,
} from 'frappe-ui/list'

const communities = [
  {
    id: 'design',
    name: 'Design',
    image: 'https://github.com/figma.png?size=200',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    unread: 4,
    image: 'https://avatars.githubusercontent.com/u/6128107?v=4',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    image: 'https://avatars.githubusercontent.com/u/9919?v=4',
  },
]
const activeCommunity = ref('design')

const userMenu = [
  { label: 'My profile', icon: 'lucide-user' },
  {
    label: 'Settings',
    icon: 'lucide-settings',
    onClick: () => (showSettings.value = true),
  },
  { label: 'Log out', icon: 'lucide-log-out' },
]

const spaces = [
  { name: 'Announcements', icon: 'lucide-megaphone', unread: 2 },
  { name: 'Design System', icon: 'lucide-shapes', unread: 3 },
  { name: 'Website', icon: 'lucide-globe', unread: 0 },
  { name: 'Brand', icon: 'lucide-sparkles', unread: 0 },
  { name: 'Illustrations', icon: 'lucide-pen-tool', unread: 1 },
  { name: 'Research', icon: 'lucide-flask-conical', unread: 0 },
  { name: 'Archive', icon: 'lucide-archive', unread: 0 },
]
const activeSpace = ref('Design System')

const discussions = [
  {
    title: 'Design review: new onboarding flow',
    author: 'Evan You',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
    excerpt:
      'I went through the latest prototype and left comments on the empty states…',
    comments: 14,
    lastActivity: '2h',
    unread: 3,
  },
  {
    title: 'Proposal: consolidate icon sizes to a 4px grid',
    author: 'Priya Nair',
    image: 'https://i.pravatar.cc/150?img=5',
    excerpt:
      'We currently ship icons in 7 sizes. I propose we standardize on 16 / 20 / 24…',
    comments: 32,
    lastActivity: '5h',
    unread: 1,
  },
  {
    title: 'Dark mode tokens are ready for review',
    author: 'Sam Rivera',
    image: 'https://i.pravatar.cc/150?img=12',
    excerpt:
      'All semantic tokens now have dark values. The contrast checks pass except…',
    comments: 21,
    lastActivity: '1d',
    unread: 5,
  },
  {
    title: 'Q3 roadmap discussion',
    author: 'Ana Costa',
    image: 'https://i.pravatar.cc/150?img=20',
    excerpt:
      'Carrying over from the planning call — here are the three themes we agreed on…',
    comments: 8,
    lastActivity: '2d',
    unread: 0,
  },
  {
    title: 'Weekly design crit — notes and action items',
    author: 'Maya Iyer',
    image: 'https://i.pravatar.cc/150?img=27',
    excerpt:
      'Thanks everyone for joining. Summary of the feedback on the settings redesign…',
    comments: 5,
    lastActivity: '3d',
    unread: 0,
  },
  {
    title: 'Rethinking the empty state illustrations',
    author: 'Leo Martins',
    image: 'https://i.pravatar.cc/150?img=33',
    excerpt:
      'The current set feels dated. I sketched a lighter, more geometric direction…',
    comments: 17,
    lastActivity: '4h',
    unread: 2,
  },
  {
    title: 'Naming convention for spacing tokens',
    author: 'Nadia Haddad',
    image: 'https://i.pravatar.cc/150?img=40',
    excerpt:
      'Are we going with t-shirt sizes or numeric steps? Both have tradeoffs for…',
    comments: 26,
    lastActivity: '6h',
    unread: 4,
  },
  {
    title: 'Accessibility audit results are in',
    author: 'Tom Becker',
    image: 'https://i.pravatar.cc/150?img=47',
    excerpt:
      'We failed 6 of the WCAG AA checks, mostly around focus visibility and…',
    comments: 41,
    lastActivity: '8h',
    unread: 7,
  },
  {
    title: 'Should tooltips have a max width?',
    author: 'Yuki Tanaka',
    image: 'https://i.pravatar.cc/150?img=53',
    excerpt:
      'Long labels wrap awkwardly right now. I think capping at 240px reads better…',
    comments: 9,
    lastActivity: '10h',
    unread: 0,
  },
  {
    title: 'Migrating buttons to the new variant API',
    author: 'Chris Doyle',
    image: 'https://i.pravatar.cc/150?img=60',
    excerpt:
      'Codemod is ready. It covers ~90% of call sites; the rest need a manual pass…',
    comments: 18,
    lastActivity: '12h',
    unread: 1,
  },
  {
    title: 'Feedback wanted: revised color ramp',
    author: 'Isabel Ortiz',
    image: 'https://i.pravatar.cc/150?img=64',
    excerpt:
      'Bumped the mid-tones for better contrast. Take a look at gray-5 through 7…',
    comments: 23,
    lastActivity: '1d',
    unread: 0,
  },
  {
    title: 'Motion guidelines — first draft',
    author: 'Omar Farouk',
    image: 'https://i.pravatar.cc/150?img=68',
    excerpt:
      'Durations, easing curves, and when not to animate. Would love a sanity check…',
    comments: 12,
    lastActivity: '1d',
    unread: 3,
  },
  {
    title: 'Consolidating our avatar sizes',
    author: 'Evan You',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
    excerpt:
      'We have nine avatar sizes across the app. Proposing we trim to five…',
    comments: 15,
    lastActivity: '1d',
    unread: 0,
  },
  {
    title: 'New illustration style exploration',
    author: 'Priya Nair',
    image: 'https://i.pravatar.cc/150?img=5',
    excerpt:
      'Playing with a two-tone approach that scales down cleanly to 16px marks…',
    comments: 7,
    lastActivity: '2d',
    unread: 2,
  },
  {
    title: 'Form validation patterns need a rethink',
    author: 'Sam Rivera',
    image: 'https://i.pravatar.cc/150?img=12',
    excerpt:
      'Inline vs. on-submit is inconsistent. Here is a proposal to unify the rules…',
    comments: 29,
    lastActivity: '2d',
    unread: 1,
  },
  {
    title: 'Grid system: 12 columns or 16?',
    author: 'Ana Costa',
    image: 'https://i.pravatar.cc/150?img=20',
    excerpt:
      'Marketing pages want 16 for flexibility; app screens are fine with 12…',
    comments: 34,
    lastActivity: '2d',
    unread: 0,
  },
  {
    title: 'Deprecating the old card component',
    author: 'Maya Iyer',
    image: 'https://i.pravatar.cc/150?img=27',
    excerpt:
      'Usage is down to a handful of pages. Plan and timeline for removal inside…',
    comments: 11,
    lastActivity: '3d',
    unread: 4,
  },
  {
    title: 'Typography scale is drifting',
    author: 'Leo Martins',
    image: 'https://i.pravatar.cc/150?img=33',
    excerpt:
      'Found four one-off font sizes shipped last month. We should lock the scale…',
    comments: 20,
    lastActivity: '3d',
    unread: 0,
  },
  {
    title: 'Redesigning the notification center',
    author: 'Nadia Haddad',
    image: 'https://i.pravatar.cc/150?img=40',
    excerpt:
      'Grouping by source instead of time tested much better with the research group…',
    comments: 16,
    lastActivity: '3d',
    unread: 2,
  },
  {
    title: 'Loading states: skeletons vs. spinners',
    author: 'Tom Becker',
    image: 'https://i.pravatar.cc/150?img=47',
    excerpt:
      'For lists, skeletons feel faster. For actions, a spinner is clearer. Thoughts?',
    comments: 13,
    lastActivity: '4d',
    unread: 0,
  },
  {
    title: 'Standardizing our elevation shadows',
    author: 'Yuki Tanaka',
    image: 'https://i.pravatar.cc/150?img=53',
    excerpt:
      'We have five ad-hoc shadow values. Proposing a three-step elevation scale…',
    comments: 10,
    lastActivity: '4d',
    unread: 1,
  },
  {
    title: 'Rewriting the getting-started docs',
    author: 'Chris Doyle',
    image: 'https://i.pravatar.cc/150?img=60',
    excerpt:
      'The install section is confusing newcomers. Drafted a shorter, task-first flow…',
    comments: 8,
    lastActivity: '4d',
    unread: 0,
  },
  {
    title: 'Should we ship a compact density mode?',
    author: 'Isabel Ortiz',
    image: 'https://i.pravatar.cc/150?img=64',
    excerpt:
      'Power users keep asking for tighter rows. Here is what a density toggle costs…',
    comments: 27,
    lastActivity: '5d',
    unread: 3,
  },
  {
    title: 'Iconography for the new task types',
    author: 'Omar Farouk',
    image: 'https://i.pravatar.cc/150?img=68',
    excerpt:
      'Need six new glyphs. First pass attached — the "blocked" one still feels off…',
    comments: 14,
    lastActivity: '5d',
    unread: 0,
  },
  {
    title: 'Consistent focus-ring across components',
    author: 'Evan You',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
    excerpt:
      'Some components use outline, others box-shadow. Unifying on the token now…',
    comments: 19,
    lastActivity: '5d',
    unread: 2,
  },
  {
    title: 'Rethinking our modal sizes',
    author: 'Priya Nair',
    image: 'https://i.pravatar.cc/150?img=5',
    excerpt:
      'The 5xl modal is overused for content that would fit a drawer. A quick audit…',
    comments: 6,
    lastActivity: '6d',
    unread: 0,
  },
  {
    title: 'Brand refresh: logo lockups',
    author: 'Sam Rivera',
    image: 'https://i.pravatar.cc/150?img=12',
    excerpt:
      'Three lockup options for the wordmark. My vote is B, but curious what you think…',
    comments: 31,
    lastActivity: '6d',
    unread: 1,
  },
  {
    title: 'Data table: sticky headers and columns',
    author: 'Ana Costa',
    image: 'https://i.pravatar.cc/150?img=20',
    excerpt:
      'Prototype works but perf drops past 500 rows. Looking for virtualization ideas…',
    comments: 22,
    lastActivity: '6d',
    unread: 0,
  },
  {
    title: 'Emoji reactions — which set to support?',
    author: 'Maya Iyer',
    image: 'https://i.pravatar.cc/150?img=27',
    excerpt:
      'Native vs. a custom curated set. Custom is on-brand but a maintenance cost…',
    comments: 17,
    lastActivity: '1w',
    unread: 5,
  },
  {
    title: 'Standard page header anatomy',
    author: 'Leo Martins',
    image: 'https://i.pravatar.cc/150?img=33',
    excerpt:
      'Title, actions, tabs — where does each go? Documenting the canonical layout…',
    comments: 9,
    lastActivity: '1w',
    unread: 0,
  },
  {
    title: 'Onboarding checklist component',
    author: 'Nadia Haddad',
    image: 'https://i.pravatar.cc/150?img=40',
    excerpt:
      'A reusable progress checklist for first-run. Spec and edge cases inside…',
    comments: 12,
    lastActivity: '1w',
    unread: 0,
  },
  {
    title: 'Retiring the legacy TextEditor styles',
    author: 'Tom Becker',
    image: 'https://i.pravatar.cc/150?img=47',
    excerpt:
      'Old prose styles still bleed into the new editor. Mapped every conflict here…',
    comments: 24,
    lastActivity: '1w',
    unread: 2,
  },
  {
    title: 'Postmortem: the settings dialog regression',
    author: 'Yuki Tanaka',
    image: 'https://i.pravatar.cc/150?img=53',
    excerpt:
      'Cold-load rendered a blank panel. Root cause and the fix we shipped inside…',
    comments: 15,
    lastActivity: '2w',
    unread: 0,
  },
]

const feedTab = ref('All')
const visibleDiscussions = computed(() =>
  feedTab.value === 'Unread'
    ? discussions.filter((d) => d.unread)
    : discussions,
)

const showSettings = ref(false)
const settingsTab = ref('profile')

// Profile
const firstName = ref('Rhea')
const lastName = ref('Kapoor')
const bio = ref('Product designer. I care about type scales and empty states.')
const fullName = computed(() => `${firstName.value} ${lastName.value}`.trim())
const userImage = 'https://i.pravatar.cc/150?img=3'

// Preferences
const theme = ref('system')
const cursorStyle = ref('pointer')
const badgeStyle = ref('Unread count')
const spaceSort = ref('Recent activity')
const hideInactiveSpaces = ref(false)

// Notifications
const emailDigestEnabled = ref(true)
const digestFrequency = ref('Weekly')
const digestDay = ref('Monday')

// App settings + administration
const managedCommunities = [
  {
    name: 'Design',
    spaces: 7,
    members: 18,
    image: 'https://i.pravatar.cc/150?img=33',
  },
  {
    name: 'Engineering',
    spaces: 12,
    members: 34,
    image: 'https://i.pravatar.cc/150?img=40',
  },
  {
    name: 'Marketing',
    spaces: 5,
    members: 11,
    image: 'https://i.pravatar.cc/150?img=47',
  },
]
const customEmojis = ['🎉', '🚀', '👀', '💡', '✅', '🔥']
const members = [
  {
    name: 'Rhea Kapoor',
    email: 'rhea@example.com',
    role: 'Admin',
    image: 'https://i.pravatar.cc/150?img=53',
  },
  {
    name: 'Evan You',
    email: 'evan@example.com',
    role: 'Member',
    image: 'https://i.pravatar.cc/150?img=60',
  },
  {
    name: 'Priya Nair',
    email: 'priya@example.com',
    role: 'Member',
    image: 'https://i.pravatar.cc/150?img=64',
  },
  {
    name: 'Sam Rivera',
    email: 'sam@example.com',
    role: 'Guest',
    image: 'https://i.pravatar.cc/150?img=68',
  },
]

const spaceActions = [
  { label: 'Copy link', icon: 'lucide-link' },
  { label: 'Mark all as read', icon: 'lucide-check' },
  { label: 'Manage access', icon: 'lucide-users' },
  { label: 'Archive', icon: 'lucide-archive' },
]
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell>
      <template #rail>
        <Rail class="border-r">
          <!-- Home is a bespoke button, not a RailItem: the Frappe logo fills
               the whole cell and carries no tooltip of its own. -->
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-[7px] transition hover:opacity-90 focus-visible:ring-0 focus-visible:focus-ring"
            aria-label="Home"
          >
            <img src="/frappe-logo.svg" alt="" class="size-7 rounded-[7px]" />
          </button>

          <div class="flex w-full flex-1 flex-col items-center gap-3 pt-3">
            <RailItem
              v-for="c in communities"
              :key="c.id"
              :label="c.name"
              :active="activeCommunity === c.id"
              :badge="c.unread"
              badge-style="count"
              @click="activeCommunity = c.id"
            >
              <Avatar
                :image="c.image"
                :label="c.name"
                size="lg"
                shape="square"
                class="size-7"
              />
            </RailItem>
          </div>

          <!-- Bottom cluster: extra gap keeps the utility items and account
               avatar from crowding each other at the foot of the rail. -->
          <div class="flex flex-col items-center gap-2.5">
            <RailItem label="Search" variant="ghost" icon="lucide-search" />
            <RailItem
              label="Settings"
              variant="ghost"
              icon="lucide-settings"
              @click="showSettings = true"
            />

            <!-- User menu: a Dropdown whose trigger is the avatar cell at the
                 bottom of the rail. -->
            <Dropdown :options="userMenu">
              <template #trigger="{ open }">
                <button
                  type="button"
                  class="flex size-7 items-center justify-center rounded-full transition focus-visible:ring-0 focus-visible:focus-ring"
                  :class="open ? '' : 'hover:opacity-90'"
                  aria-label="Account"
                >
                  <Avatar
                    image="https://avatars.githubusercontent.com/u/499550?v=4"
                    label="Evan You"
                    size="lg"
                    class="size-7"
                  />
                </button>
              </template>
            </Dropdown>
          </div>
        </Rail>
      </template>

      <template #sidebar>
        <Sidebar width="14rem" class="border-r">
          <!-- No logo here: the left rail already shows the active
               community's avatar, so a header logo would just duplicate it. -->
          <SidebarHeader
            title="Design"
            subtitle="18 members"
            :show-logo="false"
            :menu-items="[
              {
                label: 'Invite people',
                icon: 'lucide-user-plus',
                onClick: () => (showSettings = true),
              },
              {
                label: 'Community settings',
                icon: 'lucide-settings-2',
                onClick: () => (showSettings = true),
              },
            ]"
          />

          <!-- The app owns the scroll region: ScrollArea keeps the thin,
               auto-hiding overlay scrollbar. -->
          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <nav class="space-y-0.5">
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-home size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">Home</span>
              </SidebarItem>
              <SidebarItem>
                <template #prefix>
                  <span class="lucide-search size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">Search</span>
              </SidebarItem>
            </nav>

            <div class="mt-4 flex h-7 items-center justify-between">
              <SidebarLabel>Spaces</SidebarLabel>
              <div class="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide-arrow-up-down text-ink-gray-5"
                  label="Sort spaces"
                />
              </div>
            </div>

            <nav class="mt-0.5 space-y-0.5">
              <SidebarItem
                v-for="space in spaces"
                :key="space.name"
                :active="space.name === activeSpace"
                @click="activeSpace = space.name"
              >
                <template #prefix>
                  <span :class="space.icon" class="size-4" aria-hidden="true" />
                </template>
                <span class="flex-1 truncate text-sm">{{ space.name }}</span>
                <template #suffix>
                  <span
                    v-if="space.unread"
                    class="mr-1 size-4 grid place-content-center text-xs text-ink-gray-5"
                  >
                    {{ space.unread }}
                  </span>
                </template>
              </SidebarItem>
            </nav>
          </ScrollArea>
        </Sidebar>
      </template>

      <!-- Declared by the page; teleports into the shell's pinned header target. -->
      <PageHeader>
        <div class="flex items-center gap-1">
          <PageHeaderTitle>{{ activeSpace }}</PageHeaderTitle>
          <Dropdown :options="spaceActions">
            <Button
              variant="ghost"
              icon="lucide-ellipsis"
              label="Space actions"
            />
          </Dropdown>
        </div>
        <Button label="Add new" icon-left="lucide-plus" />
      </PageHeader>

      <!-- Body container: max-w-[940px] px-3 sm:px-5 mx-auto -->
      <div class="mx-auto mt-5 w-full max-w-[940px] px-3 pb-10 sm:px-5">
        <div class="mb-4 flex items-center justify-between">
          <TabButtons
            v-model="feedTab"
            :options="[{ label: 'Unread' }, { label: 'All' }]"
          />
          <span class="text-sm text-ink-gray-5">
            {{ visibleDiscussions.length }} discussions
          </span>
        </div>

        <!-- -mx-3 lets row hover surfaces bleed past the text edge, so the
             content stays aligned with the container. -->
        <List class="-mx-3 sm:list-gap-4">
          <ListRow
            v-for="discussion in visibleDiscussions"
            :key="discussion.title"
            class="h-15"
            @click="() => {}"
          >
            <ListCell>
              <Avatar
                :image="discussion.image"
                :label="discussion.author"
                size="2xl"
              />
            </ListCell>
            <ListCell>
              <div class="min-w-0 flex-1">
                <!-- The sized text lives in an inner span so it keeps its own
                     line-height. Putting `leading-none` on the same element as
                     `truncate` (overflow-hidden) would shear off descenders like
                     the tail of "g". -->
                <div class="truncate leading-none text-ink-gray-8">
                  <span
                    :class="
                      discussion.unread ? 'text-base-semibold' : 'text-base'
                    "
                  >
                    {{ discussion.title }}
                  </span>
                </div>
                <div
                  class="mt-1.5 flex min-w-0 items-center text-base text-ink-gray-5"
                >
                  <span
                    class="lucide-reply mr-1 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span class="shrink-0">{{ discussion.author }}:&nbsp;</span>
                  <span class="truncate">{{ discussion.excerpt }}</span>
                </div>
              </div>
            </ListCell>
            <ListCell class="justify-end">
              <div>
                <div
                  class="whitespace-nowrap text-right text-sm text-ink-gray-5"
                >
                  {{ discussion.lastActivity }}
                </div>
                <div class="mt-1.5 flex items-center justify-end">
                  <Tooltip
                    v-if="discussion.unread"
                    :text="`${discussion.unread} unread`"
                  >
                    <Badge theme="amber" variant="solid" size="sm">
                      {{ discussion.unread }}
                    </Badge>
                  </Tooltip>
                  <Badge v-else>{{ discussion.comments + 1 }}</Badge>
                </div>
              </div>
            </ListCell>
          </ListRow>
        </List>
      </div>
    </DesktopShell>

    <SettingsDialog v-model="showSettings" v-model:tab="settingsTab" size="5xl">
      <SettingsSidebar>
        <SettingsNavGroup label="User settings">
          <SettingsNavItem value="profile">
            <template #prefix>
              <Avatar
                size="xs"
                :image="userImage"
                :label="fullName"
                class="shrink-0"
              />
            </template>
            Profile
          </SettingsNavItem>
          <SettingsNavItem value="preferences">
            <template #prefix>
              <span
                class="lucide-sliders-horizontal size-4 shrink-0 text-ink-gray-6"
              />
            </template>
            Preferences
          </SettingsNavItem>
          <SettingsNavItem value="notifications">
            <template #prefix>
              <span class="lucide-bell size-4 shrink-0 text-ink-gray-6" />
            </template>
            Notifications
          </SettingsNavItem>
        </SettingsNavGroup>
        <SettingsNavGroup label="App settings">
          <SettingsNavItem value="communities">
            <template #prefix>
              <span class="lucide-building-2 size-4 shrink-0 text-ink-gray-6" />
            </template>
            Communities
          </SettingsNavItem>
          <SettingsNavItem value="emojis">
            <template #prefix>
              <span class="lucide-smile-plus size-4 shrink-0 text-ink-gray-6" />
            </template>
            Emojis
          </SettingsNavItem>
        </SettingsNavGroup>
        <SettingsNavGroup label="Administration">
          <SettingsNavItem value="users">
            <template #prefix>
              <span class="lucide-users size-4 shrink-0 text-ink-gray-6" />
            </template>
            Users
          </SettingsNavItem>
        </SettingsNavGroup>
      </SettingsSidebar>

      <SettingsContent>
        <SettingsPanel value="profile">
          <SettingsHeader title="Profile" />
          <SettingsBody>
            <div class="space-y-11 pt-6">
              <section class="space-y-6">
                <div class="flex items-center gap-4">
                  <Avatar
                    :image="userImage"
                    :label="fullName"
                    class="size-16"
                  />
                  <div>
                    <div class="text-base-medium text-ink-gray-8">
                      Profile picture
                    </div>
                    <p class="text-p-sm text-ink-gray-5">
                      Helps people recognise you
                    </p>
                  </div>
                </div>

                <div class="grid gap-6 sm:grid-cols-2">
                  <TextInput
                    label="First name"
                    class="w-full"
                    v-model="firstName"
                  />
                  <TextInput
                    label="Last name"
                    class="w-full"
                    v-model="lastName"
                  />
                </div>

                <Textarea
                  label="Bio"
                  class="w-full"
                  maxlength="280"
                  v-model="bio"
                />
              </section>

              <section>
                <h2 class="text-lg-semibold text-ink-gray-8">Account</h2>
                <div class="mt-2 divide-y divide-outline-gray-1">
                  <SettingsRow
                    title="Public profile"
                    description="View your public page or customize its card layout"
                  >
                    <div class="flex gap-2">
                      <Button icon-left="lucide-user">View</Button>
                      <Button icon-left="lucide-layout-dashboard"
                        >Customize</Button
                      >
                    </div>
                  </SettingsRow>
                  <SettingsRow
                    title="Password"
                    description="Manage password and account access"
                  >
                    <Button>Update Password</Button>
                  </SettingsRow>
                </div>
              </section>
            </div>
          </SettingsBody>
        </SettingsPanel>

        <SettingsPanel value="preferences">
          <SettingsHeader title="Preferences" />
          <SettingsBody>
            <div class="space-y-11 pt-6">
              <section>
                <div class="divide-y divide-outline-gray-1">
                  <SettingsRow
                    title="Appearance"
                    description="Choose a light, dark, or system-matched interface"
                  >
                    <Select
                      v-model="theme"
                      :options="[
                        { label: 'Light', value: 'light' },
                        { label: 'Dark', value: 'dark' },
                        { label: 'System Default', value: 'system' },
                      ]"
                    >
                      <template #item-prefix="{ item }">
                        <div
                          v-if="item.value === 'system'"
                          class="flex size-3 overflow-hidden rounded-full border border-outline-gray-2"
                        >
                          <div class="w-1/2 bg-white"></div>
                          <div class="w-1/2 bg-gray-950"></div>
                        </div>
                        <div
                          v-else
                          class="size-3 rounded-full border"
                          :class="
                            item.value == 'light'
                              ? 'border-outline-gray-2 bg-white'
                              : 'bg-gray-950'
                          "
                        ></div>
                      </template>
                    </Select>
                  </SettingsRow>
                  <SettingsRow
                    title="Cursor"
                    description="Show the pointer on everything clickable, or only on external links"
                  >
                    <Select
                      v-model="cursorStyle"
                      :options="[
                        { label: 'Pointer', value: 'pointer' },
                        { label: 'Normal', value: 'normal' },
                      ]"
                    />
                  </SettingsRow>
                </div>
              </section>

              <section>
                <h2 class="text-lg-semibold text-ink-gray-8">Sidebar</h2>
                <div class="mt-2 divide-y divide-outline-gray-1">
                  <SettingsRow
                    title="Unread badge"
                    description="Show unread activity as a dot or a count"
                  >
                    <Select
                      v-model="badgeStyle"
                      :options="['Dot', 'Unread count']"
                    />
                  </SettingsRow>
                  <SettingsRow
                    title="Communities"
                    description="Show, hide, and reorder communities in the left rail"
                  >
                    <Button>Customize</Button>
                  </SettingsRow>
                  <SettingsRow
                    title="Space sorting"
                    description="Choose how spaces are ordered in the current community sidebar"
                  >
                    <Select
                      v-model="spaceSort"
                      :options="['Recent activity', 'Alphabetical']"
                    />
                  </SettingsRow>
                  <SettingsRow
                    title="Inactive spaces"
                    description="Hide spaces with no activity for the last 2 months"
                  >
                    <Switch v-model="hideInactiveSpaces" />
                  </SettingsRow>
                </div>
              </section>
            </div>
          </SettingsBody>
        </SettingsPanel>

        <SettingsPanel value="notifications">
          <SettingsHeader title="Notifications" />
          <SettingsBody>
            <div class="space-y-11 pt-6">
              <section>
                <div class="divide-y divide-outline-gray-1">
                  <SettingsRow
                    title="Enable email digests"
                    description="Send a summary of missed activity"
                  >
                    <Switch v-model="emailDigestEnabled" />
                  </SettingsRow>
                  <SettingsRow
                    v-if="emailDigestEnabled"
                    title="Digest frequency"
                    description="Choose how often you receive your digest"
                  >
                    <Select
                      v-model="digestFrequency"
                      :options="['Weekly', 'Fortnightly', 'Monthly']"
                    />
                  </SettingsRow>
                  <SettingsRow
                    v-if="emailDigestEnabled"
                    title="Send on"
                    description="Choose the weekday for your digest"
                  >
                    <Select
                      v-model="digestDay"
                      :options="['Monday', 'Wednesday', 'Friday']"
                    />
                  </SettingsRow>
                  <SettingsRow
                    title="Last sent"
                    description="The most recent digest sent to you"
                  >
                    <div class="text-base text-ink-gray-6">28 Jun 2026</div>
                  </SettingsRow>
                </div>
              </section>
            </div>
          </SettingsBody>
        </SettingsPanel>

        <SettingsPanel value="communities">
          <SettingsHeader title="Communities">
            <template #actions>
              <Button icon-left="lucide-plus">New community</Button>
            </template>
          </SettingsHeader>
          <SettingsBody>
            <List class="-mx-3 pt-4" :row-height="56">
              <ListRow
                v-for="community in managedCommunities"
                :key="community.name"
              >
                <ListCell>
                  <Avatar
                    :image="community.image"
                    :label="community.name"
                    size="xl"
                    shape="square"
                  />
                </ListCell>
                <ListCell>
                  <div class="min-w-0">
                    <div class="truncate text-base text-ink-gray-8">
                      {{ community.name }}
                    </div>
                    <div class="mt-0.5 truncate text-sm text-ink-gray-5">
                      {{ community.spaces }} spaces ·
                      {{ community.members }} members
                    </div>
                  </div>
                </ListCell>
                <ListCell class="justify-end">
                  <Button
                    variant="ghost"
                    icon="lucide-ellipsis"
                    label="Community options"
                  />
                </ListCell>
              </ListRow>
            </List>
          </SettingsBody>
        </SettingsPanel>

        <SettingsPanel value="emojis">
          <SettingsHeader
            title="Emojis"
            description="Custom emojis are available to everyone in reactions"
          >
            <template #actions>
              <Button icon-left="lucide-plus">Add emoji</Button>
            </template>
          </SettingsHeader>
          <SettingsBody>
            <div class="flex flex-wrap gap-2 pt-6">
              <div
                v-for="emoji in customEmojis"
                :key="emoji"
                class="grid size-10 place-content-center rounded-lg border text-xl"
              >
                {{ emoji }}
              </div>
            </div>
          </SettingsBody>
        </SettingsPanel>

        <SettingsPanel value="users">
          <SettingsHeader title="Users">
            <template #actions>
              <Button icon-left="lucide-user-plus">Invite</Button>
            </template>
          </SettingsHeader>
          <SettingsBody>
            <List
              class="-mx-3 pt-4"
              :columns="['minmax(0,1fr)', '6rem', '3rem']"
              :row-height="56"
            >
              <ListHeader>
                <ListHeaderCell>Member</ListHeaderCell>
                <ListHeaderCell>Role</ListHeaderCell>
                <ListHeaderCell />
              </ListHeader>
              <ListRows :items="members" v-slot="{ item: member }">
                <ListRow>
                  <ListCell>
                    <Avatar
                      :image="member.image"
                      :label="member.name"
                      size="xl"
                    />
                    <div class="ml-3 min-w-0">
                      <div class="truncate text-base text-ink-gray-8">
                        {{ member.name }}
                      </div>
                      <div class="mt-0.5 truncate text-sm text-ink-gray-5">
                        {{ member.email }}
                      </div>
                    </div>
                  </ListCell>
                  <ListCell>
                    <span class="text-base text-ink-gray-7">{{
                      member.role
                    }}</span>
                  </ListCell>
                  <ListCell class="justify-end">
                    <Button
                      variant="ghost"
                      icon="lucide-ellipsis"
                      label="Member options"
                    />
                  </ListCell>
                </ListRow>
              </ListRows>
            </List>
          </SettingsBody>
        </SettingsPanel>
      </SettingsContent>
    </SettingsDialog>
  </div>
</template>
