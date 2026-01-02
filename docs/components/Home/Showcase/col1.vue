<script setup lang="ts">
import { computed, ref } from "vue";
import {  Button, FormControl } from "frappe-ui";
import LucideRight from "~icons/lucide/arrow-right";

const countryOptions = [
  { label: "Syria", value: "SY" },
  { label: "Egypt", value: "EG" },
  { label: "Canada", value: "CA" },
  { label: "Ireland", value: "IR" },
];

</script>

<template>
  <div
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base h-fit"
  >
    <div class="grid p-5 grid-cols-2 gap-y-5 gap-x-4 h-fit">
      <FormControl
        label="Billing name"
        placeholder="Enter your name"
        :options="countryOptions"
        class="col-span-2"
      />

      <FormControl
        type="select"
        label="Country"
        :options="countryOptions"
      />

      <FormControl
        type="select"
        label="City"
        :options="countryOptions"
      />

      <FormControl
        label="Address"
        :options="countryOptions"
        placeholder="Enter your address"
        class="col-span-2"
      />

      <FormControl
        type="checkbox"
        label="I have GSTN"
        :options="countryOptions"
        class="col-span-2"
      />

      <FormControl
        type="select"
        label="Month"
        placeholder="MM"
        :options='
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]
        '
      />

      <FormControl
        type="select"
        label="Year"
        placeholder="Select Year"
        :options="
          Array.from({ length: 6 }, (_, i) =>
            String(i + new Date().getFullYear()))
        "
      />

      <Button variant="solid" class="col-span-2 -mt-1">
        Next
        <template #suffix>
          <LucideRight class="size-4" />
        </template>
      </Button>
    </div>

    <div class="grid p-5 grid-cols-2 gap-y-5 gap-x-4">
			something here
    </div>
  </div>
</template>
