<script setup lang="ts">
import { reactive } from 'vue'
import HoverCard from './HoverCard.vue'
import Avatar from '../Avatar/Avatar.vue'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'

const state = reactive({
  showArrow: true,
})

const userProfile = {
  name: 'Sarah Chen',
  username: '@sarahchen',
  avatar: 'SC',
  bio: 'Product Designer at Acme Inc. Passionate about creating delightful user experiences.',
  followers: '2.5K',
  following: '180',
  joined: 'Joined March 2023'
}
</script>

<template>
  <Story title="HoverCard" :layout="{ type: 'grid', width: '100%' }">
    <div class="p-8 space-y-12">
      <!-- Basic Example -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Basic HoverCard</h3>
        <p class="text-sm text-gray-600 mb-4">
          Hover over the link to see the hover card
        </p>
        
        <HoverCard :arrow="state.showArrow">
          <a
            href="#"
            class="text-blue-600 hover:text-blue-700 underline font-medium"
            @click.prevent
          >
            @radix-ui
          </a>
          
          <template #content>
            <div class="p-4 w-80">
              <div class="flex gap-4">
                <Avatar label="Radix UI" size="lg" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">Radix UI</h4>
                  <p class="text-sm text-gray-600">@radix-ui</p>
                  <p class="text-sm text-gray-700 mt-2">
                    Unstyled, accessible components for building high‑quality design systems and web apps in React.
                  </p>
                  <div class="flex gap-4 mt-3 text-sm">
                    <div>
                      <span class="font-semibold text-gray-900">12.5K</span>
                      <span class="text-gray-600"> Followers</span>
                    </div>
                    <div>
                      <span class="font-semibold text-gray-900">48</span>
                      <span class="text-gray-600"> Following</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </HoverCard>
      </div>

      <!-- User Profile Card -->
      <div>
        <h3 class="text-lg font-semibold mb-4">User Profile HoverCard</h3>
        <p class="text-sm text-gray-600 mb-4">
          Hover over the username to see their profile
        </p>
        
        <div class="text-gray-700">
          Great work by
          <HoverCard :arrow="state.showArrow">
            <a
              href="#"
              class="text-blue-600 hover:text-blue-700 font-medium"
              @click.prevent
            >
              {{ userProfile.username }}
            </a>
            
            <template #content>
              <div class="p-5 w-80">
                <div class="flex items-start gap-4">
                  <Avatar :label="userProfile.name" size="xl" />
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 truncate">{{ userProfile.name }}</h4>
                    <p class="text-sm text-gray-600">{{ userProfile.username }}</p>
                  </div>
                  <Button variant="solid" size="sm">Follow</Button>
                </div>
                
                <p class="text-sm text-gray-700 mt-3">
                  {{ userProfile.bio }}
                </p>
                
                <div class="flex gap-4 mt-4 text-sm">
                  <div>
                    <span class="font-semibold text-gray-900">{{ userProfile.followers }}</span>
                    <span class="text-gray-600"> Followers</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-900">{{ userProfile.following }}</span>
                    <span class="text-gray-600"> Following</span>
                  </div>
                </div>
                
                <p class="text-xs text-gray-500 mt-3">{{ userProfile.joined }}</p>
              </div>
            </template>
          </HoverCard>
          on this project!
        </div>
      </div>

      <!-- Product Preview -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Product Preview</h3>
        <p class="text-sm text-gray-600 mb-4">
          Hover over product name to see details
        </p>
        
        <div class="space-y-2">
          <HoverCard :arrow="state.showArrow">
            <a href="#" class="text-blue-600 hover:text-blue-700 font-medium" @click.prevent>
              Premium Wireless Headphones
            </a>
            
            <template #content>
              <div class="w-72">
                <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg"></div>
                <div class="p-4">
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="font-semibold text-gray-900">Premium Wireless Headphones</h4>
                    <Badge theme="green">In Stock</Badge>
                  </div>
                  <p class="text-2xl font-bold text-gray-900 mb-2">$299.99</p>
                  <p class="text-sm text-gray-600 mb-3">
                    High-quality wireless headphones with active noise cancellation and 30-hour battery life.
                  </p>
                  <div class="flex gap-2">
                    <Button variant="solid" size="sm" class="flex-1">Add to Cart</Button>
                    <Button variant="subtle" size="sm">Details</Button>
                  </div>
                </div>
              </div>
            </template>
          </HoverCard>
        </div>
      </div>

      <!-- Custom Styling -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Custom Styling</h3>
        <p class="text-sm text-gray-600 mb-4">
          Customize the appearance with custom classes
        </p>
        
        <HoverCard
          :arrow="true"
          arrowClass="fill-blue-500"
          contentClass="bg-blue-500 text-white border-2 border-blue-600"
        >
          <Button variant="solid" theme="blue">Hover for Info</Button>
          <template #content>
            <div class="p-4">
              <h4 class="font-semibold mb-2">Custom Styled Card</h4>
              <p class="text-sm opacity-90">
                This hover card has custom background, text color, and arrow styling.
              </p>
            </div>
          </template>
        </HoverCard>
      </div>

      <!-- Features List -->
      <div class="mt-8 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-900 mb-2">Features:</h4>
        <ul class="list-disc list-inside space-y-1">
          <li>Hover-triggered content preview</li>
          <li>Default 700ms open delay, 300ms close delay</li>
          <li>Automatic positioning with collision detection</li>
          <li>Optional arrow pointing to trigger</li>
          <li>Smooth animations</li>
          <li>Fully customizable content</li>
          <li>Accessible keyboard navigation</li>
          <li>Built with Radix UI primitives</li>
        </ul>
      </div>
    </div>

    <template #controls>
      <HstCheckbox v-model="state.showArrow" title="Show Arrow" />
    </template>
  </Story>
</template>
