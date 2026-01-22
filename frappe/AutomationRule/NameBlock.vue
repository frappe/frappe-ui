<template>
  <BaseBlock icon="title" title="Title" :maximize-left-side="true">
    <template #meta class="">
      <FormControl
        variant="outline"
        placeholder="Name your Automation"
        class="w-full"
        v-model="title"
      />
    </template>
  </BaseBlock>
</template>

<script setup lang="ts">
import FormControl from '../../src/components/FormControl/FormControl.vue'
import BaseBlock from './BaseBlock.vue'

const title = defineModel<string>()
</script>

<style scoped></style>
