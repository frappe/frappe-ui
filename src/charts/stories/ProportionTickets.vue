<script setup lang="ts">
import { ProportionBar } from 'frappe-ui/charts'

// Not sorted: a queue is read in the order a ticket moves through it, and the
// largest state is the last one.
const ticketsByState = [
  { state: 'Open', tickets: 128 },
  { state: 'Waiting on customer', tickets: 64 },
  { state: 'Resolved', tickets: 412 },
]

const count = (value: number) => `${value.toLocaleString('en-US')} tickets`
</script>

<template>
  <div class="flex h-full min-h-52 w-full items-center justify-center">
    <div class="w-full max-w-md">
      <ProportionBar
        :data="ticketsByState"
        category="state"
        value="tickets"
        :format="count"
        title="Support queue"
        subtitle="604 tickets this week"
      />
    </div>
  </div>
</template>
