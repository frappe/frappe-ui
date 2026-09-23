<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  toast,
  useColorScheme,
} from 'frappe-ui'

const { resolvedColorScheme, toggleColorScheme } = useColorScheme()

const name = ref('')

function sayHello() {
  toast.success(`Hello, ${name.value.trim() || 'there'}!`)
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="__TITLE__" />
    <div class="flex items-center gap-2">
      <Button
        :icon="resolvedColorScheme === 'dark' ? 'lucide-sun' : 'lucide-moon'"
        :tooltip="resolvedColorScheme === 'dark' ? 'Light mode' : 'Dark mode'"
        aria-label="Switch light and dark mode"
        @click="toggleColorScheme"
      />
      <Button
        icon-left="lucide-book-open"
        label="Docs"
        href="https://ui.frappe.io"
      />
    </div>
  </PageHeader>

  <div class="mx-auto max-w-[770px] space-y-6 px-3 pb-10 pt-8 sm:px-5">
    <div class="space-y-2">
      <h1 class="text-2xl-semibold text-ink-gray-9">Your app is ready</h1>
      <p class="text-p-base text-ink-gray-7">
        Edit
        <code class="rounded-1 bg-surface-gray-2 px-1 py-0.5 font-mono text-sm"
          >src/pages/Home.vue</code
        >
        to start building.
      </p>
    </div>

    <form
      class="flex items-end gap-2 rounded-6 border border-outline-gray-1 p-4"
      @submit.prevent="sayHello"
    >
      <FormControl
        v-model="name"
        class="flex-1"
        label="Your name"
        placeholder="Ada"
      />
      <Button
        type="submit"
        variant="solid"
        icon-left="lucide-hand"
        label="Say hello"
      />
    </form>
  </div>
</template>
