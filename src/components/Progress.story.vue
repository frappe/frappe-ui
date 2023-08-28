<script setup lang="ts">
import { reactive } from 'vue'
import Progress from './Progress.vue'
const state = reactive({
  size: 'sm',
  value: 50,
})

const sizes = ['sm', 'md', 'lg', 'xl']
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="Label">
      <Progress v-bind="state" label="Progress" />
    </Variant>
    <Variant title="Hint">
      <Progress v-bind="state" label="Progress" :hint="true" />
    </Variant>
    <Variant title="Intervals">
      <Progress
        v-bind="state"
        label="Progress"
        :intervals="true"
        :interval-count="5"
      />
    </Variant>

    <template #controls>
      <HstSlider v-model="state.value" :min="0" :max="100" title="Value" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
