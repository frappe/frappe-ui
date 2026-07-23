<script setup lang="ts">
import { Button } from 'frappe-ui'
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
    <div class="space-y-6">
      <div class="space-y-2">
        <p class="text-base text-ink-gray-5">Frappe UI</p>
        <h1 class="text-4xl font-semibold text-ink-gray-9">
          Build your Vue app with Frappe UI
        </h1>
        <p class="max-w-xl text-base leading-6 text-ink-gray-6">
          This starter includes TypeScript, Vue, Vite, Tailwind, and Frappe UI.
        </p>
      </div>

      <Button
        label="Get started"
        theme="blue"
        variant="solid"
        @click="() => undefined"
      />
    </div>
  </main>
</template>
