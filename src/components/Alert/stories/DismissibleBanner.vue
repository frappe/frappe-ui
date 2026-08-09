<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// An info banner with one action and a × button in the corner.
const showTrialBanner = ref(true)

function openBilling() {
  console.log('open billing page')
}
</script>

<template>
  <div class="w-full max-w-sm">
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
      class="text-sm text-ink-gray-5 underline"
      @click="showTrialBanner = true"
    >
      Bring the banner back
    </button>
  </div>
</template>
