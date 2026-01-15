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
import SearchPopup from "./Search/Popup.vue";

import { state } from "../state";
import { useMagicKeys, whenever } from "@vueuse/core";
import { useRoute } from "vitepress";

const theme = ref();

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.theme = theme.value;
};

const toggleMobSidebar = () => (state.mobsidebar = !state.mobsidebar);
const toggleNavbar = () => (state.mobnavbar = !state.mobnavbar);

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

  const nestedRoutes = state.sidebarList
    .reduce(
      (acc, cur) => [...acc, ...cur.items || []],
      [],
    ).map((x) => ({
      label: x.text,
      value: x.link.split("/").at(-1),
    }))

  const lastpath = arr.at(-1);
  const lastpathLabel = nestedRoutes.find((x) => x.value === lastpath);

  arr[1] = arr[1]?.replaceAll("-", " ");
  arr[arr.length - 1] = lastpathLabel?.label || lastpath;
	arr = arr.filter(x => x != 'docs')

  return arr
});

watch(route, (x) => {
  state.mobnavbar = false;
  state.mobsidebar = false;
});

const { meta_k } = useMagicKeys();

whenever(meta_k, (n) => {
  if (n) state.searchDialog = true;
});
</script>

<template>
  <nav class="border-b sticky top-0 bg-surface-white !z-50">
    <SearchPopup
      v-if="state.searchDialog"
      @close="state.searchDialog = false"
    />

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
      <div v-if="route.path != '/'" class="hidden lg:flex items-center gap-1">
        <template v-for="(x, i) in routes">
          <LucideRight class="size-4 text-ink-gray-5" v-if="i != 0" />
          <span
            class="capitalize flex gap-1 items-center text-ink-gray-5 hover:text-ink-gray-9"
            :class='{ "text-ink-gray-9": i === routes.length - 1 }'
          >
            {{ x }}
          </span>
        </template>
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
        :class="{ flex: state.mobnavbar, hidden: !state.mobnavbar }"
      >
        <a href="/docs" v-if="route.path == '/'">Docs</a>

        <Button class="hidden lg:flex" @click="state.searchDialog = true">
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
