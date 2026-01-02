<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Avatar, Badge, Button, Password, Progress } from "frappe-ui";

const imgs = [
  "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
  "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
  "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
  "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
];

const progressVal = ref(1);

const incProgress = () => {
  if (progressVal.value < 3) {
    progressVal.value += 1;
  }
};

const decProgress = () => {
  if (progressVal.value > 1) {
    progressVal.value -= 1;
  }
};

const themes = ["green", "red", "blue", "yellow", "gray"];

const progressData = [
  {
    title: "Objection Handling",
    desc:
      "In this objection handling role-play scenario, participants will engage in a simulated sales interaction.",
    tags: ["Communication", "Negotiation"],
  },

  {
    title: "Business Development",
    desc:
      "In this business development role-play scenario, participants will engage in a simulated sales interaction.",
    tags: ["Strategy", "Customer support"],
  },

  {
    title: "Marketing Strategy",
    desc:
      "In this marketing strategy role-play scenario, participants will engage in a simulated sales interaction.",
    tags: ["Strategy", "Analytics"],
  },
];
</script>

<template>
  <div
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base"
  >
    <div class="p-5 h-fit prose prose-sm">
      <Progress
        :value="progressVal * 30"
        :intervals="true"
        :interval-count="3"
        size="md"
        class="-mb-2"
      />

      <h3>
        {{ progressData[progressVal - 1].title }}
      </h3>

      <p class="leading-relaxed">
        {{ progressData[progressVal - 1].desc }}
      </p>

      <div class="flex gap-2 flex-wrap items-center not-prose mt-3">
        <Badge
          v-for="(tag, tagIndex) in progressData[progressVal - 1].tags"
          :key="tag"
          :theme='themes[tagIndex] || "gray"'
          size="lg"
          class="rounded-sm"
        >
          {{
            themes[Math.floor(Math.random() * themes.length)] ||
              "gray"
          }}
        </Badge>
      </div>

      <div class="flex items-center not-prose mt-4 ml-2">
        <Avatar
          size="xl"
          v-for="img in imgs"
          :key="img"
          :image="img"
          class="border-2 border-surface-white -ml-2"
        />

        <span class="ml-3 text-sm !text-ink-gray-9">
          + 5 more
        </span>
      </div>

      <div
        class="grid grid-cols-2 mt-3 gap-3 *:py-4 border-t rounded pt-3"
      >
        <Button @click="decProgress">Skip</Button>
        <Button @click="incProgress" variant="solid">Next</Button>
      </div>
    </div>

  </div>
</template>
