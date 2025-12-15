<script setup lang="ts">
import { ref } from "vue";
import Alert from "./Alert.vue";
import Button from "../Button/Button.vue";
import LucideBadge from "~icons/lucide/badge-info";
import Story from "../Story.vue";

const visible = ref(true);

const themes = ["green", "yellow", "red", "blue"];
</script>

<template>
  <div class="grid gap-5">
    <Story v-for="theme in themes" :title="theme">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        :theme="theme"
      />
    </Story>

    <Story title="Controlled state">
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
    </Story>

    <Story title="Custom Slots">
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
    </Story>
  </div>
</template>
