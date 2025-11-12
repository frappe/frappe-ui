<script setup lang="ts">
import { ref } from "vue";
import MultiSelect from "./MultiSelect.vue";
import LucideCheck from "~icons/lucide/check-check";
import LucideTrash from "~icons/lucide/trash-2";
import Avatar from "../Avatar/Avatar.vue";

const state = ref();

const img =
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=100&h=100&fit=crop";

const options = [
  { value: "red-apple", label: "Red Apple", img },
  { value: "blueberry-burst", label: "Blueberry Burst", img },
  { value: "orange-grove", label: "Orange Grove", img },
  { value: "banana-split", label: "Banana Split", img },
  { value: "grapes-cluster", label: "Grapes Cluster", img },
  { value: "kiwi-slice", label: "Kiwi Slice", img },
  { value: "mango-fusion", label: "Mango Fusion", img },
];
</script>

<template>
  <Story :layout='{ width: 500, type: "grid" }'>
    <Variant title="Default">
      <MultiSelect
        :options="options"
        v-model="state"
        placeholder="Select fruit"
      />
    </Variant>

    <Variant title="Option slot">
      <MultiSelect
        :options="options"
        v-model="state"
        placeholder="Select fruit"
      >
        <template #option="{ item }">
          <Avatar :image="item.img" size="sm" class="mr-2" />
          {{ item.label }}
        </template>
      </MultiSelect>
    </Variant>

    <Variant title="Footer slot">
      <MultiSelect
        :options="options"
        v-model="state"
      >
        <template #footer="{ clearAll, selectAll }">
          <div class="flex justify-between my-2">
            <Button theme="red" @click="clearAll">
              <template #prefix> <LucideTrash class="size-4" /></template>
              Clear All
            </Button>

            <Button @click="selectAll">
              <template #prefix><LucideCheck class="size-4" /></template>
              Select All
            </Button>
          </div>
        </template>
      </MultiSelect>
    </Variant>
  </Story>
</template>
