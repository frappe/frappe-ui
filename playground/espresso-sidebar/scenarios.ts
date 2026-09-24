import type { ItemRow, Row } from './types'

export type ScenarioId =
  | 'default'
  | 'crm'
  | 'helpdesk'
  | 'drive'
  | 'mail'
  | 'calendar'
  | 'lms'
  | 'settings'

const item = (
  label: string,
  icon: string,
  extra: Partial<ItemRow> = {},
): ItemRow => ({ type: 'item', label, prefix: { icon }, ...extra })

const divider: Row = { type: 'divider' }

const listItems = (): Row => ({
  type: 'group',
  rows: Array.from({ length: 5 }, () => item('List item', 'sparkle')),
})

export interface Scenario {
  id: ScenarioId
  label: string
  /** App logo in `logos/`; the header shows `title` / `subtitle` beside it. */
  logo?: string
  title?: string
  subtitle?: string
  /** Gap between the top-level rows of the menu, in px. */
  menuGap: number
  rows: Row[]
  /** Rows of the 44px collapsed rail. Omitted when the design has no collapsed variant. */
  collapsedRows?: Row[]
}

export const scenarios: Scenario[] = [
  {
    id: 'default',
    label: 'Default',
    logo: 'drive',
    title: 'Name',
    subtitle: 'Sandeep',
    menuGap: 12,
    rows: [
      {
        type: 'group',
        rows: [
          item('Search', 'search-alt'),
          item('Notifications', 'notifications'),
          item('Inbox', 'inbox', { hovered: true }),
          item('Home', 'home', { active: true }),
          item('People', 'people'),
          item('Settings', 'settings'),
        ],
      },
      listItems(),
      listItems(),
    ],
    collapsedRows: [
      {
        type: 'group',
        rows: [
          item('Search', 'search-alt'),
          item('Notifications', 'notifications'),
          item('Inbox', 'inbox'),
          item('Home', 'home', { active: true }),
          item('People', 'people'),
          item('Settings', 'settings'),
        ],
      },
      listItems(),
      listItems(),
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    logo: 'crm',
    title: 'CRM',
    subtitle: 'Sandeep',
    menuGap: 2,
    rows: [
      item('Search', 'search-alt', { hint: '⌘ K' }),
      item('Notifications', 'notifications'),
      divider,
      item('Dashboard', 'dashboard', { active: true }),
      item('Tasks', 'success', { hint: '21' }),
      item('Notes', 'notes'),
      item('Emails', 'email'),
      item('Leads', 'people'),
      item('Deals', 'zap'),
      item('Organisation', 'org'),
      item('Calendar', 'calender'),
      item('Contacts', 'contact'),
      item('Call & event logs', 'call'),
      divider,
      { type: 'section', label: 'Public Views', chevron: true },
      { type: 'item', label: 'My leads', prefix: { emoji: '😵‍💫' } },
      { type: 'item', label: 'My deals flow', prefix: { emoji: '🏗️' } },
      { type: 'item', label: 'Qualified deals', prefix: { emoji: '🟢' } },
      { type: 'item', label: 'Pipeline pro', prefix: { emoji: '📐' } },
    ],
  },
  {
    id: 'helpdesk',
    label: 'Helpdesk',
    logo: 'helpdesk',
    title: 'Helpdesk',
    subtitle: 'Sandeep',
    menuGap: 2,
    rows: [
      item('Search', 'search-alt', { hint: '⌘ K' }),
      item('Notifications', 'notifications'),
      divider,
      item('Tickets', 'ticket-alt', { active: true }),
      item('Dashboard', 'dashboard'),
      item('Knowledge base', 'book'),
      item('Report', 'reports'),
      item('Agents', 'agent-alt'),
      divider,
      item('General settings', 'settings'),
      item('Support policies', 'support'),
      item('Teams', 'people'),
      item('Email accounts', 'at-sign'),
      item('Ticket types', 'create-ticket'),
      item('Canned responses', 'canned-response'),
      item('Customers', 'customer'),
      item('Contacts', 'contact'),
    ],
  },
  {
    id: 'drive',
    label: 'Drive',
    logo: 'drive',
    title: 'Drive',
    subtitle: 'Sandeep',
    menuGap: 2,
    rows: [
      item('Search', 'search-alt', { hint: '⌘ K' }),
      item('My drive', 'teams', { active: true }),
      item('Recent', 'time'),
      item('Shared', 'people'),
      item('Favourites', 'star'),
      item('Trash', 'delete'),
      item('Settings', 'settings'),
    ],
  },
  {
    id: 'mail',
    label: 'Mail',
    logo: 'mail',
    title: 'Mail',
    subtitle: 'Sandeep',
    menuGap: 2,
    rows: [
      item('Home', 'home'),
      item('Inbox', 'inbox', { active: true }),
      item('Starred', 'star'),
      item('Important', 'important'),
      item('Sent', 'send'),
      item('Drafts', 'notes'),
      item('Categories', 'tag'),
      item('Contacts', 'user'),
      item('Calendar', 'calender'),
      item('Schedules', 'time'),
      item('Notebook', 'book'),
      item('To-do’s', 'success'),
      divider,
      item('Spam', 'email-spam'),
      item('Trash', 'delete-alt'),
      divider,
      { type: 'section', label: 'Labels' },
      item('Fashion', 'label-0d8ef8', { chevron: 'small-right-chevron' }),
      item('Projects', 'label-43ac79', { chevron: 'small-right-chevron' }),
      item('Events', 'label-7757ee', { chevron: 'small-right-chevron' }),
      item('Less', 'small-up', { indent: 18 }),
    ],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    logo: 'calendar',
    title: 'Calendar',
    subtitle: 'Sandeep',
    menuGap: 2,
    rows: [
      item('Search', 'search-alt'),
      divider,
      { type: 'section', label: 'My Calendars', chevron: true },
      {
        type: 'item',
        label: 'sandeep@timeless.co',
        prefix: { checkbox: '3bbde5' },
      },
      {
        type: 'item',
        label: 'Holidays in India',
        prefix: { checkbox: '7757ee' },
      },
      { type: 'item', label: 'Outlook Events', prefix: { checkbox: '43ac79' } },
      { type: 'item', label: 'Timeless Events', prefix: { checkbox: 'off' } },
      divider,
      { type: 'section', label: 'Delegated Calendar', chevron: true },
      {
        type: 'item',
        label: 'Faris Ansari',
        prefix: { avatar: 'avatar-f6315b' },
      },
      {
        type: 'item',
        label: 'Mubrarak Shafiq',
        prefix: { avatar: 'avatar-0ece61' },
      },
      {
        type: 'item',
        label: 'Jannet Patel',
        prefix: { avatar: 'avatar-39c6fe' },
      },
      {
        type: 'item',
        label: 'Rushab Mehta',
        prefix: { avatar: 'avatar-d736ff' },
      },
      {
        type: 'item',
        label: 'Arjun Choudhary',
        prefix: { avatar: 'avatar-fe4789' },
      },
    ],
  },
  {
    id: 'lms',
    label: 'LMS',
    logo: 'lms',
    title: 'LMS',
    subtitle: 'Sandeep',
    menuGap: 2,
    rows: [
      item('Search', 'search-alt'),
      item('Notifications', 'notifications'),
      divider,
      item('Home', 'home', { active: true }),
      item('All courses', 'book'),
      item('Batches', 'batches'),
      item('Satistics', 'statistics'),
      item('Job', 'job'),
      item('Programs', 'program'),
      item('Programming Exercises', 'code'),
      item('Quizzes', 'quizzes'),
      item('Assignments', 'assignments'),
      divider,
      item('More', 'small-right-chevron', { suffixIcon: 'small-add' }),
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    menuGap: 2,
    rows: [
      {
        type: 'item',
        label: 'My profile',
        prefix: { avatar: 'avatar-f6315b' },
        active: true,
      },
      item('Notifications', 'notifications'),
      divider,
      { type: 'section', label: 'App settings' },
      item('General', 'settings'),
      item('SLA policies', 'best-practices'),
      item('Holiday list', 'holiday'),
      item('Assignment rules', 'workflow'),
      item('Email accounts', 'email-openvv'),
      item('Field dependency', 'general'),
      item('Canned responses', 'canned-response'),
      divider,
      { type: 'section', label: 'Integrations' },
      item('Otto integrations', 'otto-logo'),
      item('Google integration', 'settings'),
    ],
  },
]

// Collapsed rails. Section headers drop out; everything else keeps its glyph.
const collapse = (rows: Row[]): Row[] =>
  rows
    .filter((r) => r.type !== 'section')
    .map((r) => {
      if (r.type === 'group') return { ...r, rows: collapse(r.rows) }
      if (r.type !== 'item') return r
      // Mail's label rows lose their disclosure chevron.
      if (r.chevron) return { ...r, chevron: undefined }
      return r
    })

for (const s of scenarios) {
  if (s.id === 'settings' || s.collapsedRows) continue
  s.collapsedRows = collapse(s.rows)
}

// CRM's collapsed rail runs the views straight after the call logs, with no
// divider where the "Public Views" section sits.
const crm = scenarios.find((s) => s.id === 'crm')!
crm.collapsedRows = crm.collapsedRows!.filter(
  (_, i, rows) => i !== rows.lastIndexOf(divider),
)

// Helpdesk's collapsed rail keeps the active Tickets glyph at the resting ink.
const helpdesk = scenarios.find((s) => s.id === 'helpdesk')!
helpdesk.collapsedRows = helpdesk.collapsedRows!.map((r) =>
  r.type === 'item' && r.active ? { ...r, iconColor: 'text-ink-gray-6' } : r,
)

// LMS has no collapsed design. Its rail follows the other apps: the glyphs
// stay, while the "More" disclosure and the divider above it drop out.
const lms = scenarios.find((s) => s.id === 'lms')!
lms.collapsedRows = lms.collapsedRows!.slice(0, -2)

// Mail's "Less" row doesn't exist in the collapsed rail.
const mail = scenarios.find((s) => s.id === 'mail')!
mail.collapsedRows = mail.collapsedRows!.filter(
  (r) => !(r.type === 'item' && r.label === 'Less'),
)

// Calendar's collapsed checkbox rows alternate between fill and hug widths.
const calendar = scenarios.find((s) => s.id === 'calendar')!
let checkboxIndex = 0
for (const r of calendar.collapsedRows!) {
  if (r.type === 'item' && r.prefix && 'checkbox' in r.prefix) {
    if (checkboxIndex % 2 === 1) r.width = 26
    checkboxIndex++
  }
}
