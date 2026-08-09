<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// An info banner with one action and a × button in the corner.
const showTrialBanner = ref(true)
const status = ref('')

function openBilling() {
  status.value = 'Billing page opened'
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Alert
      v-if="showTrialBanner"
      title="Your trial ends soon!"
      description="Upgrade to keep enjoying features and future technical support."
      theme="blue"
      dismissible
      :primary-action="{ label: 'Update now', onClick: openBilling }"
      @dismiss="showTrialBanner = false"
    />
    <button
      v-else
      class="self-start text-sm text-ink-gray-5 underline"
      @click="showTrialBanner = true"
    >
      Bring the banner back
    </button>
    <p v-if="status" class="text-sm text-ink-gray-5">{{ status }}</p>
  </div>
</template>
