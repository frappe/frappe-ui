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
          icon="lucide-trash-2"
          title="Conversation deleted"
          :primary-action="{ label: 'Undo', theme: 'blue' }"
        />
      </template>
      <template #dont>
        <Alert icon="lucide-trash-2" title="Conversation deleted" />
      </template>
    </Guideline>

    <!-- 3. Reserve alerts for things worth attention -->
    <Guideline
      layout="stack"
      caption="Use alerts only when you want to bring the user's attention to something."
    >
      <template #do>
        <Alert
          :icon="false"
          title="A newer version is available."
          :primary-action="{ label: 'Update', theme: 'blue' }"
        />
      </template>
      <template #dont>
        <Alert
          :icon="false"
          title="You have 8 draft invoices."
          :primary-action="{ label: 'View', theme: 'blue' }"
        />
      </template>
    </Guideline>
  </div>
</template>
