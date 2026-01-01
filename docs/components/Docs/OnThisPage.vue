<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vitepress";

interface Heading {
  type: string;
  name: string;
  id: string;
  scrollPos: number;
}

const headings = ref<Heading[]>([]);
const activeHeading = ref("");

const setHeadings = () => {
  const elements = Array.from(document.querySelectorAll("h2, h3"));

  headings.value = elements.map((el) => ({
    type: el.tagName.toLowerCase(),
    name: el.textContent?.trim(),
    id: el.id,
    scrollPos: el.offsetTop,
  }));
};

const setActiveHeading = () => {
  const curScrollPos = document.documentElement.scrollTop;

  for (let i = 0; i < headings.value.length; i++) {
    if (curScrollPos <= headings.value[i].scrollPos) {
      activeHeading.value = headings.value[i].id;
      break;
    }
  }
};

const route = useRoute();

onMounted(() => {
  setHeadings();
  document.addEventListener("scroll", setActiveHeading);
});

onUnmounted(() => {
  document.removeEventListener("scroll", setActiveHeading);
});

watch(route, setHeadings);
</script>

<template>
  <aside
    class="sticky top-24 hidden lg:flex flex-col h-fit mt-10 leading-relaxed"
  >
    <span class="font-medium whitespace-nowrap pl-3">On this page</span>

    <a
      v-for="x in headings"
      :href="`#${x.id}`"
      class="text-ink-gray-6 whitespace-nowrap !no-underline pl-4 py-1 border-l transition-all duration-500"
      :class='
        {
          "pl-7": x.type == "h3",
          "border-outline-gray-5 text-ink-gray-9": x.id == activeHeading,
        }
      '
    >
      {{ x.name }}
    </a>
  </aside>
</template>
