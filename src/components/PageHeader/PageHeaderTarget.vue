<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { registerTarget, unregisterTarget } from './target'

const el = useTemplateRef<HTMLElement>('el')

onMounted(() => el.value && registerTarget(el.value))
onBeforeUnmount(() => el.value && unregisterTarget(el.value))

// The shell that renders this reads `el` and provides it to its subtree, so a
// header inside the shell finds its own target rather than the newest one in
// the registry (SHELL-Q3). Internal.
defineExpose({ el })
</script>
