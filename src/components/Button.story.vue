<script setup lang="ts">
import { ref, reactive } from 'vue'
import Button from './Button.vue'
const state = reactive({
  theme: '',
  size: '',
  label: 'Button',
  loading: false,
  loadingText: null,
  disabled: false,
  link: null,
})
const variants = ['solid', 'subtle', 'outline', 'ghost']
const themes = ['gray', 'blue', 'green', 'red']
const sizes = ['sm', 'md', 'lg', 'xl', '2xl']
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant v-for="variant in variants" :key="variant" :title="variant">
      <div class="p-4">
        <Button :variant="variant">{{ state.label }}</Button>
      </div>
    </Variant>

    <template #controls>
      <!-- <HstText v-model="state.label" title="Content" />
      <HstCheckbox v-model="state.disabled" title="Disabled" /> -->
    </template>
  </Story>
</template>
<docs lang="md">
# Button

The Button component is used to trigger an action such as submitting a form,
opening a Dialog, or canceling an action.
</docs>
