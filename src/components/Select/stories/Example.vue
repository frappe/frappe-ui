<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const autoWidthValue = ref('')
const fullWidthValue = ref('strawberry-cheesecake')

const options = [
  {
    label: 'Matcha Tiramisu',
    value: 'matcha-tiramisu',
  },
  {
    label: 'Strawberry Cheesecake',
    value: 'strawberry-cheesecake',
  },
  {
    label: 'Chocolate Lava Cake',
    value: 'chocolate-lava-cake',
  },
  {
    label: 'Mango Sticky Rice',
    value: 'mango-sticky-rice',
    disabled: true,
  },
  {
    label: 'Pistachio Baklava',
    value: 'pistachio-baklava',
  },
  {
    label: 'Ube Ice Cream',
    value: 'ube-ice-cream',
  },
  {
    label: 'Salted Caramel Tart',
    value: 'salted-caramel-tart',
  },
]
</script>

<template>
  <div class="w-full max-w-4xl">
    <div
      class="grid divide-y divide-outline-gray-2 md:grid-cols-2 md:divide-x md:divide-y-0"
    >
      <div class="pb-8 md:pr-8">
        <div class="text-sm font-medium text-ink-gray-7">Auto width</div>
        <div class="mt-1 text-p-sm text-ink-gray-5">
          Matches the widest option by default, closer to a native select.
        </div>

        <div class="mt-4">
          <Select
            v-model="autoWidthValue"
            :options="options"
            variant="outline"
          />
        </div>

        <div class="mt-4 text-sm text-ink-gray-5">
          Value:
          <span class="text-ink-gray-8">
            {{ autoWidthValue || 'No selection yet' }}
          </span>
        </div>
      </div>

      <div class="pb-8 md:pl-8">
        <div class="text-sm font-medium text-ink-gray-7">Full width</div>
        <div class="mt-1 text-p-sm text-ink-gray-5">
          Opt in with
          <code class="text-sm text-ink-gray-7">class="w-full"</code>
          when you want the trigger to fill its container.
        </div>

        <div class="mt-4 w-[320px] max-w-full">
          <Select
            v-model="fullWidthValue"
            :options="options"
            variant="outline"
            class="w-full"
          />
        </div>

        <div class="mt-4 text-sm text-ink-gray-5">
          Value:
          <span class="text-ink-gray-8">{{ fullWidthValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
