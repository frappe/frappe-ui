<script setup lang="ts">
import { ref } from 'vue'
import ErrorMessage from './ErrorMessage.vue'

const message = ref('Invalid value')
const error = new Error('There was an error')
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }" autoPropsDisabled>
    <Variant title="String message">
      <ErrorMessage :message="message" />
    </Variant>

    <Variant title="Error object">
      <ErrorMessage :message="error" />

      <template #source>
        <textarea v-pre>
          <ErrorMessage :message="Error('There was an error')" />
        </textarea>
      </template>
    </Variant>

    <Variant title="Falsy value">
      <ErrorMessage message="" />
    </Variant>
  </Story>
</template>
