<script setup>
import { onMounted, ref, watch } from "vue";
import { Button } from "frappe-ui";
import LucideSun from "~icons/lucide/sun";
import LucideMoon from "~icons/lucide/moon-star";
import LucideSearch from "~icons/lucide/search";
import LucideMenu from "~icons/lucide/menu";
import LucideSide from "~icons/lucide/panel-right";
import GithubIcon from "./Icons/Github.vue";

import { useRoute } from "vitepress";

import { state } from "../state";

const theme = ref();

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme.value);
};

const toggleMobSidebar = () => {
  state.mobsidebar = !state.mobsidebar;
};

const toggleNavbar = () => {
  state.mobnavbar = !state.mobnavbar;
};

onMounted(() => {
  theme.value = document.documentElement.getAttribute("data-theme");
});

defineProps({
  isDocs: {
    type: Boolean,
  },
});

const route = useRoute();

watch(route, (x) => {
  state.mobnavbar = false;
  state.mobsidebar = false;
});
</script>

<template>
  <nav class="border-b sticky top-0 bg-surface-white !z-50">
    <div
      class="py-3 px-5 flex items-center gap-3 flex-wrap"
      :class='{ "max-w-[1440px] mx-auto": !isDocs }'
    >
      <span
        class="flex gap-3 items-center mr-auto lg:mr-0"
        :class='{ "lg:hidden": isDocs }'
      >
        <img src="/logo.svg" class="w-5" />
        <a href="/" class="font-medium">Frappe UI</a>
      </span>

      <Button class="lg:mr-auto hidden lg:flex">
        <template #prefix>
          <LucideSearch class="size-4" />
        </template>
        Search
      </Button>

      <Button v-if="isDocs" @click="toggleMobSidebar" class="lg:hidden">
        <template #icon>
          <LucideSide class="size-4" />
        </template>
      </Button>

      <Button @click="toggleNavbar" class="lg:hidden">
        <template #icon>
          <LucideMenu class="size-4" />
        </template>
      </Button>

      <div
        class="gap-3 lg:flex items-center w-full lg:w-auto"
        :class='{ "flex": state.mobnavbar, "hidden": !state.mobnavbar }'
      >
        <a href="/docs/getting-started">Docs</a>

        <Button @click="toggleTheme" class="rounded-full">
          <template #icon>
            <LucideSun v-if='theme === "dark"' class="size-4" />
            <LucideMoon v-else class="size-4" />
          </template>
        </Button>

        <a href="https://github.com/frappe/frappe-ui">
          <GithubIcon />
        </a>
      </div>
    </div>
  </nav>
</template>
