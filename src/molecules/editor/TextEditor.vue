<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const LegacyTextEditor = defineAsyncComponent(() => import('@components/TextEditor/TextEditor.vue'))
</script>

<template>
  <LegacyTextEditor v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </LegacyTextEditor>
</template>
