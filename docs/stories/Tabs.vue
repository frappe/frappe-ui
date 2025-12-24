<script setup lang="ts">
import { reactive } from "vue";
import { Tabs } from "frappe-ui";
import Story from "@/components/Story.vue";
import LucideGithub from "~icons/lucide/github";
import LucideTwitter from "~icons/lucide/twitter";
import LucideLinkedin from "~icons/lucide/linkedin";

const state = reactive({
  index: 0,
  tabs_without_icon: [
    {
      label: "Github",
      content:
        "Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.",
    },
    {
      label: "Twitter",
      content:
        'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
    },
    {
      label: "Linkedin",
      content:
        "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.",
    },
  ],

  tabs_with_icon: [
    {
      label: "Github",
      content:
        "Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.",
      icon: LucideGithub,
    },
    {
      label: "Twitter",
      content:
        'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
      icon: LucideTwitter,
    },
    {
      label: "Linkedin",
      content:
        "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.",
      icon: LucideLinkedin,
    },
  ],
});
</script>

<template>
  <div class="grid gap-5">
    <Story title="Tabs without icons">
      <Tabs
        class="border rounded"
        v-model="state.index"
        :tabs="state.tabs_without_icon"
      >
        <template #tab-panel="{ tab }">
          <div class="p-5">{{ tab.content }}</div>
        </template>
      </Tabs>
    </Story>

    <Story title="Tabs with icons">
      <Tabs
        class="border rounded"
        v-model="state.index"
        :tabs="state.tabs_with_icon"
      >
        <template #tab-panel="{ tab }">
          <div class="p-5">{{ tab.content }}</div>
        </template>
      </Tabs>
    </Story>

    <Story title="Vertical tabs with icons">
      <Tabs
        class="border rounded"
        v-model="state.index"
        :tabs="state.tabs_with_icon"
        :vertical="true"
      >
        <template #tab-panel="{ tab }">
          <div class="p-5">{{ tab.content }}</div>
        </template>
      </Tabs>
    </Story>
  </div>
</template>
