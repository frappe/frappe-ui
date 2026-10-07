<script setup>
import PlaygroundApp from './playground/PlaygroundApp.vue'
import PlaygroundV2App from './playground/v2/PlaygroundV2App.vue'

// The V2 playground — the Espresso 2.0 patterns — is the site: `/` and `/v2`
// both open it, so the hosted link lands on the work. The first playground
// stays reachable at `/v1`.
const path = window.location.pathname.replace(/\/+$/, '')
const isV1 = path === '/v1'
</script>

<template>
  <PlaygroundApp v-if="isV1" />
  <PlaygroundV2App v-else />
</template>
