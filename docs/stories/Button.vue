<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "frappe-ui";
import Story from "@/components/Story.vue";
import LucideBolt from "~icons/lucide/bolt";
import LucideDownload from "~icons/lucide/download";
import LucideArrowRight from "~icons/lucide/arrow-right";

const state = reactive({
  theme: "gray",
  size: "sm",
  label: "Button",
  loading: false,
  loadingText: null,
  disabled: false,
  link: null,
  tooltip: "Hover for more!",
});

const variants = ["solid", "subtle", "outline", "ghost"];
const themes = ["gray", "blue", "green", "red"];
const sizes = ["sm", "md", "lg", "xl", "2xl"];
</script>

<template>
  <div class="grid gap-6">
    <Story title="Variants" preview-css="flex gap-3">
      <Button
        :key="variant"
        v-for="variant in variants"
        :variant="variant"
        size="md"
      >{{ state.label }}</Button>
    </Story>

    <Story title="sizes">
      <div
        class="p-1 flex flex-wrap gap-3 items-center"
      >
        <Button v-for="size in sizes" :size="size">{{ state.label }}</Button>
      </div>
    </Story>

    <Story
      :title="theme"
      v-for="theme in themes"
      preview-css="flex gap-3"
    >
      <Button
        size="md"
        v-for="variant in variants"
        :theme="theme"
        :variant="variant"
      >
        {{ variant }}
      </Button>
    </Story>

    <Story title="With Icons" preview-css='flex gap-3'>
      <Button>
        <template #icon>
          <LucideBolt class="size-4" />
        </template>
      </Button>

      <Button>
        <template #prefix>
          <LucideDownload class="size-4" />
        </template>

				Download

      </Button>

			<Button>
				<template #suffix>
					<LucideArrowRight class="size-4" />
				</template>

				Get Started
			</Button>
    </Story>
  </div>
</template>
