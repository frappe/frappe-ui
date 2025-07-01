<script setup lang="ts">
import { ref } from 'vue'
import Autocomplete from './Autocomplete.vue'

const single = ref()
const people = ref(null)
const options = [
  {
    label: 'John Doe',
    value: 'john-doe',
    image: 'https://randomuser.me/api/portraits/men/59.jpg',
  },
  {
    label: 'Jane Doe',
    value: 'jane-doe',
    image: 'https://randomuser.me/api/portraits/women/58.jpg',
  },
  {
    label: 'John Smith',
    value: 'john-smith',
    image: 'https://randomuser.me/api/portraits/men/59.jpg',
  },
  {
    label: 'Jane Smith',
    value: 'jane-smith',
    image: 'https://randomuser.me/api/portraits/women/59.jpg',
  },
  {
    label: 'John Wayne',
    value: 'john-wayne',
    image: 'https://randomuser.me/api/portraits/men/57.jpg',
  },
  {
    label: 'Jane Wayne',
    value: 'jane-wayne',
    image: 'https://randomuser.me/api/portraits/women/51.jpg',
  },
]
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }" autoPropsDisabled>
    <Variant title="Single option">
      <div class="p-2">
        <Autocomplete
          :options="options"
          v-model="single"
          placeholder="Select person"
        />
      </div>
    </Variant>
    <Variant title="Single option with prefix slots">
      <div class="p-2">
        <Autocomplete
          :options="options"
          v-model="single"
          placeholder="Select person"
        >
          <template #prefix>
            <img
              v-if="single"
              :src="single.image"
              class="mr-2 h-4 w-4 rounded-full"
            />
          </template>
          <template #item-prefix="{ option }">
            <img :src="option.image" class="h-4 w-4 rounded-full" />
          </template>
        </Autocomplete>
      </div>
    </Variant>
    <Variant title="Single option without search">
      <div class="p-2">
        <Autocomplete
          :options="options"
          v-model="single"
          placeholder="Select person"
          :hideSearch="true"
        />
      </div>
    </Variant>
    <Variant title="Multiple options">
      <div class="p-2">
        <Autocomplete
          :options="options"
          v-model="people"
          placeholder="Select people"
          :multiple="true"
        />
      </div>
    </Variant>
    <Variant title="Multiple options without search">
      <div class="p-2">
        <Autocomplete
          :options="options"
          v-model="people"
          placeholder="Select people"
          :multiple="true"
          :hideSearch="true"
        />
      </div>
    </Variant>
  </Story>
</template>
