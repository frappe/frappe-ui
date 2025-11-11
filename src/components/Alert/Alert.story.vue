<script setup lang="ts">
import Alert from "./Alert.vue";
</script>

<template>
  <Story :layout='{ width: 500, type: "grid" }'>
    <Variant title="Success">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="success"
      />
    </Variant>

    <Variant title="Warning">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="warning"
      />
    </Variant>

    <Variant title="Error">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="error"
      />
    </Variant>

    <Variant title="Info">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        theme="info"
      />
    </Variant>

    <Variant title="Dismiss">
      <Alert
        title="Source successfully added"
        description="Discover the new feature to enhance your experience. See how it can help you."
        :dismissable="false"
      />
    </Variant>
  </Story>
</template>
