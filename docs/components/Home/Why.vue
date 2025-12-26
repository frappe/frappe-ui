<script setup lang="ts">
import LucidePalette from "~icons/lucide/palette";
import LucideZap from "~icons/lucide/zap";
import LucideMoon from "~icons/lucide/moon";
import LucideCode from "~icons/lucide/code";
import LucideAccessibility from "~icons/lucide/accessibility";
import LucideSparkles from "~icons/lucide/sparkles";

type Section = {
  title: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
};

const sections: Section[] = [
  {
    title: "Themeable",
    description:
      "Override default colors by just changing the css variables.Usage of semantic colors makes components consistent.",
    icon: LucidePalette,
    iconBg: "bg-surface-gray-2",
    iconColor: "text-ink-gray-8",
  },
  {
    title: "Fast",
    description:
      "Built on top of Tailwind CSS, which means no runtime styles, and no unnecessary classes in your bundle.",
    icon: LucideZap,
    iconBg: "bg-surface-amber-2",
    iconColor: "text-ink-amber-3",
  },
  {
    title: "Light & Dark UI",
    description:
      "Automatic dark mode recognition, Frappe UI automatically changes the theme when detects HTML theme prop changes.",
    icon: LucideMoon,
    iconBg: "bg-surface-violet-1",
    iconColor: "text-ink-violet-1",
  },
  {
    title: "Unique DX",
    description:
      "Frappe UI is fully-typed to minimize the learning curve, and provide the best possible developer experience.",
    icon: LucideCode,
    iconBg: "bg-surface-green-2",
    iconColor: "text-ink-green-3",
  },
  {
    title: "Accessible",
    description:
      "Since Frappe UI is based on Reka-ui, you get accessibility ouf of the box. Built with WAI-ARIA guidelines in mind.",
    icon: LucideAccessibility,
    iconBg: "bg-surface-cyan-1",
    iconColor: "text-ink-cyan-1",
  },
  {
    title: "Beautiful",
    description:
      "Every component is crafted with attention to detail based on the Espresso design system, ensuring your UI looks stunning right out of the box.",
    icon: LucideSparkles,
    iconBg: "bg-surface-blue-2",
    iconColor: "text-ink-blue-3",
  },
];
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-12">
    <h1 class="text-[2rem] md:text-[2.7rem] font-bold text-center text-ink-gray-9 mb-8">
      Build for <span class="text-ink-violet-1">developers</span>
    </h1>

    <p
      class="text-2xl max-w-2xl text-center mx-auto text-ink-gray-5 leading-relaxed mb-12"
    >
	Frappe UI provides solid defaults aiming less work done by developers.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="section in sections"
        :key="section.title"
        class="
          rounded
          bg-surface-cards
          border border-outline-gray-2
          p-6
        "
      >
        <div
          class="size-12 rounded-lg flex items-center justify-center mb-5"
          :class="section.iconBg"
        >
          <component
            :is="section.icon"
            class="size-6"
            :class="section.iconColor"
          />
        </div>

        <h3 class="text-lg font-semibold text-ink-gray-9 mb-2">
          {{ section.title }}
        </h3>

        <p class="text-ink-gray-5 leading-6">
          {{ section.description }}
        </p>
      </div>
    </div>
  </main>
</template>
