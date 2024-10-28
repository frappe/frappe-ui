<template>
  <div class="flex flex-col gap-5">
    <div class="text-lg font-semibold text-gray-900">
      {{ 'Billing history' }}
    </div>
    <div>
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
              <template #prefix>
                <InvoiceIcon v-if="column.key == 'name'" class="h-4" />
              </template>
              <Badge
                v-if="column.key == 'status'"
                :label="item.label"
                variant="subtle"
                :theme="item.color"
                size="md"
              />
              <Button
                v-if="column.key == 'download' && item.url"
                variant="ghost"
                icon="download"
                @click="item.onClick"
              />
            </ListRowItem>
          </ListRow>
        </ListRows>
      </ListView>
    </div>
  </div>
</template>
<script setup>
import { createResource } from '../../resources/index.js'
import call from '../../utils/call.js'
import ListView from '../ListView/ListView.vue'
import ListHeader from '../ListView/ListHeader.vue'
import ListRows from '../ListView/ListRows.vue'
import ListRow from '../ListView/ListRow.vue'
import ListRowItem from '../ListView/ListRowItem.vue'
import Badge from '../Badge.vue'
import { computed } from 'vue'
import InvoiceIcon from '../../icons/InvoiceIcon.vue'

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
})

const invoices = createResource({
  url: 'press.saas.api.billing.get_invoices',
  auto: true,
})

const columns = [
  {
    label: 'Invoice',
    key: 'name',
  },
  {
    label: 'Status',
    key: 'status',
    width: 0.8,
  },
  {
    label: 'Period',
    key: 'due_date',
    width: 1.5,
  },
  {
    label: 'Total',
    key: 'total',
    width: 1.2,
  },
  {
    label: '',
    key: 'download',
    width: 0.5,
  },
]

const rows = computed(() => {
  if (!props.team) return []
  return invoices.data?.map((invoice) => {
    // Set name based on invoice type
    let name = 'Prepaid Credits'
    if (invoice.type == 'Subscription') {
      name = new Date(invoice.period_end).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    }

    // Set due date based on invoice type
    let due_date = new Date(invoice.due_date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    if (invoice.type == 'Subscription') {
      let start = new Date(invoice.period_start)
      let end = new Date(invoice.period_end)
      let sameYear = start.getFullYear() === end.getFullYear()
      let formattedStart = sameYear
        ? start.toLocaleString('en-US', { month: 'short', day: 'numeric' })
        : start.toLocaleString('en-US', { dateStyle: 'short' })
      let formattedEnd = end.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      due_date = `${formattedStart} - ${formattedEnd}`
    }

    return {
      name: name,
      status: {
        label: invoice.status,
        color:
          invoice.status === 'Paid'
            ? 'green'
            : invoice.status == 'Unpaid'
              ? 'yellow'
              : 'gray',
      },
      due_date: due_date,
      total: formatCurrency(invoice.total),
      download: {
        url: invoice.invoice_pdf,
        onClick: () => downloadInvoice(invoice.name),
      },
    }
  })
})

function downloadInvoice(invoice) {
  call('press.saas.api.billing.download_invoice', { name: invoice })
}

function formatCurrency(value) {
  if (value === 0) {
    return ''
  }
  return userCurrency(value)
}

function currency(value, currency, fractions = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: fractions,
  }).format(value)
}

function userCurrency(value, fractions = 2) {
  return currency(value, props.team?.currency, fractions)
}
</script>
