<script setup lang="ts">
import { RadioGroup, Radio, Switch, Select } from 'frappe-ui'

const countries = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Switch for a single on/off setting -->
    <Guideline
      caption="For enabling or disabling a single setting, use a switch instead."
    >
      <template #do>
        <Switch :model-value="false" label="Notifications" />
      </template>
      <template #dont>
        <RadioGroup :model-value="'off'">
          <Radio value="on" label="Notifications on" />
          <Radio value="off" label="Notifications off" />
        </RadioGroup>
      </template>
    </Guideline>

    <!-- 2. Long lists belong in a Select -->
    <Guideline
      caption="When there are many options, use a Select instead of a long radio list."
    >
      <template #do>
        <Select
          :model-value="''"
          :options="countries"
          placeholder="Country"
          class="w-40"
        />
      </template>
      <template #dont>
        <RadioGroup :model-value="'United States'">
          <Radio v-for="c in countries" :key="c" :value="c" :label="c" />
        </RadioGroup>
      </template>
    </Guideline>
  </div>
</template>
