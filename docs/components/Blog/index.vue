<script setup lang="ts">
const props = defineProps<{
  data: any;
}>();
</script>

<template>
  <div class="grid gap-5 md:mt-10 vp-style-raw">
		<b class='text-3xl font-semibold mb-5 '>Blog</b>

		<div class='grid grid-cols-3'>

    <a
      v-for="item in data"
      :href="item.url"
      class="grid gap-3  border border-outine-gray-2 p-5"
    >
      <b  class="text-lg font-semibold">
        {{ item.frontmatter.title }}
      </b>
      <p class="leading-relaxed text-ink-gray-6">{{ item.frontmatter.description }}</p>

      <div class="flex gap-2 items-center">
        <span
          v-for="tag in item.frontmatter.tags"
          class="bg-surface-gray-3 p-1 px-2 text-sm rounded"
        >
          {{ tag }}</span>
      </div>
    </a>
		</div>
  </div>
</template>
