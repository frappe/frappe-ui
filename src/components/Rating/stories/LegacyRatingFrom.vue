<script setup lang="ts">
import { Rating } from 'frappe-ui'
</script>

<!--
  `rating_from` is deprecated. Use `max` instead. Mounting this story
  fires a one-time `[frappe-ui] Rating.rating_from is deprecated`
  warning in the console.
-->

<template>
  <Rating label="Legacy field" :model-value="3" :rating_from="10" />
</template>
