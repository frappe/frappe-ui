<script setup lang="ts">
import Story from "../Story.vue";
import FileUploader from "./FileUploader.vue";
import { Button } from "../Button";

const validateFileFunction = (fileObject: File) => {};
const onSuccess = (file: File) => {};
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <Story :layout='{ width: 500, type: "grid" }'>
      <FileUploader
        :fileTypes='["image/*"]'
        :validateFile="validateFileFunction"
        @success="onSuccess"
      >
        <template
          v-slot="
            {
              file,
              uploading,
              progress,
              uploaded,
              message,
              error,
              total,
              success,
              openFileSelector,
            }
          "
        >
          <Button @click="openFileSelector" :loading="uploading">
            {{
              uploading
                ? `Uploading ${progress}%`
                : "Upload Image"
            }}
          </Button>
        </template>
      </FileUploader>
    </Story>
  </div>
</template>
