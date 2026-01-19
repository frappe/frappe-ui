<script setup lang="ts">
import { ref } from "vue";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Progress,
  Select,
  Slider,
  Switch,
} from "frappe-ui";
import LucideCoins from "~icons/lucide/circle-dollar-sign";
import LucideUsers from "~icons/lucide/users";
import LucideVideo from "~icons/lucide/video";
import LucideMapPin from "~icons/lucide/map-pin";
import LucideClock from "~icons/lucide/clock";
import LucideCalendar from "~icons/lucide/calendar";
import LucideX from "~icons/lucide/x";
import LucideLink from "~icons/lucide/send";

const imgs = [
  "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
  'https://avatars.githubusercontent.com/u/2798204?s=70&v=4',
  'https://avatars.githubusercontent.com/u/28706372?s=96&v=4',
  'https://avatars.githubusercontent.com/u/1493221?s=70&v=4',
];

const progressVal = ref(1);
const checkboxVal = ref(true);

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

const slider2Val = ref([20, 50]);
const switchVal = ref(true);

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

const toggledDiv = ref(false);
</script>

<template>
  <section
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base h-fit"
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
          {{ tag }}
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
        <Button @click="decProgress">Back</Button>
        <Button @click="incProgress" variant="solid">Next</Button>
      </div>
    </div>

    <div class="p-4 pt-3 flex flex-col gap-3">
      <div class="flex items-center gap-2 justify-between">
        <span class="flex gap-2">
          <LucideCoins class="size-4" />
          Price range
        </span>
        <Badge size="lg" class="!p-3 !py-4 !rounded">
          ${{ slider2Val[0] * 10 }} - ${{ slider2Val[1] * 10 }}
        </Badge>
      </div>

      <Slider v-model="slider2Val" class="w-full" />

      <div class="flex gap-3 items-center justify-between">
        <span>$0</span>
        <span>$1000</span>
      </div>
    </div>

    <div class="grid p-5 gap-y-3 gap-x-4">
      <div class="flex gap-3 justify-between">
        <div class="grid gap-2">
          <span class="text-ink-gray-9">Smart compose</span>
          <p class="text-ink-gray-5">
            Enable predictive suggestions
          </p>
        </div>
        <Switch v-model="switchVal" />
      </div>

      <hr />

      <div class="flex gap-2 justify-between">
        <div class="grid gap-2">
          <span class="text-ink-gray-9">Inline completions</span>
          <p class="text-ink-gray-5">
            Auto completions as you type
          </p>
        </div>
        <Switch />
      </div>
    </div>

    <div
      class="p-5 transition-all duration-200"
      :class='{ "border-outline-gray-5": checkboxVal }'
    >
      <Checkbox
        v-model="checkboxVal"
        label="I agree to the terms and conditions"
        size="md"
        class="gap-3 [&_label]:!m-0"
      />
    </div>

    <div
      class="p-4 grid"
      :class='{ "animate-bounce bg-surface-white shadow-lg": toggledDiv }'
    >
      <h3 class="text-xl mb-2 font-semibold flex gap-3 justify-between">
        Schedule an event
        <LucideX class="size-5" @click="toggledDiv = !toggledDiv" />
      </h3>

      <span class="leading-relaxed mb-1">Product marketing</span>
      <p class="leading-relaxed text-ink-gray-5 mb-2">
        Discussion of new marketing strategies and pricing for the new project
      </p>

      <div
        class="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 items-center border-t"
      >
        <LucideUsers class="size-4 row-span-2 mb-auto" />

        <div>
          Add guests <br />

          <span
            class="flex gap-1 items-center whitespace-nowrap text-sm w-fit h-fit mt-2 text-ink-gray-5"
          >
            <Avatar
              size="sm"
              :image="imgs[0]"
              class="border-2 border-surface-white"
            />
            <Avatar
              size="sm"
              :image="imgs[0]"
              class="border-2 border-surface-white -ml-2"
            />

            1 awaiting
          </span>
        </div>

        <Select
          :options='["Send Invite"]'
          defaultValue="Send Invite"
        />
      </div>

      <span
        class="flex items-center gap-2 border-y py-2 items text-sm text-ink-gray-6"
      >
        <LucideClock class="size-4" />
        4:00 PM - 5:00 PM
        <LucideCalendar class="size-4 ml-auto" />
        Oct 19 2023
      </span>

      <div class="flex items-center gap-2 pt-2">
        <LucideVideo class="size-4" />
        <span>Location</span>

        <Button thme="blue" class="ml-auto">
          <template #prefix>
            <LucideMapPin class="size-4" />
          </template>
          Remote
        </Button>

        <Button variant="solid" size="sm" class="px-3">
          <template #icon>
            <LucideLink class="size-4 shrink-0" />
          </template>
        </Button>
      </div>
    </div>
  </section>
</template>
