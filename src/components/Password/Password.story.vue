
<script setup lang="ts">
import { ref } from 'vue'
import { Password } from './index'

const value = ref('')
</script>

<template>
  <div class="p-2 w-[500px]">
    <Password v-model="value" />
  </div>
</template>
