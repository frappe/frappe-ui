<script setup lang="ts">
import { RadioGroup, Radio, Switch, Select } from 'frappe-ui'

const coffees = ['Espresso', 'Cappuccino', 'Americano', 'Frappe']
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

// Rules 1 and 4 show misuse (multiple selected, uneven gaps) that a correct
// RadioGroup can't express, so those rows are drawn as plain radio look-alikes.
const dot =
  'grid size-3.5 shrink-0 place-items-center rounded-full bg-surface-gray-10'
const ring = 'size-3.5 shrink-0 rounded-full border border-outline-gray-4'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. One selection only -->
    <Guideline caption="Use radio buttons to let users select a single option.">
      <template #do>
        <RadioGroup :model-value="'Cappuccino'">
          <Radio v-for="c in coffees" :key="c" :value="c" :label="c" />
        </RadioGroup>
      </template>
      <template #dont>
        <div class="flex flex-col gap-2">
          <div v-for="c in coffees" :key="c" class="flex items-center gap-2">
            <span :class="c === 'Espresso' || c === 'Frappe' ? dot : ring">
              <span
                v-if="c === 'Espresso' || c === 'Frappe'"
                class="size-1 rounded-full bg-white"
              />
            </span>
            <span class="text-base text-ink-gray-8">{{ c }}</span>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. Switch for a single on/off setting -->
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

    <!-- 3. Long lists belong in a Select -->
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

    <!-- 4. Even spacing -->
    <Guideline caption="Keep the spacing between radio items consistent.">
      <template #do>
        <RadioGroup :model-value="'Cappuccino'">
          <Radio v-for="c in coffees" :key="c" :value="c" :label="c" />
        </RadioGroup>
      </template>
      <template #dont>
        <div class="flex flex-col">
          <div
            v-for="(c, i) in coffees"
            :key="c"
            class="flex items-center gap-2"
            :class="['mt-0', 'mt-1', 'mt-4', 'mt-1.5'][i]"
          >
            <span :class="c === 'Cappuccino' ? dot : ring">
              <span
                v-if="c === 'Cappuccino'"
                class="size-1 rounded-full bg-white"
              />
            </span>
            <span class="text-base text-ink-gray-8">{{ c }}</span>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
