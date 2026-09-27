<script setup lang="ts">
import { Checkbox, RadioGroup, Radio, Switch } from 'frappe-ui'

const meals = ['Espresso', 'Fries', 'Cheesecake']
const coffees = [
  'Espresso',
  'Cappuccino',
  'Frappe',
  'Americano',
  'Latte',
  'Macchiato',
  'Mocha',
  'Affogato',
  'Flat White',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Short, scannable option lists -->
    <Guideline caption="Keep it short and easy to read.">
      <template #do>
        <div class="flex flex-col gap-2">
          <p class="text-base font-medium text-ink-gray-8">Choose your meal</p>
          <Checkbox
            v-for="meal in meals"
            :key="meal"
            :model-value="false"
            :label="meal"
          />
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col gap-2">
          <p class="text-base font-medium text-ink-gray-8">
            Choose your coffee
          </p>
          <Checkbox
            v-for="coffee in coffees"
            :key="coffee"
            :model-value="false"
            :label="coffee"
          />
        </div>
      </template>
    </Guideline>

    <!-- 2. Action-verb labels -->
    <Guideline caption="Use a clear action verb for checkbox labels.">
      <template #do>
        <Checkbox :model-value="false" label="Enable" />
      </template>
      <template #dont>
        <Checkbox :model-value="false" label="Enabled" />
      </template>
    </Guideline>

    <!-- 3. Radio for single-select -->
    <Guideline
      caption="Don't use a checkbox when only one option can be selected — use a radio instead."
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

    <!-- 4. Switch for an immediate on/off setting -->
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
