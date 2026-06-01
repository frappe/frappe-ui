<script setup lang="ts">
import { ref } from 'vue'
import { Link } from 'frappe-ui/frappe'
import { useMockSearchLink, MOCK_LOST_REASONS } from './_mock'

useMockSearchLink({ 'CRM Lost Reason': MOCK_LOST_REASONS })

const reason = ref<string | null>(null)
</script>

<template>
  <div class="w-full !py-20 grid place-items-center">
    <div class="grid w-96 gap-6">
      <Link
        v-model="reason"
        doctype="CRM Lost Reason"
        label="Lost reason"
        description="Why was this deal lost?"
        placeholder="Select lost reason"
        required
      />

      <Link
        v-model="reason"
        doctype="CRM Lost Reason"
        label="With error"
        description="Helper text hides when error is set."
        error="Please pick a reason"
      />
    </div>
  </div>
</template>
