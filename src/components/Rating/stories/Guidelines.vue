<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

// Card 2: two products, one well reviewed and one with a single review.
const products = [
  { name: 'Standing desk', rating: 4.5, reviews: 128 },
  { name: 'Desk lamp', rating: 5, reviews: 1 },
]

// Interactive models for rule 3.
const pqEditable = ref(3.5)
const pqEditableBad = ref(3.5)
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Half-fill fractional values -->
    <Guideline
      caption="Use a half-filled icon to accurately reflect values that fall between whole numbers."
    >
      <template #do>
        <div class="flex flex-col items-center gap-2">
          <Rating :model-value="3.5" :step="0.5" size="md" />
          <span class="text-sm text-ink-gray-5">3.5 average</span>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col items-center gap-2">
          <Rating :model-value="4" :step="1" size="md" />
          <span class="text-sm text-ink-gray-5">3.5 shown as 4 stars</span>
        </div>
      </template>
    </Guideline>

    <!-- 2. An average hides how many people gave it. Without the count, a
         single 5-star review outranks 128 reviews averaging 4.5. -->
    <Guideline
      caption="Show the count with an average, like “4.5 (128 reviews)”. A lone 5.0 from one review misleads."
    >
      <template #do>
        <div class="flex flex-col gap-4">
          <div v-for="p in products" :key="p.name" class="flex flex-col gap-1">
            <span class="text-sm text-ink-gray-8">{{ p.name }}</span>
            <div class="flex items-center gap-2">
              <Rating :model-value="p.rating" :step="0.5" size="sm" disabled />
              <span class="text-sm text-ink-gray-5">
                {{ p.rating.toFixed(1) }} ({{ p.reviews }}
                {{ p.reviews === 1 ? 'review' : 'reviews' }})
              </span>
            </div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col gap-4">
          <div v-for="p in products" :key="p.name" class="flex flex-col gap-1">
            <span class="text-sm text-ink-gray-8">{{ p.name }}</span>
            <div class="flex items-center gap-2">
              <Rating :model-value="p.rating" :step="0.5" size="sm" disabled />
              <span class="text-sm text-ink-gray-5">
                {{ p.rating.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Read-only ratings should look non-editable -->
    <Guideline
      caption="Visually distinguish read-only ratings from interactive ones so users don't try to edit them."
    >
      <template #do>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5"
              >Product quality (Interactive)</span
            >
            <Rating v-model="pqEditable" :step="0.5" size="md" />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5"
              >Product quality (Read only)</span
            >
            <Rating
              :model-value="3.5"
              :step="0.5"
              size="md"
              disabled
              class="opacity-80 grayscale"
            />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5"
              >Product quality (Interactive)</span
            >
            <Rating v-model="pqEditableBad" :step="0.5" size="md" />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-5"
              >Product quality (Read only)</span
            >
            <Rating :model-value="3.5" :step="0.5" size="md" disabled />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
