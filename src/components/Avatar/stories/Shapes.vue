<script setup lang="ts">
import { Avatar } from 'frappe-ui'

const url = 'https://avatars.githubusercontent.com/u/499550?s=60&v=4'
</script>

<template>
  <Avatar :image="url" size="lg" />
  <Avatar :image="url" size="lg" shape="square" />
  <Avatar label="EY" size="lg" />
  <Avatar label="EY" size="lg" shape="square" />
</template>
