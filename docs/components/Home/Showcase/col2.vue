<script setup lang="ts">
import { reactive, ref } from "vue";
import Tabs from "@/components/Tabs.vue";
import LucideUser from "~icons/lucide/user";
import LucideCog from "~icons/lucide/cog";
import { Button, FormControl, Switch } from "frappe-ui";

const val = ref("profile");
const followed = ref(false);

const tabs = [
  {
    label: "Profile",
    icon: LucideUser,
    value: "profile",
  },
  {
    label: "Settings",
    icon: LucideCog,
    value: "settings",
  },
];

const defaultState = {
  username: "frappe",
  email: "",
  about: " We build world class open-source software products.",
  followers: true,
};

const state = reactive(JSON.parse(JSON.stringify(defaultState)));

const resetState = () => {
  console.log(defaultState, "bruh?");
  Object.assign(state, defaultState);
};
</script>

<template>
  <div
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base"
  >
    <div class="h-fit">
      <Tabs
        :tabs
        v-model="val"
        class="px-3"
      />

      <div
        v-if='val == "profile"'
        class="bg-surface-cards p-5"
      >
        <div class="flex items-center gap-4 mb-4">
          <img src="/frappe-logo.svg" class="!size-14 rounded-full" />

          <div class="flex-1">
            <h4 class="font-semibold text-ink-gray-9">{{ state.username }}</h4>
            <p class="text-sm text-ink-gray-6">{{ state.username }}@zap.io</p>
          </div>

          <Button
            size="md"
            :variant='followed ? "outline" : "solid"'
            @click="followed = !followed"
          >
            {{ followed ? "Unfollow" : "Follow" }}
          </Button>
        </div>

        <p class="text-sm text-ink-gray-7 mb-4 leading-relaxed">
          {{ state.about }}
        </p>

        <div class="flex items-center gap-1 text-sm" v-if="state.followers">
          <span class="font-semibold text-ink-gray-9">4</span>
          <span class="text-ink-gray-6 mr-5">Following</span>
          <span class="font-semibold text-ink-gray-9">97.1K</span>
          <span class="text-ink-gray-6">Followers</span>
        </div>
      </div>

      <div
        v-else
        class="bg-surface-cards p-5 grid gap-5"
      >
        <FormControl
          v-model="state.username"
          label="Username"
          placeholder="Enter username"
          type="text"
        />
        <FormControl
          v-model="state.about"
          label="About"
          placeholder="Enter About"
          type="textarea"
        />

        <div class="flex items-center justify-between -mb-2">
          <Button theme="red" @click="resetState"> Reset</Button>
          <Switch label="Followers" v-model="state.followers" class='[&_label]:!m-0'/>
        </div>
      </div>
    </div>
  </div>
</template>
