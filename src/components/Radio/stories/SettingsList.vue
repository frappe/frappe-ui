<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from 'frappe-ui'

const notify = ref('all')
</script>

<template>
  <RadioGroup v-model="notify" padded class="w-96">
    <Radio value="all" label="All new emails" />
    <Radio
      value="important"
      label="Important emails only"
      description="Only emails where you're mentioned or assigned."
    />
    <Radio value="off" label="Mail notifications off" disabled />
  </RadioGroup>
</template>
