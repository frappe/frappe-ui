<script setup>
import PlaygroundApp from './playground/PlaygroundApp.vue'
import PlaygroundV2App from './playground/v2/PlaygroundV2App.vue'

const isV2 = window.location.pathname.replace(/\/+$/, '') === '/v2'
</script>

<template>
  <PlaygroundV2App v-if="isV2" />
  <PlaygroundApp v-else />
</template>
