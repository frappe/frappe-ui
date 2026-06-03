<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'

const sm = ref('on')
const md = ref('on')
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <Radio v-model="sm" name="size-sm" value="on" size="sm" label="Small" />
    <Radio v-model="md" name="size-md" value="on" size="md" label="Medium" />
  </div>
</template>
