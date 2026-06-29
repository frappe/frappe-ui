<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'

const a = ref('')
const b = ref('on')
const c = ref('')
const d = ref('on')
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <Radio v-model="a" name="state-a" value="on" label="Unselected" />
    <Radio v-model="b" name="state-b" value="on" label="Selected" />
    <Radio v-model="c" name="state-c" value="on" label="Disabled" disabled />
    <Radio
      v-model="d"
      name="state-d"
      value="on"
      label="Disabled selected"
      disabled
    />
  </div>
</template>
