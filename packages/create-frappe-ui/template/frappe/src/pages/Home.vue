<script setup lang="ts">
import { Button, ErrorMessage, useCall } from 'frappe-ui'

const ping = useCall<string>({
  url: 'ping',
  method: 'POST',
  immediate: false,
})
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
    <div class="space-y-6">
      <div class="space-y-2">
        <p class="text-base text-ink-gray-5">Frappe UI</p>
        <h1 class="text-4xl font-semibold text-ink-gray-9">
          Build your Frappe frontend with Vue
        </h1>
        <p class="max-w-xl text-base leading-6 text-ink-gray-6">
          This starter includes TypeScript, Vue, Vite, Tailwind, the Frappe UI
          plugin, and a backend request example.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Button
          label="Ping Frappe"
          theme="blue"
          variant="solid"
          :loading="ping.loading"
          @click="ping.submit()"
        />
        <span v-if="ping.data" class="text-base text-ink-green-5">
          {{ ping.data }}
        </span>
      </div>

      <ErrorMessage :message="ping.error?.message" />
    </div>
  </main>
</template>
