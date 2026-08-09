<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// Banners stack a description and two actions. A "Dismiss" secondary action
// calls context.dismiss(); the parent hides the alert with v-if.
const showSla = ref(true)
const showSync = ref(true)

function respondNow() {
  console.log('open ticket #58281')
}

function reviewSync() {
  console.log('open sync report')
}

function reviewDuplicate() {
  console.log('open duplicate lead')
}

function continueAnyway() {
  console.log('create lead anyway')
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <Alert
      v-if="showSla"
      title="SLA due soon for #58281"
      description="The SLA for #58281 will breach in 1 hour"
      theme="amber"
      :primary-action="{ label: 'Respond now', onClick: respondNow }"
      :secondary-action="{ label: 'Dismiss', onClick: ({ dismiss }) => dismiss() }"
      @dismiss="showSla = false"
    />
    <Alert
      v-if="showSync"
      title="Sync completed with issues"
      description="96 of 100 contacts were synced."
      theme="amber"
      :primary-action="{ label: 'Review', onClick: reviewSync }"
      :secondary-action="{ label: 'Dismiss', onClick: ({ dismiss }) => dismiss() }"
      @dismiss="showSync = false"
    />
    <Alert
      title="Duplicate lead detected"
      description="A similar lead already exists."
      theme="amber"
      :primary-action="{ label: 'Review duplicate', onClick: reviewDuplicate }"
      :secondary-action="{ label: 'Continue anyway', onClick: continueAnyway }"
    />
    <button
      v-if="!showSla || !showSync"
      class="self-start text-sm text-ink-gray-5 underline"
      @click="((showSla = true), (showSync = true))"
    >
      Bring the banners back
    </button>
  </div>
</template>
