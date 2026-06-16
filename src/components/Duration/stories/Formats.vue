<script setup lang="ts">
import { ref } from 'vue'
import { Duration } from 'frappe-ui'

const value = ref<number | null>(7323)
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Duration v-model="value" format="short" label="short (default)" />
    <Duration v-model="value" format="long" label="long" />
    <Duration v-model="value" format="colon" label="colon" />
    <Duration v-model="value" format="h'h' m'm' s's'" label="template: h'h' m'm' s's'" />
    <Duration v-model="value" format="hh:mm:ss" label="template: hh:mm:ss" />
  </div>
</template>
