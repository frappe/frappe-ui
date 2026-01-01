<script setup lang="ts">
import { reactive } from "vue";
import { Switch } from "frappe-ui";
import Story from "@/components/Story.vue";

const state = reactive({
  size: "sm",
  label: "Enable Notifications",
  disabled: false,
  modelValue: false,
});
const sizes = ["sm", "md"];
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <Story title="Default Switch">
      <Switch />
    </Story>

    <Story title="Bound Switch">
      <Switch v-bind="state" />
    </Story>

    <Story title="With Description">
      <Switch
        v-bind="state"
        description="Get notified when something happens."
      />
			<br/>
      <Switch v-bind="state" icon="inbox" description="This has an icon." />
    </Story>

    <Story title="Different Sizes" preview-css='flex items-center gap-2'>
      <Switch size="sm" />
      <Switch size="md" />
    </Story>

    <Story title="Disabled">
      <Switch v-bind="state" :disabled="true" />
      <Switch
        v-bind="state"
        description="This is a description."
        :disabled="true"
      />
    </Story>

    <Story title="Custom Label Font">
      <Switch
        v-bind="state"
        label-classes="font-normal"
        description="This switch has a normal font."
      />
    </Story>
  </div>
</template>
