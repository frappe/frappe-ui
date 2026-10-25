<script setup lang="ts">
import {
  Badge,
  Button,
  Progress,
  SettingsBody,
  SettingsHeader,
  SettingsRow,
} from 'frappe-ui'

const seats = { used: 28, total: 35 }
</script>

<template>
  <SettingsHeader title="Plan" description="Your subscription and usage." />
  <SettingsBody>
    <div class="flex flex-col gap-8 pt-6">
      <div class="rounded-6 border border-outline-gray-2 p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-semibold text-ink-gray-8">Team</span>
              <Badge theme="blue">Annual</Badge>
            </div>
            <p class="mt-1 text-base text-ink-gray-6">
              $8 per member each month. Renews on 12 March 2027.
            </p>
          </div>
          <Button>Change plan</Button>
        </div>
        <div class="mt-5">
          <div class="flex justify-between text-sm text-ink-gray-6">
            <span>Seats</span>
            <span>{{ seats.used }} of {{ seats.total }} used</span>
          </div>
          <Progress
            class="mt-2"
            :value="(seats.used / seats.total) * 100"
            size="sm"
          />
        </div>
      </div>

      <section>
        <h3 class="text-base font-semibold text-ink-gray-8">Billing details</h3>
        <div class="mt-2 divide-y divide-outline-gray-1">
          <SettingsRow
            title="Payment method"
            description="Visa ending in 4242, expires 08/28."
          >
            <Button>Update</Button>
          </SettingsRow>
          <SettingsRow
            title="Billing email"
            description="billing@example.com receives every invoice."
          >
            <Button>Edit</Button>
          </SettingsRow>
        </div>
      </section>
    </div>
  </SettingsBody>
</template>
