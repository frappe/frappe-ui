<script setup lang="ts">
import { ErrorMessage } from "frappe-ui";

const error = new Error("There was an error");
</script>

<template>
  <ErrorMessage :message="error">
    <template #source>
      <textarea v-pre>
        <ErrorMessage :message="Error('There was an error')" />
      </textarea>
    </template>
  </ErrorMessage>
</template>
