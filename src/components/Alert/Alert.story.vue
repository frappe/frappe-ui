<script setup lang="ts">
import { ref } from "vue";
import Alert from "./Alert.vue";
import Button from "../Button/Button.vue";
import LucideBadge from "~icons/lucide/badge-info";

const visible = ref(true);
</script>

<template>
  <Story :layout='{ width: 500, type: "grid" }'>
    <Variant title="Success">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="green"
      />
    </Variant>

    <Variant title="Warning">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="yellow"
      />
    </Variant>

    <Variant title="Error">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="red"
      />
    </Variant>

    <Variant title="Info">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="blue"
      />
    </Variant>

    <Variant title="Controlled State">
      <div>
        <Button
          variant="solid"
          class="mb-3"
          @click="visible = !visible"
        >
          Toggle Alert
        </Button>

        <Alert
          v-model="visible"
          title="Source successfully added"
          description="Discover the new feature to enhance your experience. See how it can help you."
        />
      </div>
    </Variant>

    <Variant title="Custom Slots">
      <Alert
        title="Your trial ends soon!"
        variant="outline"
        description="Upgrade to keep enjoying features and future technical support."
      >
        <template #icon>
          <LucideBadge class="size-4" />
        </template>

        <template #footer>
          <Button class="col-span-full" variant="solid"> Update now</Button>
        </template>
      </Alert>
    </Variant>
  </Story>
</template>
