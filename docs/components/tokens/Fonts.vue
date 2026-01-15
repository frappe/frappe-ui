<script setup>
import { computed, ref } from "vue";
import { Tabs } from "frappe-ui";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const activeTab = ref(0);

const tabs = [
  { label: "Font Size" },
  { label: "Font Weight" },
  { label: "Letter Spacing" },
  { label: "Line Height" },
];

const activeTabLabel = computed(() => tabs[activeTab.value].label);

const text = ref("The quick brown fox jumps over the lazy dog");

const para =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
</script>

<template>
  <div class="grid gap-3">
    <Tabs :tabs v-model="activeTab" class="[&>div]:!px-1 rounded" />

    <template v-if='activeTabLabel === "Font Size"'>
      <div
        v-for="item in data.fontSize"
        :key="item.name"
        class="rounded border border-outline-gray-3 p-4"
      >
        <div class="text-xs opacity-60 mb-1">
          {{ item.name }}
        </div>

        <div
          :style="
            {
              fontSize: item.value[0],
              lineHeight: item.value[1]?.lineHeight,
              letterSpacing: item.value[1]?.letterSpacing,
              fontWeight: item.value[1]?.fontWeight,
            }
          "
        >
          {{ item.name.includes("p") ? para : text }}
        </div>

        <div class="mt-2 text-xs opacity-60">
          {{ item.value[0] }}
          · lh {{ item.value[1]?.lineHeight }}
          · ls {{ item.value[1]?.letterSpacing }}
          · fw {{ item.value[1]?.fontWeight }}
        </div>
      </div>
    </template>

    <template v-if='activeTabLabel === "Font Weight"'>
      <div
        v-for="item in data.fontWeight"
        :key="item.name"
        class="rounded border border-outline-gray-2 p-4"
      >
        <div class="text-sm text-gray-500 mb-1">
          {{ item.name }} ({{ item.value }})
        </div>

        <div
          class="text-base"
          :style="{ fontWeight: item.value }"
        >
          The quick brown fox jumps over the lazy dog
        </div>
      </div>
    </template>

    <template v-if='activeTabLabel === "Letter Spacing"'>
      <div
        v-for="item in data.letterSpacing"
        :key="item.name"
        class="rounded border p-4"
        :style='
          {
            letterSpacing: item.value,
            fontSize: "16px",
          }
        '
      >
        <div class="text-xs opacity-60 mb-2">
          tracking-{{ item.name }} ({{ item.value }})
        </div>
        <div>
          The quick brown fox jumps over the lazy dog
        </div>
      </div>
    </template>

    <template v-if='activeTabLabel === "Line Height"'>
      <div
        v-for="item in data.lineHeight"
        :key="item.name"
        class="rounded border border-outline-gray-2 p-3"
      >
        <div class="text-xs opacity-60 mb-1">
          leading-{{ item.name }}
        </div>

        <p
          class="text-base my-2"
          :style="{ lineHeight: item.value }"
        >
          {{ para }}
        </p>

        <div class="mt-1 text-xs opacity-50">
          {{ item.value }}
        </div>
      </div>
    </template>
  </div>
</template>
