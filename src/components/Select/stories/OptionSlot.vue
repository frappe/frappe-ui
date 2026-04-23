<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Select } from 'frappe-ui'

const value = ref('matcha-tiramisu')

const options = [
  {
    label: 'Matcha Tiramisu',
    value: 'matcha-tiramisu',
    image:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=150&h=150&fit=crop',
    description: 'Kyoto cream · Soft sponge · Ceremonial matcha',
    price: '$14',
  },
  {
    label: 'Strawberry Cheesecake',
    value: 'strawberry-cheesecake',
    image:
      'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=150&h=150&fit=crop',
    description: 'Fresh berries · Baked filling · Biscuit crust',
    price: '$16',
  },
  {
    label: 'Chocolate Lava Cake',
    value: 'chocolate-lava-cake',
    image:
      'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=150&h=150&fit=crop',
    description: 'Warm center · Dark chocolate · Sea salt',
    price: '$15',
  },
  {
    label: 'Mango Sticky Rice',
    value: 'mango-sticky-rice',
    image:
      'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=150&h=150&fit=crop',
    description: 'Coconut cream · Sweet mango · Toasted sesame',
    price: '$13',
    disabled: true,
  },
]

const activeOption = computed(() => {
  return options.find((option) => option.value === value.value) ?? null
})
</script>

<template>
  <div>
    <Select v-model="value" :options="options" variant="outline" class="w-full">
      <template #prefix>
        <Avatar
          v-if="activeOption"
          size="sm"
          :image="activeOption.image"
          :label="activeOption.label"
        />
      </template>

      <template #item-prefix="{ option }">
        <Avatar size="sm" :image="option.image" :label="option.label" />
      </template>

      <template #item-label="{ option }">
        <div class="min-w-0">
          <div class="truncate">{{ option.label }}</div>
          <div
            class="truncate text-p-sm text-ink-gray-5"
            :class="option.disabled ? 'opacity-65' : ''"
          >
            {{ option.description }}
          </div>
        </div>
      </template>
    </Select>
  </div>
</template>
