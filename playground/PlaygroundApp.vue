<template>
  <div class="h-screen">
    <EspressoLayout />
  </div>
</template>

<script setup lang="ts">
import { useColorScheme } from '../src'
import EspressoLayout from './EspressoLayout.vue'

// Drives `<html data-theme>`, so every Espresso token on the page flips.
// The designs are light, so every load starts light, even if dark was
// picked last time; `?theme=dark` opens it dark.
const params = new URLSearchParams(window.location.search)
const { setColorScheme } = useColorScheme()
setColorScheme(params.get('theme') === 'dark' ? 'dark' : 'light')
</script>
