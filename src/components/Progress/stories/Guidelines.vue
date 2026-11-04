<script setup lang="ts">
import { Progress } from 'frappe-ui'

// These cards point things out rather than mark mistakes, so each shows one
// example with no do/don't mark.

// Card 2: six steps with two done. The bar fills whole segments, so
// 2 of 6 is 33%.
const stepValue = (2 / 6) * 100
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A progress bar only reports a value. For a value people set,
         the component is Slider. -->
    <Guideline
      :mark="false"
      caption="Progress bars are read-only. To let people set a value, use a Slider."
    >
      <template #do>
        <div class="w-64">
          <Progress :value="20" label="Today's progress" />
        </div>
      </template>
    </Guideline>

    <!-- 2. `intervals` splits the bar into one segment per step. -->
    <Guideline
      :mark="false"
      caption="Use a segmented bar, with intervals, when progress moves in steps."
    >
      <template #do>
        <div class="w-64">
          <Progress :value="stepValue" :intervals="6" label="Bank details">
            <template #hint>
              <span class="text-base-medium text-ink-gray-4">Step 2 of 6</span>
            </template>
          </Progress>
        </div>
      </template>
    </Guideline>

    <!-- 3. The label names what the bar measures. -->
    <Guideline
      :mark="false"
      caption="Give the bar a label, so people know what it measures."
    >
      <template #do>
        <div class="w-64">
          <Progress :value="34" label="10.2 GB of 30 GB used" />
        </div>
      </template>
    </Guideline>

    <!-- 4. `hint` shows the percentage; the #hint slot shows any other
         count, like points. -->
    <Guideline
      :mark="false"
      caption="Use the hint to show the percentage, or a count like steps or points."
    >
      <template #do>
        <div class="flex w-64 flex-col gap-6">
          <Progress :value="52" label="Storage" hint />
          <Progress :value="38" label="Daily progress">
            <template #hint>
              <span class="text-base-medium text-ink-gray-4">40 pt</span>
            </template>
          </Progress>
        </div>
      </template>
    </Guideline>
  </div>
</template>
