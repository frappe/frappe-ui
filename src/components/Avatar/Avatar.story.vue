<script setup lang="ts">
import { reactive } from 'vue'
import Avatar from './Avatar.vue'

const state = reactive({
  image: 'https://avatars.githubusercontent.com/u/499550?s=60&v=4',
  label: 'EY',
  size: 'md',
})

const shapes = ['circle', 'square']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
</script>

<template>
  <div class="grid gap-4">
    <div v-for="shape in shapes" :key="shape" class="grid gap-2">
      <Avatar :shape="shape" v-bind="state" />
    </div>

    <div v-for="shape in shapes" :key="shape + '-no-image'" class="grid gap-2">
      <Avatar :shape="shape" v-bind="state" :image="null" />
    </div>
  </div>
</template>
