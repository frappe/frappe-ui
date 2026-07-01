<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { registerTarget, unregisterTarget } from './target'

const el = useTemplateRef<HTMLElement>('el')

onMounted(() => el.value && registerTarget(el.value))
onBeforeUnmount(() => el.value && unregisterTarget(el.value))
</script>
