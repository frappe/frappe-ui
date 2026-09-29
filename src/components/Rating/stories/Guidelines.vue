<script setup lang="ts">
import { Rating } from 'frappe-ui'

// Card 1: two products, one well reviewed and one with a single review.
const products = [
  { name: 'Standing desk', rating: 4.5, reviews: 128 },
  { name: 'Desk lamp', rating: 5, reviews: 1 },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. An average hides how many people gave it. Without the count, a
         single 5-star review outranks 128 reviews averaging 4.5. LMS's
         batch feedback shows averages with no count. -->
    <Guideline
      caption="Show the count with an average, like “4.5&nbsp;(128&nbsp;reviews)”. A lone 5.0 from one review misleads."
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
  </div>
</template>
