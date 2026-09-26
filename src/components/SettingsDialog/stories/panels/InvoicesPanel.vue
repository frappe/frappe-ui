<script setup lang="ts">
import { Badge, Button, SettingsBody, SettingsHeader } from 'frappe-ui'

const invoices = [
  { id: 'INV-2026-009', date: '12 Sep 2026', amount: '$224.00', status: 'Due' },
  {
    id: 'INV-2026-008',
    date: '12 Aug 2026',
    amount: '$224.00',
    status: 'Paid',
  },
  {
    id: 'INV-2026-007',
    date: '12 Jul 2026',
    amount: '$216.00',
    status: 'Paid',
  },
  {
    id: 'INV-2026-006',
    date: '12 Jun 2026',
    amount: '$216.00',
    status: 'Paid',
  },
  {
    id: 'INV-2026-005',
    date: '12 May 2026',
    amount: '$200.00',
    status: 'Paid',
  },
  {
    id: 'INV-2026-004',
    date: '12 Apr 2026',
    amount: '$200.00',
    status: 'Paid',
  },
]
</script>

<template>
  <SettingsHeader
    title="Invoices"
    description="Download past invoices for your records."
  />
  <SettingsBody>
    <div class="mt-4 divide-y divide-outline-gray-1">
      <div
        v-for="invoice in invoices"
        :key="invoice.id"
        class="flex items-center gap-4 py-2.5"
      >
        <div class="min-w-0 flex-1">
          <div class="text-base text-ink-gray-8">{{ invoice.date }}</div>
          <div class="text-sm text-ink-gray-5">{{ invoice.id }}</div>
        </div>
        <Badge :theme="invoice.status === 'Paid' ? 'green' : 'amber'">
          {{ invoice.status }}
        </Badge>
        <span class="w-20 text-right text-base tabular-nums text-ink-gray-8">
          {{ invoice.amount }}
        </span>
        <Button
          variant="ghost"
          icon="lucide-download"
          :label="`Download ${invoice.id}`"
          :tooltip="`Download ${invoice.id}`"
        />
      </div>
    </div>
  </SettingsBody>
</template>
