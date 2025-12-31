<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vitepress";

interface Heading {
  type: string;
  name: string;
  id: string;
}

const headings = ref<Heading[]>([]);

const setHeadings = () => {
  const elements = Array.from(document.querySelectorAll("h2, h3"));

  headings.value = elements.map((el) => ({
    type: el.tagName.toLowerCase(),
    name: el.textContent?.trim(),
    id: el.id,
  }));
};

const route = useRoute();

onMounted(setHeadings);
watch(route, setHeadings);
</script>

<template>
  <aside class="sticky top-24 hidden lg:flex flex-col h-fit mt-10 leading-relaxed">
    <span class="font-medium whitespace-nowrap pl-3">On this page</span>

    <a
      v-for="x in headings"
      :href="`#${x.id}`"
      class="text-ink-gray-6 whitespace-nowrap !no-underline pl-4 py-1"
			:class="{'pl-7': x.type =='h3', 'border-l':true}"
    >
      {{ x.name }}
    </a>
  </aside>
</template>
