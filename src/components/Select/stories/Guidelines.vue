<script setup lang="ts">
import { Combobox, Select } from 'frappe-ui'

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango']
const sort = ['Newest', 'Oldest', 'A–Z']
const group = ['Status', 'Owner', 'Priority']

// Card 2: a list long enough that people want to type, not scroll.
const countries = [
  'Argentina',
  'Australia',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Denmark',
  'Egypt',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Japan',
  'Kenya',
  'Mexico',
  'Nepal',
  'Netherlands',
  'Nigeria',
  'Norway',
  'Portugal',
  'Singapore',
  'Spain',
]
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

    <!-- 2. Past about ten options, scrolling a Select is slower than typing.
         Both sides are live: open each and look for India. -->
    <Guideline
      layout="stack"
      caption="Past about 10 options, use a Combobox so people can search."
    >
      <template #do>
        <Combobox
          label="Country"
          placeholder="Search countries"
          :options="countries"
          class="w-56"
        />
      </template>
      <template #dont>
        <Select
          label="Country"
          placeholder="Select a country"
          :options="countries"
          class="w-56"
        />
      </template>
    </Guideline>
  </div>
</template>
