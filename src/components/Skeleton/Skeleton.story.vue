<script setup lang="ts">
import { ref } from 'vue'
import Skeleton from './Skeleton.vue'
import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import Card from '../Card.vue'

const isLoading = ref(true)
const toggleLoading = () => {
  isLoading.value = !isLoading.value
}
</script>

<template>
  <Story title="Skeleton" :layout="{ type: 'grid', width: '100%' }">
    <div class="p-8 space-y-12">
      <!-- Basic Examples -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Basic Skeleton</h3>
        <div class="space-y-4">
          <Skeleton width="200px" height="20px" />
          <Skeleton width="300px" height="20px" />
          <Skeleton width="250px" height="20px" />
        </div>
      </div>

      <!-- Different Sizes -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Different Sizes</h3>
        <div class="space-y-4">
          <Skeleton width="100%" height="40px" />
          <Skeleton width="80%" height="30px" />
          <Skeleton width="60%" height="20px" />
          <Skeleton width="40%" height="16px" />
        </div>
      </div>

      <!-- Avatar Skeleton -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Avatar Skeleton</h3>
        <div class="flex gap-4">
          <Skeleton width="40px" height="40px" class="rounded-full" />
          <Skeleton width="48px" height="48px" class="rounded-full" />
          <Skeleton width="64px" height="64px" class="rounded-full" />
          <Skeleton width="80px" height="80px" class="rounded-full" />
        </div>
      </div>

      <!-- Card Skeleton -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Card Skeleton</h3>
        <Card class="max-w-md">
          <div class="space-y-4">
            <Skeleton width="100%" height="200px" class="rounded-lg" />
            <div class="space-y-2">
              <Skeleton width="60%" height="24px" />
              <Skeleton width="100%" height="16px" />
              <Skeleton width="100%" height="16px" />
              <Skeleton width="80%" height="16px" />
            </div>
            <div class="flex gap-2">
              <Skeleton width="100px" height="36px" class="rounded-md" />
              <Skeleton width="100px" height="36px" class="rounded-md" />
            </div>
          </div>
        </Card>
      </div>

      <!-- User Profile Skeleton -->
      <div>
        <h3 class="text-lg font-semibold mb-4">User Profile Skeleton</h3>
        <Card class="max-w-md">
          <div class="flex items-start gap-4">
            <Skeleton width="64px" height="64px" class="rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton width="150px" height="20px" />
              <Skeleton width="100px" height="16px" />
              <Skeleton width="100%" height="14px" />
              <Skeleton width="80%" height="14px" />
            </div>
          </div>
        </Card>
      </div>

      <!-- List Skeleton -->
      <div>
        <h3 class="text-lg font-semibold mb-4">List Skeleton</h3>
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center gap-3">
            <Skeleton width="40px" height="40px" class="rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton width="40%" height="16px" />
              <Skeleton width="60%" height="14px" />
            </div>
          </div>
        </div>
      </div>

      <!-- Toggle Loading State -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Toggle Loading State</h3>
        <div class="space-y-4">
          <Button @click="toggleLoading">
            {{ isLoading ? 'Show Content' : 'Show Skeleton' }}
          </Button>
          
          <Card class="max-w-md">
            <Skeleton :loading="isLoading" width="100%" height="200px" class="rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=200&fit=crop" 
                alt="Loaded content"
                class="w-full h-[200px] object-cover rounded-lg"
              />
            </Skeleton>
            
            <div class="mt-4 space-y-2">
              <Skeleton :loading="isLoading" width="60%" height="24px">
                <h3 class="text-xl font-semibold">Beautiful Landscape</h3>
              </Skeleton>
              
              <Skeleton :loading="isLoading" width="100%" height="16px">
                <p class="text-gray-600">This is the actual content that appears when loading is complete.</p>
              </Skeleton>
            </div>
          </Card>
        </div>
      </div>

      <!-- Table Skeleton -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Table Skeleton</h3>
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 p-4 border-b">
            <div class="flex gap-4">
              <Skeleton width="150px" height="16px" />
              <Skeleton width="150px" height="16px" />
              <Skeleton width="150px" height="16px" />
              <Skeleton width="100px" height="16px" />
            </div>
          </div>
          <div class="divide-y">
            <div v-for="i in 4" :key="i" class="p-4">
              <div class="flex gap-4">
                <Skeleton width="150px" height="14px" />
                <Skeleton width="150px" height="14px" />
                <Skeleton width="150px" height="14px" />
                <Skeleton width="100px" height="14px" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="mt-8 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-900 mb-2">Features:</h4>
        <ul class="list-disc list-inside space-y-1">
          <li>Smooth shimmer animation effect</li>
          <li>Customizable width and height</li>
          <li>Support for loading state toggle</li>
          <li>Custom className for styling (rounded, etc.)</li>
          <li>Dark mode support</li>
          <li>Lightweight and performant</li>
          <li>Slot support for actual content</li>
        </ul>
      </div>
    </div>
  </Story>
</template>
