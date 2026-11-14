<script setup lang="ts">
import { Alert } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Short, actionable copy -->
    <Guideline
      layout="stack"
      caption="State the reason for the alert and what to do next in a short sentence."
    >
      <template #do>
        <Alert
          theme="red"
          title="Upload failed"
          description="File exceeds 25 MB. Compress it or choose a smaller file."
        />
      </template>
      <template #dont>
        <Alert
          theme="red"
          title="Upload failed"
          description="This file couldn't be uploaded because it's larger than the 25 MB limit for this workspace. Try compressing it or selecting a different file."
        />
      </template>
    </Guideline>

    <!-- 2. Offer the obvious next action -->
    <Guideline
      layout="stack"
      caption="Include a direct action button when there's an obvious next step."
    >
      <template #do>
        <Alert
          theme="amber"
          title="Your trial ends in 3 days"
          :primary-action="{ label: 'Upgrade' }"
        />
      </template>
      <template #dont>
        <Alert theme="amber" title="Your trial ends in 3 days" />
      </template>
    </Guideline>

    <!-- 3. Finished action: toast, not alert. A real toast floats in the page
         corner (vue-sonner), so the "do" side reproduces ToastProvider's toast
         classes inline to set its style next to the alert's. -->
    <Guideline
      layout="stack"
      caption="Use a toast to confirm a finished action, like saving. Use an alert for an ongoing issue, like a failed payment."
    >
      <template #do>
        <div
          class="flex w-[360px] items-center rounded-5 bg-surface-gray-9 px-4 py-2.5 shadow-xl"
        >
          <span class="lucide-circle-check mr-2 size-4 text-ink-base" />
          <span class="text-p-base font-medium text-ink-base">
            Settings saved
          </span>
          <span
            class="lucide-x ml-auto size-4 text-ink-base"
            aria-hidden="true"
          />
        </div>
      </template>
      <template #dont>
        <Alert theme="green" title="Settings saved" dismissible />
      </template>
    </Guideline>

    <!-- 4. A problem that is still live, like a failed payment on Frappe
         Cloud, stays until it is fixed. -->
    <Guideline
      layout="stack"
      caption="Don't make an alert dismissible while the problem it reports still exists."
    >
      <template #do>
        <div class="w-[440px]">
          <Alert
            theme="red"
            title="Payment failed"
            description="Your site will be suspended on Oct 3 unless you update your card."
            :primary-action="{ label: 'Update card' }"
          />
        </div>
      </template>
      <template #dont>
        <div class="w-[440px]">
          <Alert
            theme="red"
            title="Payment failed"
            description="Your site will be suspended on Oct 3 unless you update your card."
            :primary-action="{ label: 'Update card' }"
            dismissible
          />
        </div>
      </template>
    </Guideline>
  </div>
</template>
