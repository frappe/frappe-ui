<script setup lang="ts">
import { Checkbox, RadioGroup, Radio, Switch } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Say what the checkbox turns on. A bare "Enabled" leaves people
         guessing what it enables. -->
    <Guideline
      layout="stack"
      caption="Label a checkbox with what it turns on, like “Email me when I'm mentioned”, not “Enabled”."
    >
      <template #do>
        <Checkbox :model-value="true" label="Email me when I'm mentioned" />
      </template>
      <template #dont>
        <Checkbox :model-value="true" label="Enabled" />
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
        <!-- Radio rows are 21px on a 27px pitch, checkbox rows 15px. The gap
             and the 3px above and below make this column the radio group's
             48px and put each checkbox row's centre on its radio's, so
             Private and Public line up across the two sides. -->
        <div class="flex flex-col gap-3 py-[3px]">
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

    <!-- 4. A negative label makes the unchecked state a double negative:
         unchecked "Don't email me updates" means "do email me". Both are
         unchecked here, so the reader has to work out the second one. -->
    <Guideline
      layout="stack"
      caption="Phrase the label positively, like “Email me updates”, not “Don't email me updates”."
    >
      <template #do>
        <Checkbox :model-value="false" label="Email me product updates" />
      </template>
      <template #dont>
        <Checkbox :model-value="false" label="Don't email me product updates" />
      </template>
    </Guideline>
  </div>
</template>
