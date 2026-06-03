<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'

const a = ref('on')
const b = ref('on')
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <div class="pl-2">
      <Radio v-model="a" name="variant-default" value="on" label="Default" />
    </div>
    <Radio
      v-model="b"
      name="variant-padded"
      value="on"
      variant="padded"
      label="Padded"
    />
  </div>
</template>
