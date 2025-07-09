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
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant v-for="shape in shapes" :key="shape" :title="shape">
      <Avatar :shape="shape" v-bind="state" />
    </Variant>
    <Variant v-for="shape in shapes" :key="shape" :title="shape">
      <Avatar :shape="shape" v-bind="state" :image="null" />
    </Variant>

    <template #controls>
      <HstText v-model="state.label" title="Label" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
