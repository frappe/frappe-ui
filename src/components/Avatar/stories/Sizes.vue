<script setup lang="ts">
import { Avatar } from 'frappe-ui'

const url = 'https://avatars.githubusercontent.com/u/499550?s=60&v=4'
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
</script>

<template>
  <Avatar :image="url" v-for="size in sizes" :key="size" :size="size" />
</template>
