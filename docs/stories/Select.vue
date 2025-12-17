<script setup lang="ts">
import { ref } from "vue";
import Story from "@/components/Story.vue";
import LucideUser from "~icons/lucide/user";
import LucideRotate from "~icons/lucide/rotate-ccw";
import { SelectItemText } from "reka-ui";
import { Avatar, Button, Select } from "frappe-ui";

const value = ref("");
const options = [
  { label: "John Doe", value: "john-doe" },
  { label: "Jane Doe", value: "jane-doe" },
  { label: "John Smith", value: "john-smith" },
  { label: "Jane Smith", value: "jane-smith", disabled: true },
  { label: "John Wayne", value: "john-wayne" },
  { label: "Jane Wayne", value: "jane-wayne" },
];
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story title="Default Select">
      <Select :options="options" v-model="value" />
    </Story>

    <Story title="With Prefix Icon">
      <Select :options="options" v-model="value">
        <template #prefix>
          <LucideUser class="size-4 text-ink-gray-9" />
        </template>
      </Select>
    </Story>

    <Story title="With Footer">
      <Select :options="options" v-model="value">
        <template #footer>
          <div class="grid gap-1">
            <hr />
            <Button variant="ghost">
              <template #prefix>
                <LucideRotate class="size-4 text-ink-gray-9" />
              </template>
              Reset
            </Button>
          </div>
        </template>
      </Select>
    </Story>

    <Story title="Custom Option Slot">
      <Select :options="options" v-model="value">
        <template #option="{ option }">
          <div class="inline-flex gap-2 items-center">
            <Avatar
              size="sm"
              image="https://avatars.fastly.steamstatic.com/9ebf36bd3dc6c34f2d79ccf5d63e00eb7866321e_full.jpg"
            />
            <SelectItemText>{{ option.label }}</SelectItemText>
          </div>
        </template>
      </Select>
    </Story>

    <Story title="With Suffix Slot">
      <Select :options="options" v-model="value">
        <template #suffix> </template>
      </Select>
    </Story>
  </div>
</template>
