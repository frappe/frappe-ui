<template>
  <div>
    <component v-for="dialog in dialogs" :is="dialog"></component>
  </div>
</template>
<script setup>
import { dialogs } from '../utils/confirmDialog.js'
</script>
