<script setup lang="ts">
import { ref } from "vue";
import Alert from "./Alert.vue";
import Button from "../Button/Button.vue";

let dismissed = ref(false);
</script>

<template>
  <Story :layout='{ width: 500, type: "grid" }'>
    <Variant title="Success">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="success"
        :dismissable="false"
      />
    </Variant>

    <Variant title="Warning">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="warning"
        :dismissable="false"
      />
    </Variant>

    <Variant title="Error">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="error"
        :dismissable="false"
      />
    </Variant>

    <Variant title="Info">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="info"
        :dismissable="false"
      />
    </Variant>

    <Variant title="Dismiss">
      <div>
        <Button v-if='dismissed'  variant="solid" class="mb-3" @click="dismissed = false">
          Show Alert
        </Button>

        <Alert
          v-if="!dismissed"
          title="Source successfully added"
          description="Discover the new feature to enhance your experience. See how it can help you."
          :onClose="() => dismissed = true"
        />
      </div>
    </Variant>
  </Story>
</template>
