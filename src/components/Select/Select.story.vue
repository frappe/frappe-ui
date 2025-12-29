<script setup lang="ts">
import { computed, ref } from "vue";
import Story from "@/components/Story.vue";
import LucideUser from "~icons/lucide/user";
import LucideRotate from "~icons/lucide/rotate-ccw";
import { SelectItemText } from "reka-ui";
import { Avatar, Button, Select } from "frappe-ui";

const value = ref("");
const options = [
  {
    label: "Matcha Tiramisu",
    value: "matcha-tiramisu",
    img:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=150&h=150&fit=crop",
  },
  {
    label: "Strawberry Cheesecake",
    value: "strawberry-cheesecake",
    img:
      "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=150&h=150&fit=crop",
  },
  {
    label: "Chocolate Lava Cake",
    value: "chocolate-lava-cake",
    img:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=150&h=150&fit=crop",
  },
  {
    label: "Mango Sticky Rice",
    value: "mango-sticky-rice",
    img:
      "https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=150&h=150&fit=crop",
    disabled: true,
  },
  {
    label: "Pistachio Baklava",
    value: "pistachio-baklava",
    img:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=150&h=150&fit=crop",
  },
  {
    label: "Ube Ice Cream",
    value: "ube-ice-cream",
    img:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=150&h=150&fit=crop",
  },
  {
    label: "Salted Caramel Tart",
    value: "salted-caramel-tart",
    img:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=150&h=150&fit=crop",
  },
];

const activeImg = computed(
  () => (options.find((x) => x.value === value.value)?.img),
);

const reset = () => value.value = "";
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
            <Button variant="ghost" @click="reset">
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
        {{ activeImg }}
        <template #prefix>
          <Avatar size="sm" :image="activeImg" />
        </template>
        <template #option="{ option }">
          <div class="inline-flex gap-2 items-center">
            <Avatar size="sm" :image="option.img" />
            <SelectItemText>{{ option.label }}</SelectItemText>
          </div>
        </template>
      </Select>
    </Story>

    <Story title="With Suffix Slot">
      <Select :options="options" v-model="value">
        <template #suffix>
          <LucideUser class="size-4 ml-auto text-ink-gray-9" />
        </template>
      </Select>
    </Story>
  </div>
</template>
