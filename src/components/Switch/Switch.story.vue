<script setup lang="ts">
import { reactive } from 'vue'
import Switch from './Switch.vue'
const state = reactive({
  size: 'sm',
  label: 'Enable Notifications',
  disabled: false,
  modelValue: false,
})
const sizes = ['sm', 'md']
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="Plain">
      <Switch />
    </Variant>
    <Variant title="Label">
      <Switch v-bind="state" />
    </Variant>
    <Variant title="Description and icon">
      <div class="flex flex-col gap-2">
        <Switch
          v-bind="state"
          description="Get notified when something happens."
        />
        <Switch v-bind="state" icon="inbox" description="This has an icon." />
      </div>
    </Variant>
    <Variant title="Size ">
      <div class="flex flex-col gap-2">
        <Switch v-bind="state" size="sm" />
        <Switch v-bind="state" size="md" />
      </div>
    </Variant>
    <Variant title="Disabled">
      <div class="flex flex-col gap-2">
        <Switch v-bind="state" :disabled="true" />

        <Switch
          v-bind="state"
          description="This is a description."
          :disabled="true"
        />
      </div>
    </Variant>
    <Variant title="Classes">
      <Switch
        v-bind="state"
        label-classes="font-normal"
        description="This switch has a normal font."
      />
    </Variant>

    <template #controls>
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
