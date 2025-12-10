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
  <div class="grid gap-4 w-[500px]">
    <div v-for="type in variants" :key="type">
      <Textarea :variant="type" v-bind="state" />
    </div>
  </div>
</template>
