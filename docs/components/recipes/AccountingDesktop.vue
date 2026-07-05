<script setup>
import { computed, ref } from 'vue'
import {
  Button,
  DateRangePicker,
  DesktopShell,
  PageHeader,
  PageHeaderTitle,
  ScrollArea,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  TabButtons,
} from 'frappe-ui'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
  ListRows,
} from 'frappe-ui/list'

// Grouped navigation. Only the four `page` items render a real screen; the
// rest are shell dressing that fall through to a shared empty state, so the
// sidebar reads like a full accounting product without faking every module.
const navGroups = [
  {
    label: 'Overview',
    items: [
      {
        key: 'cashflow',
        label: 'Cashflow',
        icon: 'lucide-activity',
        page: true,
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      { key: 'invoices', label: 'Invoices', icon: 'lucide-file-text' },
      { key: 'payments', label: 'Payments', icon: 'lucide-credit-card' },
      { key: 'orders', label: 'Orders', icon: 'lucide-shopping-cart' },
      { key: 'customers', label: 'Customers', icon: 'lucide-users-round' },
    ],
  },
  {
    label: 'Purchases',
    items: [
      { key: 'bills', label: 'Bills', icon: 'lucide-receipt-text' },
      {
        key: 'expenses',
        label: 'Expenses',
        icon: 'lucide-receipt',
        page: true,
      },
      { key: 'suppliers', label: 'Suppliers', icon: 'lucide-truck' },
    ],
  },
  {
    label: 'Accounting',
    items: [
      { key: 'payroll', label: 'Payroll', icon: 'lucide-users', page: true },
      { key: 'journal', label: 'Journal', icon: 'lucide-book-open' },
      { key: 'taxes', label: 'Taxes', icon: 'lucide-percent' },
    ],
  },
  {
    label: 'Reports',
    items: [
      {
        key: 'reports',
        label: 'Profit & Loss',
        icon: 'lucide-chart-no-axes-column',
        page: true,
      },
      { key: 'balance', label: 'Balance Sheet', icon: 'lucide-scale' },
    ],
  },
]
const navItems = navGroups.flatMap((group) => group.items)
const activePage = ref('cashflow')
const activeMeta = computed(
  () => navItems.find((item) => item.key === activePage.value) ?? navItems[0],
)

const currency = (n) =>
  `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

/* -- Cashflow (dashboard) ------------------------------------------------- */

// `delta` is the month-over-month change in %; its sign drives the arrow
// direction. Kept neutral gray — "up" isn't universally good here (higher
// outgoings is worse), so colour would mislead.
const cashflowStats = [
  { label: 'Todays balance', value: 14081.09, delta: 4.2 },
  { label: 'Incoming in 30 days', value: 2011.44, delta: 12.5 },
  { label: 'Outgoing in 30 days', value: 12011.44, delta: 3.1 },
  { label: 'Projected balance', value: -1518.0, delta: -8.4 },
]

// Linked bank/card accounts shown in the dashboard's right rail.
const accounts = [
  { name: 'Business checking', number: '•••• 4021', balance: 18240.55 },
  { name: 'Savings', number: '•••• 8873', balance: 42500.0 },
  { name: 'Credit card', number: '•••• 1180', balance: -3241.09 },
]
const accountsTotal = accounts.reduce((sum, a) => sum + a.balance, 0)

// This month's spend by category, pre-sorted; `pct` drives the bar width.
const expenseBreakdown = [
  { category: 'Salaries', amount: 20100, pct: 62 },
  { category: 'Rent & utilities', amount: 3400, pct: 11 },
  { category: 'Marketing', amount: 3400, pct: 11 },
  { category: 'Software', amount: 1550, pct: 5 },
  { category: 'Everything else', amount: 3400, pct: 11 },
]

const flowTab = ref('outgoings')
const transactions = {
  incomings: [
    { date: 'August 18', description: 'Invoice #1043 — Acme Co', amount: 4200 },
    { date: 'August 11', description: 'Invoice #1042 — Globex', amount: 1810 },
    { date: 'August 3', description: 'Refund — SaaS annual', amount: 240 },
  ],
  outgoings: [
    { date: 'August 20', description: 'Lunch', amount: 104.99 },
    { date: 'August 12', description: 'Train ticket', amount: 5.23 },
    { date: 'August 8', description: 'Lunch with client', amount: 166.23 },
    { date: 'August 4', description: 'Printer', amount: 200.0 },
    { date: 'July 29', description: 'Coffee with client', amount: 6.0 },
  ],
}
const flowRows = computed(() => transactions[flowTab.value])

/* -- Expenses ------------------------------------------------------------- */

const expenses = [
  { date: 'August 20', description: 'Lunch', amount: 104.99 },
  { date: 'August 12', description: 'Train ticket', amount: 5.23 },
  { date: 'August 8', description: 'Lunch with client', amount: 166.23 },
  { date: 'August 4', description: 'Printer', amount: 200.0 },
  { date: 'July 29', description: 'Coffee with client', amount: 6.0 },
  { date: 'July 22', description: 'Travel', amount: 105.63 },
  { date: 'July 21', description: 'Hotel stay', amount: 350.0 },
  { date: 'July 12', description: 'Printer ink', amount: 15.0 },
  { date: 'July 10', description: 'Conference tickets', amount: 699.99 },
  { date: 'July 2', description: 'Train ticket', amount: 5.23 },
  { date: 'June 25', description: 'Bus travel', amount: 10.02 },
  { date: 'July 13', description: 'Accountant software', amount: 175.0 },
]

/* -- Payroll -------------------------------------------------------------- */

const payroll = [
  { id: 1, name: 'Stacey Bobb', total: 1900, tax: 300, ni: 314, net: 18540 },
  { id: 2, name: 'Derek Forbes', total: 1205, tax: 300, ni: 314, net: 19500 },
  { id: 3, name: 'Garth Leemow', total: 1900, tax: 200, ni: 314, net: 18540 },
  { id: 4, name: 'Ilyssa Bodah', total: 1200, tax: 400, ni: 314, net: 12000 },
  { id: 5, name: 'Bernard Timm', total: 3900, tax: 500, ni: 314, net: 28560 },
  { id: 6, name: 'Rabbi Ferouz', total: 1205, tax: 300, ni: 314, net: 12110 },
  { id: 7, name: 'Sam Ruprecht', total: 1900, tax: 150, ni: 314, net: 13880 },
  { id: 8, name: 'Daren Crabb', total: 5205, tax: 180, ni: 314, net: 110540 },
]
// The list's own selection model: `selectable` reveals the checkbox column and
// `v-model:selection` holds the chosen row `value`s (strings). A header button
// toggles the mode on and off.
const selectMode = ref(true)
const selection = ref(['2'])
function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) selection.value = []
}

/* -- Profit & Loss -------------------------------------------------------- */

// One financial year of monthly data (Apr 2024 – Mar 2025). Each month carries
// its first-of-month `date` so the DateRangePicker's window can be mapped back
// onto column indices. The report never renders all of it directly: the filter
// picks a window and the period toggle buckets it (see `buckets` below).
const months = [
  { label: 'Apr', year: 2024, date: '2024-04-01' },
  { label: 'May', year: 2024, date: '2024-05-01' },
  { label: 'Jun', year: 2024, date: '2024-06-01' },
  { label: 'Jul', year: 2024, date: '2024-07-01' },
  { label: 'Aug', year: 2024, date: '2024-08-01' },
  { label: 'Sep', year: 2024, date: '2024-09-01' },
  { label: 'Oct', year: 2024, date: '2024-10-01' },
  { label: 'Nov', year: 2024, date: '2024-11-01' },
  { label: 'Dec', year: 2024, date: '2024-12-01' },
  { label: 'Jan', year: 2025, date: '2025-01-01' },
  { label: 'Feb', year: 2025, date: '2025-02-01' },
  { label: 'Mar', year: 2025, date: '2025-03-01' },
]

// `section` rows are group headings; the rest are line items with one value per
// month, indexed to `months`. Enough lines that the report overflows the
// viewport and scrolls vertically as well as horizontally.
const pnlRows = [
  { type: 'section', label: 'Income' },
  {
    label: 'Turnover',
    values: [
      12500, 13200, 11800, 14100, 15300, 12900, 13800, 14600, 16200, 15100,
      14200, 17300,
    ],
  },
  {
    label: 'Product sales',
    values: [
      8200, 7600, 9100, 8800, 10200, 9400, 8900, 9700, 11300, 10600, 9800,
      12100,
    ],
  },
  {
    label: 'Service revenue',
    values: [
      4300, 4700, 4100, 5200, 4900, 5400, 5100, 5600, 6200, 5800, 5300, 6700,
    ],
  },
  {
    label: 'Consulting',
    values: [
      3100, 2800, 3400, 3600, 3900, 3300, 3700, 4000, 4300, 3800, 3500, 4600,
    ],
  },
  {
    label: 'Other income',
    values: [320, 410, 280, 390, 450, 300, 370, 420, 510, 470, 360, 540],
  },
  { type: 'section', label: 'Cost of sales' },
  {
    label: 'Materials',
    values: [
      4200, 3900, 4600, 4400, 5100, 4700, 4500, 4900, 5600, 5300, 4900, 6100,
    ],
  },
  {
    label: 'Shipping & freight',
    values: [820, 760, 910, 880, 1020, 940, 890, 970, 1130, 1060, 980, 1210],
  },
  {
    label: 'Merchant fees',
    values: [410, 430, 390, 470, 500, 440, 460, 490, 560, 520, 470, 610],
  },
  { type: 'section', label: 'Expenses' },
  {
    label: 'Accountancy fees',
    values: [750, 750, 750, 1450, 750, 750, 750, 1050, 750, 750, 750, 1250],
  },
  {
    label: 'Software subscriptions',
    values: [
      1200, 1250, 1250, 1300, 1400, 1450, 1250, 1550, 1250, 1350, 1250, 1550,
    ],
  },
  {
    label: 'Office equipment',
    values: [2400, 840, 1050, 3050, 450, 800, 1050, 575, 1200, 650, 900, 575],
  },
  {
    label: 'Rent & utilities',
    values: [
      3200, 3200, 3200, 3200, 3350, 3200, 3200, 3200, 3400, 3200, 3200, 3400,
    ],
  },
  {
    label: 'Salaries',
    values: [
      18500, 18500, 18500, 18500, 19200, 19200, 19200, 19200, 19200, 20100,
      20100, 20100,
    ],
  },
  {
    label: 'Marketing',
    values: [
      1500, 2200, 900, 1800, 2600, 1200, 3100, 1400, 2700, 1900, 1600, 3400,
    ],
  },
  {
    label: 'Travel',
    values: [640, 980, 420, 1250, 760, 540, 1120, 890, 1340, 720, 610, 1480],
  },
  {
    label: 'Insurance',
    values: [520, 520, 520, 520, 540, 540, 540, 540, 560, 560, 560, 560],
  },
  {
    label: 'Telecoms',
    values: [180, 185, 182, 190, 195, 188, 192, 198, 205, 200, 196, 210],
  },
  {
    label: 'Bank charges',
    values: [90, 95, 88, 110, 105, 92, 98, 102, 120, 108, 96, 130],
  },
  {
    label: 'Stationery',
    values: [180, 220, 150, 310, 240, 190, 270, 160, 330, 210, 175, 290],
  },
  {
    label: 'Meals & entertainment',
    values: [420, 560, 380, 610, 720, 390, 540, 480, 690, 450, 510, 620],
  },
]

// The picked window as [start, end] `YYYY-MM-DD`; defaults to the full year.
const fyStart = months[0].date
const fyEnd = months[months.length - 1].date
const dateRange = ref([fyStart, fyEnd])
const period = ref('monthly')

// Preset windows for the picker's #actions column.
const rangePresets = [
  { label: 'Financial year', range: [fyStart, fyEnd] },
  { label: 'Last 6 months', range: [months[6].date, fyEnd] },
  { label: 'Last quarter', range: [months[9].date, fyEnd] },
  { label: 'Last month', range: [fyEnd, fyEnd] },
]

// Map the picked date window onto column indices by comparing `YYYY-MM`
// prefixes — a partial selection falls back to the whole year.
const visibleIndices = computed(() => {
  const [from, to] = dateRange.value
  if (!from || !to) return months.map((_, i) => i)
  const [lo, hi] = [from.slice(0, 7), to.slice(0, 7)].sort()
  return months.flatMap((m, i) => {
    const ym = m.date.slice(0, 7)
    return ym >= lo && ym <= hi ? [i] : []
  })
})

// A bucket is a labelled set of month indices — one per month (Monthly) or one
// per group of three (Quarterly). Both the columns and every cell derive from
// it, so one code path renders any range at either granularity.
const buckets = computed(() => {
  const idxs = visibleIndices.value
  if (period.value === 'monthly') {
    return idxs.map((i) => ({ label: months[i].label, idx: [i] }))
  }
  const groups = []
  for (let i = 0; i < idxs.length; i += 3) {
    const idx = idxs.slice(i, i + 3)
    const span = `${months[idx[0]].label}–${months[idx[idx.length - 1]].label}`
    groups.push({ label: span, idx })
  }
  return groups
})

const cellValue = (row, bucket) =>
  bucket.idx.reduce((sum, i) => sum + row.values[i], 0)

// First column is the line-item label; one flexible track per bucket.
const pnlColumns = computed(() => [
  'minmax(9rem,1.4fr)',
  ...buckets.value.map(() => 'minmax(4.5rem,1fr)'),
])
</script>

<template>
  <div class="h-screen w-full bg-surface-base text-ink-gray-9">
    <DesktopShell>
      <template #sidebar>
        <Sidebar width="15rem" class="border-r">
          <SidebarHeader
            title="Everdusk Trading"
            subtitle="everdusk.frappe.cloud"
            logo="https://api.dicebear.com/10.x/disco/svg?seed=Everdusk"
            :menu-items="[
              { label: 'Switch company', icon: 'lucide-arrow-left-right' },
              { label: 'Import data', icon: 'lucide-upload' },
              { label: 'Settings', icon: 'lucide-settings-2' },
            ]"
          />

          <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
            <div v-for="group in navGroups" :key="group.label" class="mb-3">
              <div class="flex h-7 items-center">
                <SidebarLabel>{{ group.label }}</SidebarLabel>
              </div>
              <nav class="mt-0.5 space-y-0.5">
                <SidebarItem
                  v-for="item in group.items"
                  :key="item.key"
                  :active="item.key === activePage"
                  @click="activePage = item.key"
                >
                  <template #prefix>
                    <span
                      :class="item.icon"
                      class="size-4"
                      aria-hidden="true"
                    />
                  </template>
                  <span class="flex-1 truncate text-sm">{{ item.label }}</span>
                  <!-- Marks the items backed by a real screen (vs. shell-only
                       stubs). Gray per Gameplan's no-color rule. -->
                  <template v-if="item.page" #suffix>
                    <span
                      class="mr-2 size-1.5 rounded-full bg-surface-gray-5"
                      aria-hidden="true"
                    />
                  </template>
                </SidebarItem>
              </nav>
            </div>
          </ScrollArea>
        </Sidebar>
      </template>

      <PageHeader>
        <PageHeaderTitle>{{ activeMeta.label }}</PageHeaderTitle>
        <div class="flex items-center gap-2">
          <template v-if="activePage === 'cashflow'">
            <TabButtons
              v-model="flowTab"
              :options="[
                { label: 'Incomings', value: 'incomings' },
                { label: 'Outgoings', value: 'outgoings' },
              ]"
            />
            <Button
              variant="solid"
              label="Add transaction"
              icon-left="lucide-plus"
            />
          </template>

          <Button
            v-else-if="activePage === 'expenses'"
            variant="solid"
            label="Add transaction"
            icon-left="lucide-plus"
          />

          <template v-else-if="activePage === 'payroll'">
            <span
              v-if="selectMode && selection.length"
              class="text-sm text-ink-gray-6"
            >
              {{ selection.length }} selected
            </span>
            <Button
              :label="selectMode ? 'Done' : 'Select'"
              :icon-left="selectMode ? 'lucide-check' : 'lucide-list-checks'"
              @click="toggleSelectMode"
            />
            <Button
              variant="solid"
              label="Add employee"
              icon-left="lucide-plus"
            />
          </template>

          <template v-else-if="activePage === 'reports'">
            <Button
              variant="ghost"
              label="Compare"
              icon-left="lucide-git-compare"
            />
            <Button
              variant="solid"
              label="Export"
              icon-left="lucide-download"
            />
          </template>
        </div>
      </PageHeader>

      <!-- Cashflow (dashboard) ---------------------------------------------->
      <!-- Centered, single-column dashboard: everything stacks in one column
           capped at max-w-4xl and centred, so the layout reads top-to-bottom
           rather than spreading edge-to-edge. -->
      <div v-if="activePage === 'cashflow'" class="p-4">
        <div class="mx-auto max-w-4xl space-y-6">
          <!-- KPI strip: one row, no per-item cards — just thin vertical
               dividers. Each cell shows the figure and its trend. -->
          <div class="grid grid-cols-4 divide-x divide-outline-gray-2">
            <div
              v-for="stat in cashflowStats"
              :key="stat.label"
              class="px-4 first:pl-0 last:pr-0"
            >
              <div class="text-xs text-ink-gray-5">{{ stat.label }}</div>
              <div
                class="mt-1 text-2xl font-semibold"
                :class="stat.value < 0 ? 'text-ink-red-6' : 'text-ink-gray-9'"
              >
                {{ currency(stat.value) }}
              </div>
              <div class="mt-1 flex items-center gap-1 text-xs text-ink-gray-5">
                <span
                  :class="
                    stat.delta >= 0 ? 'lucide-arrow-up' : 'lucide-arrow-down'
                  "
                  class="size-3"
                  aria-hidden="true"
                />
                <span>{{ Math.abs(stat.delta) }}% vs last month</span>
              </div>
            </div>
          </div>

          <!-- Recent transactions: full width, spanning the whole column. -->
          <section class="space-y-2">
            <div class="flex h-7 items-center justify-between">
              <h3 class="text-sm font-semibold text-ink-gray-8">
                Recent transactions
              </h3>
              <Button variant="ghost" label="View all" />
            </div>
            <!-- list-row-px-0 drops the interactive row's default 0.75rem
                 inset so cells sit flush with the panel header and KPI strip
                 above — one shared left/right edge down the page. -->
            <List
              class="list-row-px-0"
              :columns="['8rem', 'minmax(0,1fr)', '8rem']"
              :row-height="44"
            >
              <ListRows :items="flowRows" v-slot="{ item }">
                <ListRow @click="() => {}">
                  <ListCell>
                    <span class="text-sm text-ink-gray-6">{{ item.date }}</span>
                  </ListCell>
                  <ListCell>
                    <span class="truncate text-sm text-ink-gray-8">
                      {{ item.description }}
                    </span>
                  </ListCell>
                  <ListCell class="justify-end">
                    <span
                      class="text-sm"
                      :class="
                        flowTab === 'incomings'
                          ? 'text-ink-green-6'
                          : 'text-ink-gray-8'
                      "
                    >
                      {{ flowTab === 'incomings' ? '+' : '-'
                      }}{{ currency(item.amount).replace('-', '') }}
                    </span>
                  </ListCell>
                </ListRow>
              </ListRows>
            </List>
          </section>

          <!-- Divider between the transactions row above and the two-up
               widgets below. -->
          <div class="border-t border-outline-gray-2" />

          <!-- Bottom row: Cash accounts beside Spend this month. -->
          <div class="grid grid-cols-2 gap-8">
            <!-- Cash accounts -->
            <section class="space-y-2">
              <div class="flex h-7 items-center justify-between">
                <h3 class="text-sm font-semibold text-ink-gray-8">
                  Cash accounts
                </h3>
                <span class="text-sm text-ink-gray-6">
                  {{ currency(accountsTotal) }}
                </span>
              </div>
              <div class="divide-y divide-outline-gray-1">
                <div
                  v-for="account in accounts"
                  :key="account.number"
                  class="flex items-center justify-between py-2"
                >
                  <div class="min-w-0">
                    <div class="truncate text-sm text-ink-gray-8">
                      {{ account.name }}
                    </div>
                    <div class="text-p-xs text-ink-gray-5">
                      {{ account.number }}
                    </div>
                  </div>
                  <span
                    class="shrink-0 text-sm"
                    :class="
                      account.balance < 0 ? 'text-ink-red-6' : 'text-ink-gray-8'
                    "
                  >
                    {{ currency(account.balance) }}
                  </span>
                </div>
              </div>
            </section>

            <!-- Expense breakdown -->
            <section class="space-y-3">
              <div class="flex h-7 items-center">
                <h3 class="text-sm font-semibold text-ink-gray-8">
                  Spend this month
                </h3>
              </div>
              <div class="space-y-2.5">
                <div
                  v-for="row in expenseBreakdown"
                  :key="row.category"
                  class="space-y-1"
                >
                  <div class="flex items-center justify-between text-sm">
                    <span class="truncate text-ink-gray-7">
                      {{ row.category }}
                    </span>
                    <span class="text-ink-gray-6">
                      {{ currency(row.amount).replace('.00', '') }}
                    </span>
                  </div>
                  <div
                    class="h-1.5 overflow-hidden rounded-full bg-surface-gray-2"
                  >
                    <div
                      class="h-full rounded-full bg-surface-gray-6"
                      :style="{ width: `${row.pct}%` }"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Expenses ---------------------------------------------------------->
      <div v-else-if="activePage === 'expenses'" class="p-4">
        <List
          class="w-full list-row-px-3"
          :columns="['10rem', 'minmax(0,1fr)', '9rem']"
          :row-height="40"
        >
          <ListHeader>
            <ListHeaderCell>Date</ListHeaderCell>
            <ListHeaderCell>Description</ListHeaderCell>
            <ListHeaderCell class="justify-end">Amount</ListHeaderCell>
          </ListHeader>
          <ListRows :items="expenses" v-slot="{ item }">
            <ListRow @click="() => {}">
              <ListCell>
                <span class="text-base text-ink-gray-7">{{ item.date }}</span>
              </ListCell>
              <ListCell>
                <span class="truncate text-base text-ink-gray-8">
                  {{ item.description }}
                </span>
              </ListCell>
              <ListCell class="justify-end">
                <span class="text-base text-ink-gray-8">
                  {{ currency(item.amount) }}
                </span>
              </ListCell>
            </ListRow>
          </ListRows>
        </List>
      </div>

      <!-- Payroll ----------------------------------------------------------->
      <div v-else-if="activePage === 'payroll'" class="p-4">
        <List
          class="w-full list-row-px-3"
          :columns="['minmax(0,1fr)', '9rem', '7rem', '7rem', '10rem']"
          :row-height="40"
          :selectable="selectMode"
          v-model:selection="selection"
        >
          <ListHeader>
            <ListHeaderCell>Name</ListHeaderCell>
            <ListHeaderCell
              >Total pay
              <span class="text-ink-gray-5">(per annum)</span></ListHeaderCell
            >
            <ListHeaderCell
              >Tax <span class="text-ink-gray-5">20%</span></ListHeaderCell
            >
            <ListHeaderCell>NI</ListHeaderCell>
            <ListHeaderCell
              >Net pay
              <span class="text-ink-gray-5">(per annum)</span></ListHeaderCell
            >
          </ListHeader>
          <ListRows :items="payroll" v-slot="{ item, value }">
            <ListRow :value="value" @click="() => {}">
              <ListCell>
                <span class="truncate text-base text-ink-gray-8">{{
                  item.name
                }}</span>
              </ListCell>
              <ListCell>
                <span class="text-base text-ink-gray-7">{{
                  currency(item.total)
                }}</span>
              </ListCell>
              <ListCell>
                <span class="text-base text-ink-gray-7">{{
                  currency(item.tax)
                }}</span>
              </ListCell>
              <ListCell>
                <span class="text-base text-ink-gray-7">{{
                  currency(item.ni)
                }}</span>
              </ListCell>
              <ListCell>
                <span class="text-base text-ink-gray-8">{{
                  currency(item.net)
                }}</span>
              </ListCell>
            </ListRow>
          </ListRows>
        </List>
      </div>

      <!-- Profit & Loss ----------------------------------------------------->
      <!-- `absolute inset-0` fills the shell's scroll region (its ScrollArea
           root is `position: relative` with a definite height), giving this
           page its own bounded height. That lets the filter bar and column
           header stay put while only the rows scroll — vertical scrolling is
           owned by the inner ScrollArea, not the shell. -->
      <div
        v-else-if="activePage === 'reports'"
        class="absolute inset-0 flex flex-col p-4"
      >
        <!-- Filter bar: the date range picks the window, the period toggle sets
             the granularity, and both flow into the table columns below. -->
        <div class="mb-3 flex shrink-0 flex-wrap items-center gap-2">
          <DateRangePicker
            v-model="dateRange"
            dual-pane
            format="MMM YYYY"
            :min="fyStart"
            :max="fyEnd"
          >
            <template #prefix>
              <span
                class="lucide-calendar-range size-4 text-ink-gray-5"
                aria-hidden="true"
              />
            </template>
            <template #actions="{ setRange, close }">
              <Button
                v-for="preset in rangePresets"
                :key="preset.label"
                variant="ghost"
                size="sm"
                class="w-full !justify-start"
                :label="preset.label"
                @click="
                  () => {
                    setRange(preset.range)
                    close()
                  }
                "
              />
            </template>
          </DateRangePicker>
          <TabButtons
            v-model="period"
            :options="[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
            ]"
          />
          <Button
            variant="ghost"
            label="Add filter"
            icon-left="lucide-filter"
          />
        </div>

        <ScrollArea orientation="both" class="min-h-0 flex-1">
          <List :columns="pnlColumns" :row-height="40">
            <!-- Pinned to the scroll viewport's top; opaque bg so rows scroll
                 under it, above them via z-10. -->
            <ListHeader class="sticky top-0 z-10 bg-surface-base">
              <ListHeaderCell>Line item</ListHeaderCell>
              <ListHeaderCell
                v-for="bucket in buckets"
                :key="bucket.label"
                class="justify-end"
              >
                {{ bucket.label }}
              </ListHeaderCell>
            </ListHeader>
            <ListRows :items="pnlRows" v-slot="{ item }">
              <ListRow v-if="item.type === 'section'">
                <ListCell>
                  <span class="text-sm font-semibold text-ink-gray-7">
                    {{ item.label }}
                  </span>
                </ListCell>
              </ListRow>
              <ListRow v-else>
                <ListCell>
                  <span class="truncate text-base text-ink-gray-8">{{
                    item.label
                  }}</span>
                </ListCell>
                <ListCell
                  v-for="bucket in buckets"
                  :key="bucket.label"
                  class="justify-end"
                >
                  <span class="text-base text-ink-gray-7">
                    {{ currency(cellValue(item, bucket)).replace('.00', '') }}
                  </span>
                </ListCell>
              </ListRow>
            </ListRows>
          </List>
        </ScrollArea>
      </div>

      <!-- Shell-only sections ---------------------------------------------->
      <div
        v-else
        class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        <div
          class="flex size-11 items-center justify-center rounded-full bg-surface-gray-2"
        >
          <span
            :class="activeMeta.icon"
            class="size-5 text-ink-gray-5"
            aria-hidden="true"
          />
        </div>
        <div class="mt-3 text-base font-medium text-ink-gray-8">
          No {{ activeMeta.label.toLowerCase() }} yet
        </div>
        <p class="mt-1 max-w-xs text-p-sm text-ink-gray-5">
          This section is part of the app-shell demo — the four highlighted
          screens are fully built.
        </p>
        <Button
          class="mt-4"
          variant="subtle"
          :label="`New ${activeMeta.label.toLowerCase()}`"
          icon-left="lucide-plus"
        />
      </div>
    </DesktopShell>
  </div>
</template>
