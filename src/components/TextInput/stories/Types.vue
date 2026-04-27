<script setup lang="ts">
import { TextInput } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-3 items-start w-full max-w-sm">
    <TextInput type="text" placeholder="text" />
    <TextInput type="number" placeholder="number" />
    <TextInput type="email" placeholder="email" />
    <TextInput type="date" placeholder="date" />
    <TextInput type="datetime-local" placeholder="datetime-local" />
    <TextInput type="search" placeholder="search" />
    <TextInput type="tel" placeholder="tel" />
    <TextInput type="time" placeholder="time" />
    <TextInput type="url" placeholder="url" />
  </div>
</template>
