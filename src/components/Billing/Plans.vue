<template>
  <div class="flex h-full flex-col py-11 px-[68px] gap-8 overflow-y-auto">
    <h2 class="flex gap-2 text-xl font-semibold leading-5">
      {{ 'Plans' }}
    </h2>
    <div v-if="rows.length">
      <ListView
        :columns="columns"
        :rows="rows"
        row-key="name"
        :options="{
          selectable: false,
          showTooltip: false,
        }"
      >
        <ListHeader />
        <ListRows>
          <ListRow
            v-for="row in rows"
            :key="row.name"
            v-slot="{ column, item }"
            :row="row"
            :class="{ 'bg-gray-50 rounded': row.isCurrent }"
          >
            <ListRowItem :item="item" :align="column.align">
              <Badge
                v-if="column.key == 'upgrade' && row.isCurrent"
                class="shrink-0 bg-white"
                label="Current plan"
                variant="outline"
                size="lg"
              />
              <Button
                v-else-if="column.key == 'upgrade' && !row.isCurrent"
                :label="row.downgrade ? 'Downgrade' : 'Upgrade'"
                @click="row.onClick"
                :disabled="!row.downgradable && row.downgrade"
              />
              <div
                v-if="column.key == 'price'"
                class="text-base text-gray-900 font-semibold"
              >
                <span v-if="item.isTrial" class=""> Free trial </span>
                <span v-else>
                  <span>{{ item.currency }} {{ item.label }}</span>
                  <span class="text-gray-700 font-normal">/mo</span>
                </span>
              </div>
              <Tooltip v-if="column.key == 'info'">
                <template #body>
                  <PlanDetails :plan="item" />
                </template>
                <FeatherIcon class="h-4 cursor-pointer" name="info" />
              </Tooltip>
            </ListRowItem>
          </ListRow>
        </ListRows>
      </ListView>
    </div>
    <div v-else class="flex flex-1 items-center justify-center">
      <Spinner class="size-8" />
    </div>
    <UpgradePlanStepsModal
      v-if="showUpgradePlanStepsModal"
      v-model="showUpgradePlanStepsModal"
      :defaultStep="defaultStep"
      :planName="planName"
      @success="() => emit('success')"
    />
  </div>
</template>
<script setup>
import { createResource } from '../../resources/index.js'
import ListView from '../ListView/ListView.vue'
import ListHeader from '../ListView/ListHeader.vue'
import ListRows from '../ListView/ListRows.vue'
import ListRow from '../ListView/ListRow.vue'
import ListRowItem from '../ListView/ListRowItem.vue'
import Badge from '../Badge.vue'
import Spinner from '../Spinner.vue'
import Button from '../Button.vue'
import FeatherIcon from '../FeatherIcon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import PlanDetails from './PlanDetails.vue'
import UpgradePlanStepsModal from './UpgradePlanStepsModal.vue'
import { parseSize } from './utils.js'
import { ref, computed, provide } from 'vue'

const emit = defineEmits(['success'])

const billingDetails = createResource({
  url: 'frappe.integrations.frappe_providers.frappecloud_billing.api',
  params: { method: 'billing.get_information' },
  cache: 'billingDetails',
  auto: true,
})

const team = createResource({
  url: 'frappe.integrations.frappe_providers.frappecloud_billing.api',
  params: { method: 'team.info' },
  cache: 'team',
  auto: true,
})

const plans = createResource({
  url: 'frappe.integrations.frappe_providers.frappecloud_billing.api',
  params: { method: 'site.get_plans' },
  cache: 'plans',
  auto: true,
})

const site = createResource({
  url: 'frappe.integrations.frappe_providers.frappecloud_billing.api',
  params: { method: 'site.info' },
  cache: 'site',
  auto: true,
})

const currentPlan = computed(() => {
  if (!site.data) return null
  return site.data.plan?.name || 'Trial'
})

const currency = computed(() => {
  if (!team.data) return 'INR'
  return team.data.currency || 'INR'
})

const columns = [
  {
    label: '',
    key: 'info',
    width: '8px',
  },
  {
    label: 'Cost',
    key: 'price',
    width: 0.8,
  },
  {
    label: 'CPU',
    key: 'cpu',
    width: 1.2,
  },
  {
    label: 'Memory',
    key: 'memory',
    width: 1.2,
  },
  {
    label: 'Disk',
    key: 'disk',
    width: 0.7,
  },
  {
    label: '',
    key: 'upgrade',
    width: 0.8,
    align: 'right',
  },
]

const rows = computed(() => {
  if (!currentPlan.value) return []
  if (!plans.data) return []
  let currentPlanIndex = plans.data.findIndex(
    (plan) => plan.name === currentPlan.value,
  )
  return plans.data
    .map((plan, i) => {
      let cpu = plan.cpu_time_per_day > 1 ? 'compute hrs/day' : 'compute hr/day'
      let price = currency.value === 'INR' ? plan.price_inr : plan.price_usd
      return {
        name: plan.name,
        price: {
          label: price.toString(),
          isTrial: plan.name === 'Trial',
          currency: currency.value === 'INR' ? '₹' : '$',
        },
        cpu: `${plan.cpu_time_per_day} ${cpu}`,
        memory: `${parseSize(plan.max_database_usage)} Database`,
        disk: `${parseSize(plan.max_storage_usage)} Disk`,
        info: plan,
        isCurrent: plan.name === currentPlan.value,
        downgradable: plan.allow_downgrading_from_other_plan,
        downgrade: currentPlanIndex > i,
        onClick: () => changePlan(plan.name),
      }
    })
    .filter(
      (row) =>
        row.name !== 'Trial' ||
        (row.name === 'Trial' && row.name === currentPlan.value),
    )
})

const defaultStep = ref(1)
const showUpgradePlanStepsModal = ref(false)
const planName = ref('')

function changePlan(_planName) {
  if (!billingDetails.data?.country || !team.data.payment_mode) {
    defaultStep.value = billingDetails.data.country ? 2 : 1
    showUpgradePlanStepsModal.value = true
    planName.value = _planName
    return
  }

  createResource({
    url: 'frappe.integrations.frappe_providers.frappecloud_billing.api',
    params: { method: 'site.change_plan', data: { plan: _planName } },
    auto: true,
    onSuccess: () => {
      site.reload()
      plans.reload()
      emit('success')
    },
  })
}

provide('billing', {
  team: computed(() => team.data),
  reloadPlans: plans.reload,
  reloadSite: site.reload,
})
</script>
