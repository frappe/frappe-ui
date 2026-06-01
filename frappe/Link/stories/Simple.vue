<script setup lang="ts">
import { ref } from 'vue'
import { Link } from 'frappe-ui/frappe'
import { useMockSearchLink, MOCK_USERS } from './_mock'

useMockSearchLink({ User: MOCK_USERS })

const value = ref<string | null>(null)
</script>

<template>
  <div class="w-full gap-3 items-center justify-center !py-20 grid">
    <div class="grid gap-3">
      <Link v-model="value" doctype="User" class="w-64" />

      <div class="text-sm text-ink-gray-5">
        Selected: <code class="text-ink-gray-7">{{ value || 'None' }}</code>
      </div>
    </div>
  </div>
</template>
