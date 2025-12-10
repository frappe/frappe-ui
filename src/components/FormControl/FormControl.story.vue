<script setup lang="ts">
import { reactive, ref } from 'vue'
import FormControl from './FormControl.vue'
import FeatherIcon from '../FeatherIcon.vue'
import { Avatar } from '../Avatar'

const state = reactive({
  size: 'sm',
  variant: 'subtle',
  placeholder: 'Placeholder',
  disabled: false,
  label: 'Label',
})

const inputValue = ref('')
const selectValue = ref(null)
const autocompleteValue = ref(null)
const checkboxValue = ref(false)

const inputTypes = [
  'text',
  'number',
  'email',
  'date',
  'password',
  'search',
  'textarea',
]
const sizes = ['sm', 'md', 'lg', 'xl']
const variants = ['subtle', 'outline']
</script>

<template>
  <div class="grid gap-6 w-[500px]">
    <div v-for="inputType in inputTypes" :key="inputType">
      <FormControl :type="inputType" v-bind="state" v-model="inputValue" />
    </div>

    <div>
      <FormControl
        type="select"
        :options="[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
          { label: 'Three', value: '3' },
        ]"
        v-bind="state"
        v-model="selectValue"
      />
    </div>

    <div>
      <FormControl
        type="combobox"
        :options="[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
          { label: 'Three', value: '3' },
        ]"
        v-bind="state"
        v-model="autocompleteValue"
      />
    </div>

    <div>
      <FormControl type="checkbox" v-bind="state" v-model="checkboxValue" />
    </div>

    <div>
      <FormControl type="text" label="Label">
        <template #prefix>
          <FeatherIcon class="w-4" name="search" />
        </template>
      </FormControl>
    </div>

    <div>
      <FormControl type="text" label="Label">
        <template #suffix>
          <FeatherIcon class="w-4" name="search" />
        </template>
      </FormControl>
    </div>

    <div>
      <FormControl type="text" label="Label">
        <template #prefix>
          <Avatar
            size="sm"
            image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
          />
        </template>
      </FormControl>
    </div>
  </div>
</template>
