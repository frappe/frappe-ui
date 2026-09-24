<script setup lang="ts">
import { Popover } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-1.5 text-base text-ink-gray-8">
    Billing email
    <Popover side="right" arrow>
      <template #trigger>
        <button
          type="button"
          class="grid size-5 place-items-center rounded-full text-ink-gray-5 hover:bg-surface-gray-2"
          aria-label="About billing email"
        >
          <span class="lucide-circle-help size-4" aria-hidden="true" />
        </button>
      </template>
      <template #default>
        <p class="w-60 p-3 text-p-sm text-ink-gray-7">
          Invoices and payment receipts go to this address. It can differ from
          the account owner's email.
        </p>
      </template>
    </Popover>
  </div>
</template>
