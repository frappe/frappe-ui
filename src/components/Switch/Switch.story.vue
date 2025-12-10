<script setup lang="ts">
import { reactive } from "vue";
import Switch from "./Switch.vue";

const state = reactive({
  size: "sm",
  label: "Enable Notifications",
  disabled: false,
  modelValue: false,
});
const sizes = ["sm", "md"];
</script>

<template>
  <div class="grid gap-6" style="width: 300px">
    <Switch />
    <Switch v-bind="state" />
    <div class="flex flex-col gap-2">
      <Switch
        v-bind="state"
        description="Get notified when something happens."
      />
      <Switch v-bind="state" icon="inbox" description="This has an icon." />
    </div>
    <div class="flex flex-col gap-2">
      <Switch v-bind="state" size="sm" />
      <Switch v-bind="state" size="md" />
    </div>
    <div class="flex flex-col gap-2">
      <Switch v-bind="state" :disabled="true" />
      <Switch
        v-bind="state"
        description="This is a description."
        :disabled="true"
      />
    </div>
    <Switch
      v-bind="state"
      label-classes="font-normal"
      description="This switch has a normal font."
    />
  </div>
</template>
