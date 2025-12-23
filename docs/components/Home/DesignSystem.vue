<script setup lang="ts">
import { computed, reactive } from "vue";

import LucidePalette from "~icons/lucide/palette";
import LucideTxt from "~icons/lucide/baseline";
import LucideBorder from "~icons/lucide/frame";
import LucideSwatch from "~icons/lucide/swatch-book";
import LucideSun from "~icons/lucide/sun-medium";
import LucideType from "~icons/lucide/type";
import LucideCheck from "~icons/lucide/badge-check";
import LucideUserCog from "~icons/lucide/user-cog";
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  MonthPicker,
  MultiSelect,
  Progress,
} from "frappe-ui";

const brandColors = [
  "bg-surface-blue-3",
  "bg-violet-500",
  "bg-purple-500",
  // "bg-teal-500",
  "bg-surface-green-3",
  "bg-surface-amber-3",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-surface-red-6",
];

const neutralColors = [
  "bg-surface-gray-1",
  "bg-surface-gray-2",
  "bg-surface-gray-3",
  "bg-surface-gray-4",
  "bg-surface-gray-5",
  "bg-surface-gray-6",
  "bg-surface-gray-7",
];

const typeScale = [
  {
    label: "Display Text",
    class: "text-3xl font-semibold",
    meta: "24px / 600",
  },
  {
    label: "Section headings",
    class: "text-2xl font-semibold",
    meta: "20px / 600",
  },
  {
    label: "Subheadings and secondary titles",
    class: "text-xl font-medium",
    meta: "18px / 500",
  },
  {
    label: "Primary body text and introductions",
    class: "text-lg font-normal",
    meta: "16px / 400",
  },
  {
    label: "Standard body text for content",
    class: "text-base font-normal",
    meta: "14px / 400",
  },
  {
    label: "Secondary text, captions, and metadata",
    class: "text-sm font-normal",
    meta: "13px / 400",
  },
];

const btnvariants = ["solid", "subtle", "outline", "ghost"];
const themes = ["gray", "blue", "green", "orange", "red"];

const professionOptions = [
  { label: "Developer", value: "developer" },
  { label: "Designer", value: "designer" },
  { label: "Writer", value: "writer" },
  { label: "Marketer", value: "marketer" },
];

const formState = reactive({
  name: "",
  age: undefined,
  profession: "",
  joining: "",
  multiple: [],
});

const formCompleteStatus = computed(() => {
  const keyvals = Object.entries(formState);
  const filledQty = keyvals.filter((x) =>
    typeof (x[1]) == "string" ? x[1] : x[1]?.length > 0
  ).length;

  return filledQty / keyvals.length * 100;
});
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-12">
    <h1 class="text-[2.7rem] font-bold text-center text-ink-gray-9 mb-4">
      Espresso <span class="text-ink-violet-1"> Design</span> System
    </h1>

    <p
      class="text-2xl max-w-2xl text-center mx-auto text-ink-gray-5 leading-7 mb-12"
    >
      We've obsessed over every detail so you can focus on building great
      products.
    </p>

    <!-- 3 column layout -->
    <div
      class="border bg-surface-cards p-5 grid grid-cols-3 [&_h2]:text-lg"
    >
      <!-- first column -->
      <div class="grid gap-8">
        <div class="grid gap-3 w-fit">
          <h2 class="inline-flex gap-2 items-center mb-3">
            <span class="p-2 rounded-full bg-surface-gray-3">
              <LucideSwatch class="size-4" />
            </span>
            Color Palette
          </h2>

          <div class="flex gap-3">
            <span
              v-for="color in brandColors"
              class="p-4 size-4 rounded-sm shadow-lg"
              :class="color"
            >
            </span>
          </div>
        </div>

        <div class="grid gap-3">
          <h2>Neutral Colors</h2>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="(color, i) in neutralColors"
              class="p-4 rounded-sm shadow-lg"
              :class="color"
            >
            </span>
          </div>
        </div>

        <div class="grid gap-3 w-fit">
          <h2>Semantic Variables</h2>

          <div class="flex flex-wrap gap-3 *:h-fit">
            <span class="bg-surface-gray-2 p-2 rounded flex gap-2">
              <LucidePalette class="size-4" /> bg-surface
            </span>

            <span class="bg-surface-gray-2 p-2 rounded flex gap-2">
              <LucideTxt class="size-4" /> text-ink
            </span>

            <span class="bg-surface-gray-2 p-2 rounded flex gap-2">
              <LucideBorder class="size-4" />
              border-outline
            </span>
          </div>
        </div>

        <h3 class="-mb-4">Badges</h3>

        <div class="flex gap-3 flex-wrap">
          <Badge
            v-for="variant in btnvariants"
            :key='variant + "badge"'
            :variant="variant"
            size="lg"
          >
            {{ variant }}
          </Badge>

          <Badge
            v-for="theme in themes"
            :key='theme + "badge"'
            :theme="theme"
            size="lg"
          >
            {{ theme }}
          </Badge>
        </div>
      </div>

      <!-- second column -->
      <div class="border-l border-r border-outline-gray-2 px-5">
        <h2 class="inline-flex gap-2 items-center mb-6">
          <span class="p-2 rounded-full bg-surface-gray-3">
            <LucideType class="size-4" />
          </span>
          Components
        </h2>

        <h3 class="mb-3">Buttons</h3>

        <div class="flex gap-3 flex-wrap">
          <Button
            v-for="variant in btnvariants"
            :key="variant"
            :variant="variant"
            size="md"
          >
            {{ variant }}
          </Button>

          <Button size="md">
            <template #prefix>
              <LucideCheck class="size-5" />
            </template>
            Check
          </Button>

          <Button size="md">
            <template #icon>
              <LucideSun class="size-5" />
            </template>
          </Button>
        </div>

        <!-- inputs -->
        <div
          class="mt-4 border-t border-outline-gray-2 pt-4 grid gap-y-5 gap-x-3 grid-cols-2"
        >
          <FormControl
            v-model="formState.name"
            type="text"
            label="Name"
            placeholder="Enter name"
          />
          <FormControl
            v-model="formState.age"
            type="number"
            label="Age"
            placeholder="Enter age"
          />

          <FormControl
            type="select"
            v-model="formState.profession"
            label="Profession"
            placeholder="Select option"
            :options="professionOptions"
          >
            <template #prefix>
              <LucideUserCog class="size-4" />
            </template>
          </FormControl>

          <div>
            <FormLabel label="Joining Date" class="mb-2"></FormLabel>
            <MonthPicker v-model="formState.joining" />
          </div>

          <div class="col-span-2">
            <FormLabel label="Multiple Select" class="mb-2"></FormLabel>
            <MultiSelect
              v-model="formState.multiple"
              :options="professionOptions"
            />
          </div>

          <Progress
            :value="formCompleteStatus"
            size="md"
            label="Form Filled Status"
            :hint="true"
            class="border border-outline-gray-2 p-3 rounded col-span-2"
          />
        </div>
      </div>

      <!-- third column -->
      <div class="grid pl-5">
        <h2 class="inline-flex gap-2 items-center mb-6">
          <span class="p-2 rounded-full bg-surface-gray-3">
            <LucideType class="size-4" />
          </span>
          Typography Scale
        </h2>

        <div
          v-for="item in typeScale"
          :key="item.label"
          class="mb-5 last:mb-0"
        >
          <div :class="item.class">
            {{ item.label }}
          </div>

          <div class="mt-2 text-xs text-ink-gray-5 flex">
            {{ item.meta }}
            <span class="text-ink-violet-1 ml-auto">
              {{ item.class.split(" ")[0] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
