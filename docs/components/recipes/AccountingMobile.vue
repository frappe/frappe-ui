<script setup>
import { computed, ref } from 'vue'
import {
  AxisChart,
  Avatar,
  Button,
  MobileNav,
  MobileNavItem,
  MobileShell,
  PageHeaderMobile,
  ScrollArea,
  TabButtons,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'

// Bottom-tab sections. The same four screens as the desktop recipe, re-laid
// for a single narrow column.
const sections = [
  { key: 'cashflow', label: 'Cashflow', icon: 'lucide-activity' },
  { key: 'expenses', label: 'Expenses', icon: 'lucide-receipt' },
  { key: 'payroll', label: 'Payroll', icon: 'lucide-users' },
  { key: 'reports', label: 'Reports', icon: 'lucide-chart-no-axes-column' },
]
const section = ref('cashflow')
const title = computed(
  () => sections.find((s) => s.key === section.value)?.label ?? '',
)

const currency = (n) =>
  `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

/* -- Cashflow ------------------------------------------------------------- */

const cashflow = {
  data: [
    { week: new Date('2026-03-16'), balance: 11800 },
    { week: new Date('2026-03-23'), balance: 2400 },
    { week: new Date('2026-03-30'), balance: 16400 },
    { week: new Date('2026-04-06'), balance: 9800 },
    { week: new Date('2026-04-13'), balance: 20100 },
    { week: new Date('2026-04-20'), balance: 14081 },
    { week: new Date('2026-04-27'), balance: 6200 },
    { week: new Date('2026-05-04'), balance: -3900 },
    { week: new Date('2026-05-11'), balance: -1518 },
  ],
  title: 'Cashflow',
  subtitle: 'Weekly balance',
  xAxis: { key: 'week', type: 'time', timeGrain: 'week' },
  yAxis: { prefix: '$' },
  series: [{ name: 'balance', type: 'area' }],
}

const cashflowStats = [
  { label: 'Todays balance', value: 14081.09 },
  { label: 'Incoming 30d', value: 2011.44 },
  { label: 'Outgoing 30d', value: 12011.44 },
  { label: 'Projected', value: -1518.0 },
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
]

/* -- Payroll -------------------------------------------------------------- */

const payroll = [
  { id: 1, name: 'Stacey Bobb', tax: 300, ni: 314, net: 18540 },
  { id: 2, name: 'Derek Forbes', tax: 300, ni: 314, net: 19500 },
  { id: 3, name: 'Garth Leemow', tax: 200, ni: 314, net: 18540 },
  { id: 4, name: 'Ilyssa Bodah', tax: 400, ni: 314, net: 12000 },
  { id: 5, name: 'Bernard Timm', tax: 500, ni: 314, net: 28560 },
  { id: 6, name: 'Rabbi Ferouz', tax: 300, ni: 314, net: 12110 },
  { id: 7, name: 'Sam Ruprecht', tax: 150, ni: 314, net: 13880 },
  { id: 8, name: 'Daren Crabb', tax: 180, ni: 314, net: 110540 },
]
const selectMode = ref(false)
const selection = ref([])
function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) selection.value = []
}

/* -- Profit & Loss -------------------------------------------------------- */

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
const pnlRows = [
  { label: 'Turnover', values: [328, 219, 475, 450, 782, 105, 275, 739] },
  { label: 'Sales', values: [6513, 1033, 1892, 6410, 8017, 2109, 8006, 2900] },
  {
    label: 'Accountancy Fees',
    values: [1570, 750, 575, 2450, 800, 1840, 1050, 1050],
  },
  {
    label: 'Computer Software',
    values: [1200, 1050, 1050, 1950, 2400, 2450, 1250, 550],
  },
  {
    label: 'Office Equipment',
    values: [2400, 1840, 1050, 3050, 2450, 800, 1050, 575],
  },
  {
    label: 'Stationary',
    values: [1950, 990, 1250, 1050, 1200, 1050, 1570, 550],
  },
  {
    label: 'Accomodation',
    values: [990, 550, 2450, 1570, 750, 1050, 1050, 1250],
  },
  { label: 'Meals', values: [800, 1200, 1840, 1250, 3095, 575, 2400, 3050] },
]
const pnlTotals = computed(() =>
  months.map((_, col) =>
    pnlRows.reduce((sum, row) => sum + row.values[col], 0),
  ),
)
const compactMoney = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`)
const pnlColumns = ['8rem', ...months.map(() => '4.5rem')]
</script>

<template>
  <MobileShell>
    <PageHeaderMobile :title="title">
      <template #left>
        <div
          class="flex size-8 items-center justify-center rounded bg-surface-gray-7 text-ink-white"
        >
          <span class="lucide-landmark size-4" aria-hidden="true" />
        </div>
      </template>
      <template #right>
        <Button
          v-if="section === 'payroll'"
          variant="ghost"
          :icon="selectMode ? 'lucide-check' : 'lucide-list-checks'"
          :label="selectMode ? 'Done' : 'Select'"
          @click="toggleSelectMode"
        />
        <Button
          v-else-if="section === 'reports'"
          variant="ghost"
          icon="lucide-git-compare"
          label="Compare"
        />
        <Button v-else variant="ghost" icon="lucide-plus" label="Add" />
      </template>
    </PageHeaderMobile>

    <!-- Cashflow ------------------------------------------------------------>
    <div v-if="section === 'cashflow'" class="space-y-4 px-4 pb-6 pt-3">
      <div class="h-52 overflow-hidden rounded-lg border bg-surface-base p-3">
        <AxisChart :config="cashflow" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="stat in cashflowStats"
          :key="stat.label"
          class="rounded-lg border bg-surface-base p-3"
        >
          <div class="text-sm text-ink-gray-6">{{ stat.label }}</div>
          <div
            class="mt-1 text-xl font-semibold"
            :class="stat.value < 0 ? 'text-ink-red-6' : 'text-ink-gray-9'"
          >
            {{ currency(stat.value) }}
          </div>
        </div>
      </div>

      <TabButtons
        v-model="flowTab"
        class="w-full"
        :options="[
          { label: 'Incomings', value: 'incomings' },
          { label: 'Outgoings', value: 'outgoings' },
        ]"
      />

      <List class="list-row-px-3" :columns="['minmax(0,1fr)', 'auto']">
        <ListRow
          v-for="item in flowRows"
          :key="item.description"
          class="h-14"
          @click="() => {}"
        >
          <ListCell>
            <div class="min-w-0">
              <div class="truncate text-lg text-ink-gray-8">
                {{ item.description }}
              </div>
              <div class="mt-0.5 text-md text-ink-gray-5">{{ item.date }}</div>
            </div>
          </ListCell>
          <ListCell class="justify-end">
            <span
              class="text-lg font-medium tabular-nums"
              :class="
                flowTab === 'incomings' ? 'text-ink-green-6' : 'text-ink-gray-8'
              "
            >
              {{ flowTab === 'incomings' ? '+' : '-'
              }}{{ currency(item.amount).replace('-', '') }}
            </span>
          </ListCell>
        </ListRow>
      </List>
    </div>

    <!-- Expenses ------------------------------------------------------------>
    <div v-else-if="section === 'expenses'" class="pb-6 pt-1">
      <List class="list-row-px-4" :columns="['minmax(0,1fr)', 'auto']">
        <ListRow
          v-for="item in expenses"
          :key="item.description + item.date"
          class="h-14"
          @click="() => {}"
        >
          <ListCell>
            <div class="min-w-0">
              <div class="truncate text-lg text-ink-gray-8">
                {{ item.description }}
              </div>
              <div class="mt-0.5 text-md text-ink-gray-5">{{ item.date }}</div>
            </div>
          </ListCell>
          <ListCell class="justify-end">
            <span class="text-lg font-medium tabular-nums text-ink-gray-8">
              {{ currency(item.amount) }}
            </span>
          </ListCell>
        </ListRow>
      </List>
    </div>

    <!-- Payroll ------------------------------------------------------------->
    <div v-else-if="section === 'payroll'" class="pb-6 pt-1">
      <List
        class="list-row-px-4"
        :columns="['minmax(0,1fr)', 'auto']"
        :selectable="selectMode"
        v-model:selection="selection"
      >
        <ListRow
          v-for="item in payroll"
          :key="item.id"
          :value="String(item.id)"
          class="h-16"
          @click="() => {}"
        >
          <ListCell>
            <Avatar :label="item.name" size="lg" />
            <div class="ml-3 min-w-0">
              <div class="truncate text-lg text-ink-gray-8">
                {{ item.name }}
              </div>
              <div class="mt-0.5 text-md text-ink-gray-5">
                Tax {{ currency(item.tax) }} · NI {{ currency(item.ni) }}
              </div>
            </div>
          </ListCell>
          <ListCell class="justify-end">
            <div class="text-right">
              <div class="text-lg font-medium tabular-nums text-ink-gray-8">
                {{ currency(item.net) }}
              </div>
              <div class="mt-0.5 text-md text-ink-gray-5">per annum</div>
            </div>
          </ListCell>
        </ListRow>
      </List>
    </div>

    <!-- Reports (Profit & Loss) --------------------------------------------->
    <div v-else class="px-4 pb-6 pt-3">
      <ScrollArea
        orientation="horizontal"
        class="rounded-lg border bg-surface-base"
        viewport-class="p-3"
      >
        <List class="w-max" :columns="pnlColumns" :row-height="40">
          <template v-for="row in pnlRows" :key="row.label">
            <ListRow>
              <ListCell>
                <span class="truncate text-base text-ink-gray-8">{{
                  row.label
                }}</span>
              </ListCell>
              <ListCell v-for="(value, i) in row.values" :key="i">
                <span class="text-base tabular-nums text-ink-gray-7">
                  {{ compactMoney(value) }}
                </span>
              </ListCell>
            </ListRow>
          </template>
          <ListRow class="border-t">
            <ListCell />
            <ListCell v-for="(total, i) in pnlTotals" :key="i">
              <span
                class="text-base font-semibold tabular-nums text-ink-gray-9"
              >
                {{ compactMoney(total) }}
              </span>
            </ListCell>
          </ListRow>
        </List>
      </ScrollArea>
    </div>

    <template #nav>
      <MobileNav>
        <MobileNavItem
          v-for="s in sections"
          :key="s.key"
          :label="s.label"
          :icon="s.icon"
          :active="section === s.key"
          @click="section = s.key"
        />
      </MobileNav>
    </template>
  </MobileShell>
</template>
