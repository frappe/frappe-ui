<script setup lang="ts">
import Hero from "./Hero.vue";
import Footer from "./Footer.vue";
import Showcase from "./Showcase/index.vue"
</script>

<template>
  <div class='flex flex-col min-h-screen'>
    <Hero />
		<Showcase/>
		<Footer/>
  </div>
</template>
