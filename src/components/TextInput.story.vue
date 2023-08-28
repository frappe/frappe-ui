<script setup lang="ts">
import { reactive } from 'vue'
import TextInput from './TextInput.vue'
import FeatherIcon from './FeatherIcon.vue'
import Avatar from './Avatar.vue'

const state = reactive({
  size: 'sm',
  variant: 'subtle',
  placeholder: 'Placeholder',
  disabled: false,
  modelValue: '',
})

const inputTypes = [
  'text',
  'number',
  'email',
  'date',
  'datetime-local',
  'password',
  'search',
  'tel',
  'time',
  'url',
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
        <TextInput :type="inputType" v-bind="state" />
      </div>
    </Variant>

    <Variant title="prefix slot icon">
      <div class="p-2">
        <TextInput type="text">
          <template #prefix>
            <FeatherIcon class="w-4" name="search" />
          </template>
        </TextInput>
      </div>
    </Variant>

    <Variant title="suffix slot icon">
      <div class="p-2">
        <TextInput type="text">
          <template #suffix>
            <FeatherIcon class="w-4" name="search" />
          </template>
        </TextInput>
      </div>
    </Variant>

    <Variant title="prefix slot avatar">
      <div class="p-2">
        <TextInput type="text">
          <template #prefix>
            <Avatar
              size="sm"
              image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
            />
          </template>
        </TextInput>
      </div>
    </Variant>

    <template #controls>
      <HstSelect v-model="state.variant" :options="variants" title="Variant" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" />
    </template>
  </Story>
</template>
