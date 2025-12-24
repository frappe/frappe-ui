<script setup lang="ts">
import LucideKeyboard from "~icons/lucide/keyboard";
import LucideEye from "~icons/lucide/eye";
import LucideShieldCheck from "~icons/lucide/shield-check";
import LucideFocus from "~icons/lucide/focus";

import { Dropdown } from "frappe-ui";

const accessibilityFeatures = [
  {
    label: "Keyboard navigation",
    icon: LucideKeyboard,
  },
  {
    label: "Screen reader support",
    icon: LucideEye,
  },
  {
    label: "WAI-ARIA compliant",
    icon: LucideShieldCheck,
  },
  {
    label: "Focus management",
    icon: LucideFocus,
  },
];

const options = [
  {
    label: "New",
    icon: "plus",
    submenu: [
      {
        group: "Documents",
        items: [
          {
            label: "New Document",
            icon: "file-plus",
            onClick: () => console.log("New Document clicked"),
          },
          {
            label: "New Template",
            icon: "file-text",
            onClick: () => console.log("New Template clicked"),
          },
          {
            label: "Delete",
            icon: "trash-2",
            theme: "red",
            onClick: () => console.log("Delete clicked"),
          },
        ],
      },
      {
        group: "Organization",
        items: [
          {
            label: "New Folder",
            icon: "folder-plus",
            onClick: () => console.log("New Folder clicked"),
          },
          {
            label: "New Project",
            icon: "briefcase",
            onClick: () => console.log("New Project clicked"),
          },
        ],
      },
    ],
  },
  {
    label: "Edit",
    icon: "edit",
    onClick: () => console.log("Edit clicked"),
  },
  {
    label: "Share",
    icon: "share",
    submenu: [
      {
        label: "Share with Link",
        icon: "link",
        onClick: () => console.log("Share with Link clicked"),
      },
      {
        label: "Share with Email",
        icon: "mail",
        onClick: () => console.log("Share with Email clicked"),
      },
      {
        group: "Advanced",
        items: [
          {
            label: "Share Settings",
            icon: "settings",
            onClick: () => console.log("Share Settings clicked"),
          },
          {
            label: "Permission Management",
            icon: "shield",
            onClick: () => console.log("Permission Management clicked"),
          },
        ],
      },
    ],
  },
  {
    label: "Collaborate",
    switch: true,
    icon: "file-text",
  },
];
</script>

<template>
  <section class="max-w-7xl px-6 my-12 grid grid-cols-2 gap-5 mx-auto">
    <div>
      <h1 class="text-[2.7rem] font-bold text-ink-gray-9 mb-4">
        Accessibility <span class="text-ink-violet-1"
        >out of <br /> the box.</span>
      </h1>

      <p
        class="text-xl max-w-2xl text-ink-gray-5 leading-relaxed mb-6"
      >
        Frappe-UI components are built on top of
        <a
          href="https://reka-ui.com/"
          target="_blank"
          class="underline"
        >Reka-ui</a>
        ensuring good accessibility support.
      </p>

      <div class="grid grid-cols-2 gap-3">
        <ul
          v-for="feature in accessibilityFeatures"
          :key="feature.label"
          class="flex bg-surface-gray-1 p-3 rounded gap-3"
        >
          <component :is="feature.icon" class="size-4" />
          <span>{{ feature.label }}</span>
        </ul>
      </div>
    </div>

    <div class="bg-surface-cards p-5 rounded flex">
      <Dropdown
			:options
        placement="center"
        class="m-auto"
        size="lg"
      />
    </div>
  </section>
</template>
