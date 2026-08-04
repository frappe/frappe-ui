<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from 'frappe-ui'

// Each state needs its own group — within one group only a single option can
// be selected, which is the whole point of a radio.
const unselected = ref('')
const selected = ref('on')
const disabled = ref('')
const disabledSelected = ref('on')
</script>

<template>
  <div class="flex flex-col gap-3 items-start">
    <RadioGroup v-model="unselected">
      <Radio value="on" label="Unselected" />
    </RadioGroup>
    <RadioGroup v-model="selected">
      <Radio value="on" label="Selected" />
    </RadioGroup>
    <RadioGroup v-model="disabled" disabled>
      <Radio value="on" label="Disabled" />
    </RadioGroup>
    <RadioGroup v-model="disabledSelected" disabled>
      <Radio value="on" label="Disabled selected" />
    </RadioGroup>
  </div>
</template>
