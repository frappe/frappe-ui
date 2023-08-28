<script setup lang="ts">
import { reactive, ref } from 'vue'
import Switch from './Switch.vue'
const state = reactive({
  size: 'sm',
  label: 'Enable Notifications',
  description: 'Get notified when something happens.',
  disabled: false,
  modelValue: false,
})
const checked = ref(false)
const sizes = ['sm', 'md']
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="Label">
      <Switch v-bind="state" v-model="checked" description="" />
    </Variant>
    <Variant title="Label and Description">
      <Switch v-bind="state" v-model="checked" />
    </Variant>

    <template #controls>
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
