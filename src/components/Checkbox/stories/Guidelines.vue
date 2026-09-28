<script setup lang="ts">
import { Checkbox, RadioGroup, Radio, Switch } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Action-verb labels -->
    <Guideline caption="Use a clear action verb for checkbox labels.">
      <template #do>
        <Checkbox :model-value="false" label="Enable" />
      </template>
      <template #dont>
        <Checkbox :model-value="false" label="Enabled" />
      </template>
    </Guideline>

    <!-- 2. Radio for single-select -->
    <Guideline
      caption="Don't use a checkbox when only one option can be selected. Use a radio instead."
    >
      <template #do>
        <RadioGroup :model-value="'public'">
          <Radio value="private" label="Private" />
          <Radio value="public" label="Public" />
        </RadioGroup>
      </template>
      <template #dont>
        <div class="flex flex-col gap-2">
          <Checkbox :model-value="false" label="Private" />
          <Checkbox :model-value="true" label="Public" />
        </div>
      </template>
    </Guideline>

    <!-- 3. Switch for an immediate on/off setting -->
    <Guideline
      caption="If the setting takes effect immediately, use a switch instead."
    >
      <template #do>
        <Switch :model-value="true" label="Email notifications" />
      </template>
      <template #dont>
        <Checkbox :model-value="true" label="Email notifications" />
      </template>
    </Guideline>
  </div>
</template>
