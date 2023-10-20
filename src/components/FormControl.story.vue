<script setup lang="ts">
import { reactive } from 'vue'
import FormControl from './FormControl.vue'
import FeatherIcon from './FeatherIcon.vue'
import Avatar from './Avatar.vue'

const state = reactive({
  size: 'sm',
  variant: 'subtle',
  placeholder: 'Placeholder',
  disabled: false,
  label: 'Label',
  modelValue: '',
})

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
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant
      v-for="inputType in inputTypes"
      :key="inputType"
      :title="inputType"
    >
      <div class="p-2">
        <FormControl
          :type="inputType"
          v-bind="state"
          v-model="state.modelValue"
        />
      </div>
    </Variant>
    <Variant title="select">
      <div class="p-2">
        <FormControl
          type="select"
          :options="[
            { label: 'One', value: '1' },
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ]"
          v-bind="state"
        />
      </div>
    </Variant>
    <Variant title="select">
      <div class="p-2">
        <FormControl
          type="autocomplete"
          :options="[
            { label: 'One', value: '1' },
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ]"
          v-bind="state"
        />
      </div>
    </Variant>
    <Variant title="checkbox">
      <div class="p-2">
        <FormControl type="checkbox" v-bind="state" />
      </div>
    </Variant>

    <Variant title="prefix slot icon">
      <div class="p-2">
        <FormControl type="text" label="Label">
          <template #prefix>
            <FeatherIcon class="w-4" name="search" />
          </template>
        </FormControl>
      </div>
    </Variant>

    <Variant title="suffix slot icon">
      <div class="p-2">
        <FormControl type="text" label="Label">
          <template #suffix>
            <FeatherIcon class="w-4" name="search" />
          </template>
        </FormControl>
      </div>
    </Variant>

    <Variant title="prefix slot avatar">
      <div class="p-2">
        <FormControl type="text" label="Label">
          <template #prefix>
            <Avatar
              size="sm"
              image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
            />
          </template>
        </FormControl>
      </div>
    </Variant>

    <template #controls>
      <HstSelect v-model="state.variant" :options="variants" title="Variant" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
