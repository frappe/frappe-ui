<script setup lang="ts">
import { ref } from "vue";
import Alert from "./Alert.vue";
import Button from "../Button/Button.vue";
import LucideBadge from "~icons/lucide/badge-info";

const visible = ref(true);
</script>

<template>
  <div class="grid gap-5">
    <Alert
      title="Source successfully added"
      description="Discover the new feature to enhance your experience. See how it can help you."
      theme="green"
    />

    <Alert
      title="Source successfully added"
      description="Discover the new feature to enhance your experience. See how it can help you."
      theme="yellow"
    />

    <Alert
      title="Source successfully added"
      description="Discover the new feature to enhance your experience. See how it can help you."
      theme="red"
    />

    <Alert
      title="Source successfully added"
      description="Discover the new feature to enhance your experience. See how it can help you."
      theme="blue"
    />

    <div class="grid gap-3">
      <Button variant="solid" @click="visible = !visible">
        Toggle Alert
      </Button>

      <Alert
        v-model="visible"
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
      />
    </div>

    <Alert
      title="Your trial ends soon!"
      variant="outline"
      description="Upgrade to keep enjoying features and future technical support."
    >
      <template #icon>
        <LucideBadge class="size-4" />
      </template>

      <template #footer>
        <Button class="col-span-full" variant="solid"> Update now </Button>
      </template>
    </Alert>
  </div>
</template>
