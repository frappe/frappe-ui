const __resolved__virtual_storySource_srcComponentsMonthpickerMonthpickerStoryVue = `<script setup lang="ts">
import { ref } from 'vue'
import MonthPicker from './MonthPicker.vue'
const val = ref('')
<\/script>

<template>
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant title="Default">
      <div class="p-2">
        <MonthPicker v-model="val" />
      </div>
    </Variant>

    <Variant title="Fit width">
      <div class="p-2">
        <MonthPicker v-model="val" class="w-fit" />
      </div>
    </Variant>
  </Story>
</template>
`;
export {
  __resolved__virtual_storySource_srcComponentsMonthpickerMonthpickerStoryVue as default
};
