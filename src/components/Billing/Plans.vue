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
        }"
      >
        <ListHeader />
        <ListRows>
          <ListRow
            v-for="row in rows"
            :key="row.name"
            v-slot="{ column, item }"
            :row="row"
          >
            <ListRowItem :item="item" :align="column.align">
              <Badge
                v-if="column.key == 'upgrade' && row.isCurrent"
                label="Current plan"
                variant="subtle"
                size="md"
              />
              <Button
                v-else-if="column.key == 'upgrade' && !row.isCurrent"
                label="Upgrade"
                @click="row.onClick"
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
            </ListRowItem>
          </ListRow>
        </ListRows>
      </ListView>
    </div>
    <div v-else class="flex flex-1 items-center justify-center">
      <Spinner class="size-8" />
    </div>
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
import { computed } from 'vue'

const props = defineProps({
  baseAPIPath: {
    type: String,
    required: true,
  },
})

const team = createResource({
  url: `${props.baseAPIPath}.saas_api`,
  params: { method: 'team.info' },
  cache: 'team',
  auto: true,
})

const plans = createResource({
  url: `${props.baseAPIPath}.saas_api`,
  params: { method: 'site.get_plans' },
  cache: 'plans',
  auto: true,
})

const site = createResource({
  url: `${props.baseAPIPath}.saas_api`,
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
    width: 0.8,
  },
  {
    label: '',
    key: 'upgrade',
    width: 0.7,
    align: 'right',
  },
]

const rows = computed(() => {
  if (!currentPlan.value) return []
  if (!plans.data) return []
  return plans.data
    .map((plan) => {
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
        isCurrent: plan.name === currentPlan.value,
        onClick: () => changePlan(plan.name),
      }
    })
    .filter(
      (row) =>
        row.name !== 'Trial' ||
        (row.name === 'Trial' && row.name === currentPlan.value),
    )
})

function parseSize(sizeInMB) {
  if (sizeInMB < 1024) {
    return `${sizeInMB} MB`
  } else {
    return `${(sizeInMB / 1024).toFixed(0)} GB`
  }
}

function changePlan(planName) {
  createResource({
    url: `${props.baseAPIPath}.saas_api`,
    params: { method: 'site.change_plan', data: { plan: planName } },
    auto: true,
    onSuccess: () => {
      site.reload()
      plans.reload()
    },
  })
}
</script>
