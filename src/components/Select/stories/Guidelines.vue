<script setup lang="ts">
import { Select } from 'frappe-ui'

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango']
const sort = ['Newest', 'Oldest', 'A–Z']
const group = ['Status', 'Owner', 'Priority']
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Input select vs dropdown -->
    <Guideline
      layout="stack"
      caption="Use a select for a value saved in a form; use a dropdown to trigger a UI action."
    >
      <template #do>
        <Select
          label="Favourite fruit"
          placeholder="Pick one"
          :options="fruits"
          class="w-56"
        />
      </template>
      <template #dont>
        <div class="flex items-center gap-2">
          <Select placeholder="Sort by" :options="sort" class="w-36" />
          <Select placeholder="Group by" :options="group" class="w-36" />
        </div>
      </template>
    </Guideline>
  </div>
</template>
