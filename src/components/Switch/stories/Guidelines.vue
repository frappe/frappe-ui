<script setup lang="ts">
import { Switch, RadioGroup, Radio, Divider } from 'frappe-ui'

const stock = ['Disable', 'Allow alternative', 'Maintain stock']
const delivery = ['Home delivery', 'Store pickup', 'Locker pickup']

// Annotation pill for the touch-target diagram.
const annot =
  'rounded-full bg-surface-gray-2 px-2.5 py-1 text-sm text-ink-gray-6 whitespace-nowrap'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. In a cell, only the switch is interactive (do-only) -->
    <Guideline
      caption="Only the switch will be touch target when it's used in a cell."
    >
      <template #do>
        <div class="flex flex-col items-center py-4">
          <!-- top annotation -->
          <span :class="annot">Not a touch target</span>
          <Divider orientation="vertical" class="h-7" />

          <!-- the settings cell -->
          <div
            class="flex w-[420px] items-center justify-between gap-4 rounded-2 bg-surface-gray-2 p-3"
          >
            <div>
              <p class="text-base font-medium text-ink-gray-8">
                2FA Authentication
              </p>
              <p class="text-sm text-ink-gray-5">
                Manage two-factor authentication and security methods
              </p>
            </div>
            <Switch :model-value="true" />
          </div>

          <!-- bottom annotations: label (not a target) and switch (target) -->
          <div class="relative h-16 w-[460px]">
            <div class="absolute left-9 flex flex-col items-center">
              <Divider orientation="vertical" class="h-7" />
              <span :class="[annot, 'mt-1']">Not a touch target</span>
            </div>
            <div class="absolute right-7 flex flex-col items-center">
              <Divider orientation="vertical" class="h-7" />
              <span :class="[annot, 'mt-1']">Touch target</span>
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. Right-align switches in list rows -->
    <Guideline
      layout="stack"
      caption="The switches should be aligned to the right when used in list items."
    >
      <template #do>
        <div class="flex w-64 flex-col gap-3">
          <div
            v-for="s in stock"
            :key="s"
            class="flex items-center justify-between"
          >
            <span class="text-base text-ink-gray-8">{{ s }}</span>
            <Switch :model-value="false" />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex w-64 flex-col gap-3">
          <div v-for="s in stock" :key="s" class="flex items-center gap-2">
            <span class="text-base text-ink-gray-8">{{ s }}</span>
            <Switch :model-value="false" />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Immediate state changes (do-only) -->
    <Guideline caption="Use switches for immediate state changes.">
      <template #do>
        <div class="flex w-64 flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-base text-ink-gray-8">Email notifications</span>
            <Switch :model-value="false" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-base text-ink-gray-8">Dark mode</span>
            <Switch :model-value="false" />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Not for mutually exclusive choices -->
    <Guideline
      layout="stack"
      caption="Don't use a switch for mutually exclusive choices."
    >
      <template #do>
        <div class="flex flex-col gap-2">
          <p class="text-base font-medium text-ink-gray-8">
            Delivery preferences
          </p>
          <RadioGroup :model-value="'Store pickup'">
            <Radio v-for="d in delivery" :key="d" :value="d" :label="d" />
          </RadioGroup>
        </div>
      </template>
      <template #dont>
        <div class="flex w-64 flex-col gap-2">
          <p class="text-base font-medium text-ink-gray-8">
            Delivery preferences
          </p>
          <div
            v-for="d in delivery"
            :key="d"
            class="flex items-center justify-between"
          >
            <span class="text-base text-ink-gray-8">{{ d }}</span>
            <Switch :model-value="false" />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
