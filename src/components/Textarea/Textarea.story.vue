<script setup lang="ts">
import { reactive } from 'vue'
import Textarea from './Textarea.vue'
const state = reactive({
  size: 'sm',
  placeholder: 'Placeholder',
  disabled: false,
  modelValue: '',
  label: 'Label',
})
const sizes = ['sm', 'md', 'lg', 'xl']
const variants = ['subtle', 'outline']
</script>

<template>
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant v-for="type in variants" :key="type" :title="`${type} variant`">
      <div class="p-1">
        <Textarea :variant="type" v-bind="state" />
      </div>
    </Variant>

    <template #controls>
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
