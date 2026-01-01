<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Button } from "frappe-ui";
import LucideSun from "~icons/lucide/sun";
import LucideMoon from "~icons/lucide/moon-star";
import LucideSearch from "~icons/lucide/search";
import LucideMenu from "~icons/lucide/menu";
import LucideSide from "~icons/lucide/panel-right";
import GithubIcon from "./Icons/Github.vue";
import LucideRight from "~icons/lucide/chevron-right";

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

const routes = computed(() => {
  let arr = route.path.split("/");
  arr = arr.filter((x) => !["/", ""].includes(x));

  return arr.map((x, i) => {
    let prevlinks = arr.slice(0, i + 1).join("/");
    return { text: x, link: "/" + prevlinks };
  });
});

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

      <!-- minimal breadcrumbs -->
      <div class="hidden lg:flex items-center gap-3">
        <a
          v-for="(x, i) in routes"
          class="capitalize flex gap-2 items-center text-ink-gray-5"
          :class='{ "text-ink-gray-9": i === routes.length - 1 }'
          :href="x.link"
        >
          <LucideRight class="size-4" />
          {{ x.text }}
        </a>
      </div>

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
        class="gap-3 lg:flex items-center w-full ml-auto lg:w-auto"
        :class='{ "flex": state.mobnavbar, "hidden": !state.mobnavbar }'
      >
        <a href="/docs">Docs</a>

        <Button class="hidden lg:flex">
          <template #prefix>
            <LucideSearch class="size-4" />
          </template>
          Search
        </Button>

        <Button @click="toggleTheme" class="rounded">
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
