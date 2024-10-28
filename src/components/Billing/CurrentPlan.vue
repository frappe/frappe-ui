<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg font-semibold text-gray-900">
      {{ 'Current plan' }}
    </div>
    <div class="flex justify-between shadow rounded-lg p-2.5 text-base">
      <div class="flex gap-3">
        <div class="flex flex-col gap-4 flex-1">
          <div class="flex flex-col gap-1">
            <div>
              <span class="font-semibold text-gray-900">
                {{ 'Trial' }}
              </span>
              <!-- <span> / month</span> -->
            </div>
            <div class="text-gray-700 inline-flex items-center gap-1.5">
              <FeatherIcon class="h-3.5" name="alert-triangle" />
              {{ 'Your plan may end soon!' }}
            </div>
          </div>
          <div class="text-gray-700">
            {{ '₹68.33 / day If subscription ended · See plan details' }}
          </div>
        </div>
      </div>
      <Button variant="solid" :label="'Manage plan'" />
    </div>
  </div>
</template>
<script setup></script>
