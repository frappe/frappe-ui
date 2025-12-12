<script setup lang="ts">
import Story from "../Story.vue";
import ErrorMessage from "./ErrorMessage.vue";
import { ref } from "vue";

const message = ref("Invalid value");
const error = new Error("There was an error");
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story
      title="String message"
      :layout='{ width: 500, type: "grid" }'
      autoPropsDisabled
    >
      <ErrorMessage :message="message" />
    </Story>

    <Story
      title="Error object"
      :layout='{ width: 500, type: "grid" }'
      autoPropsDisabled
    >
      <ErrorMessage :message="error">
        <template #source>
          <textarea
            v-pre
          >
            <ErrorMessage :message="Error('There was an error')" />
          </textarea>
        </template>
      </ErrorMessage>
    </Story>

    <Story
      title="Falsy value"
      :layout='{ width: 500, type: "grid" }'
      autoPropsDisabled
    >
      <ErrorMessage message="" />
    </Story>
  </div>
</template>
