<script setup lang="ts">
// The states are the container's and so are the slots over them: an app reaches
// into one without giving up the chart and rebuilding the chrome around it.
import { ref } from 'vue'
import { Button, Skeleton } from 'frappe-ui'
import { BarChart } from 'frappe-ui/charts'

const tickets = [
  { day: 'Mon', received: 128 },
  { day: 'Tue', received: 146 },
  { day: 'Wed', received: 137 },
  { day: 'Thu', received: 152 },
  { day: 'Fri', received: 119 },
]

const error = ref<string | null>('Report timed out after 30s')
const loading = ref(false)

/** What an app does with the slot: run the query again, in place. */
function retry() {
  error.value = null
  loading.value = true
  window.setTimeout(() => (loading.value = false), 1500)
}

const card =
  'flex min-w-0 flex-col rounded-4 border border-outline-gray-1 bg-surface-elevation-2 px-4 py-3'
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
    <section :class="[card, 'h-72']">
      <BarChart
        :data="tickets"
        x="day"
        y="received"
        :error="error"
        :loading="loading"
        title="Tickets received"
        subtitle="Press Retry to run it again"
      >
        <template #error="{ error: message }">
          <span class="text-sm-medium text-ink-red-7">
            Could not render this chart
          </span>
          <span class="max-w-sm text-p-sm text-ink-gray-5">{{ message }}</span>
          <Button label="Retry" size="sm" @click="retry" />
        </template>
      </BarChart>
    </section>

    <!-- A placeholder of the app's own, for a card whose shape it knows better
         than the library does. -->
    <section :class="[card, 'h-72']">
      <BarChart
        :data="tickets"
        x="day"
        y="received"
        loading
        title="Tickets by channel"
        subtitle="An app's own placeholder"
      >
        <template #loading>
          <div class="flex h-full w-full items-end gap-3 pb-6">
            <Skeleton
              v-for="(height, index) in [40, 65, 50, 80, 35]"
              :key="index"
              class="flex-1 rounded-t-4"
              :style="{ height: `${height}%` }"
            />
          </div>
        </template>
      </BarChart>
    </section>
  </div>
</template>
