<script setup lang="ts">
import { ref } from 'vue'
import { Button, TextInput, Select, Checkbox, Switch } from 'frappe-ui'

// Live controls to tab through. Each renders a native focusable element, so
// the global :focus-visible ring fires on keyboard focus.
const text = ref('')
const choice = ref('One')
const checked = ref(true)
const enabled = ref(true)

// Literal class strings on purpose: the focus-ring utilities are registered
// via `addComponents`, so Tailwind's JIT only emits them when it scans the
// exact class name in source. A computed `focus-ring-${name}` would never be
// generated, so the colored variants previously rendered nothing.
const RINGS = [
  { label: 'focus-ring', variable: '--focus-default', ringClass: 'focus-ring' },
  {
    label: 'focus-ring-red',
    variable: '--focus-red',
    ringClass: 'focus-ring-red',
  },
  {
    label: 'focus-ring-green',
    variable: '--focus-green',
    ringClass: 'focus-ring-green',
  },
  {
    label: 'focus-ring-amber',
    variable: '--focus-amber',
    ringClass: 'focus-ring-amber',
  },
  {
    label: 'focus-ring-blue',
    variable: '--focus-blue',
    ringClass: 'focus-ring-blue',
  },
  {
    label: 'focus-ring-violet',
    variable: '--focus-violet',
    ringClass: 'focus-ring-violet',
  },
] as const
</script>

<template>
  <div class="grid gap-10">
    <div class="flex flex-wrap items-center gap-4">
      <Button label="Button" />
      <TextInput v-model="text" placeholder="Text input" />
      <Select v-model="choice" :options="['One', 'Two', 'Three']" />
      <Checkbox v-model="checked" label="Checkbox" />
      <Switch v-model="enabled" label="Switch" />
    </div>

    <div class="grid gap-4">
      <p class="text-p-sm text-ink-gray-6 m-0">
        Retheme a ring with
        <code class="text-ink-gray-8"
          >focus-visible:focus-ring-&lt;color&gt;</code
        >
        like red for errors or green for success.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-7">
        <div v-for="ring in RINGS" :key="ring.label" class="grid gap-3">
          <div
            class="h-16 rounded-md bg-surface-base"
            :class="ring.ringClass"
          ></div>
          <div class="grid gap-0.5">
            <span class="text-2xs font-mono text-ink-gray-7">{{
              ring.label
            }}</span>
            <span class="text-2xs font-mono text-ink-gray-5">{{
              ring.variable
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
