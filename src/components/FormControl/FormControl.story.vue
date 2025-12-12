<script setup lang="ts">
import Story from "../Story.vue";
import { reactive, ref } from "vue";
import FormControl from "./FormControl.vue";
import FeatherIcon from "../FeatherIcon.vue";
import { Avatar } from "../Avatar";

const state = reactive({
  size: "sm",
  variant: "subtle",
  placeholder: "Placeholder",
  disabled: false,
  label: "Label",
});

const inputValue = ref("");
const selectValue = ref(null);
const autocompleteValue = ref(null);
const checkboxValue = ref(false);

const inputTypes = [
  "text",
  "number",
  "email",
  "date",
  "password",
  "search",
  "textarea",
];
</script>

<template>
  <div class="grid grid-cols-2 gap-6">
    <Story :title="inputType" v-for="inputType in inputTypes" :key="inputType">
      <FormControl :type="inputType" v-bind="state" v-model="inputValue" />
    </Story>

    <Story title="Select Input" :layout="{ width: 250 }">
      <FormControl
        type="select"
        :options='
          [
            { label: "One", value: "1" },
            { label: "Two", value: "2" },
            { label: "Three", value: "3" },
          ]
        '
        v-bind="state"
        v-model="selectValue"
      />
    </Story>

    <Story title="Combobox Input" :layout="{ width: 250 }">
      <FormControl
        type="combobox"
        :options='
          [
            { label: "One", value: "1" },
            { label: "Two", value: "2" },
            { label: "Three", value: "3" },
          ]
        '
        v-bind="state"
        v-model="autocompleteValue"
      />
    </Story>

    <Story title="Checkbox" :layout="{ width: 250 }">
      <FormControl type="checkbox" v-bind="state" v-model="checkboxValue" />
    </Story>

    <Story title="Prefix Icon" :layout="{ width: 250 }">
      <FormControl type="text" label="Label">
        <template #prefix>
          <FeatherIcon class="w-4" name="search" />
        </template>
      </FormControl>
    </Story>

    <Story title="Suffix Icon" :layout="{ width: 250 }">
      <FormControl type="text" label="Label">
        <template #suffix>
          <FeatherIcon class="w-4" name="search" />
        </template>
      </FormControl>
    </Story>

    <Story title="Prefix Avatar" :layout="{ width: 250 }">
      <FormControl type="text" label="Label">
        <template #prefix>
          <Avatar
            size="sm"
            image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
          />
        </template>
      </FormControl>
    </Story>
  </div>
</template>
