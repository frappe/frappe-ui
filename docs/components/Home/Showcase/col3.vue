<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Button, Password, Progress, Tree } from "frappe-ui";

import LucideFolder from "~icons/lucide/folder";
import LucideFile from "~icons/lucide/file";
import LucideShield from "~icons/lucide/shield-plus";
import LucideChevronRight from "~icons/lucide/chevron-right";
import { isFunctionDeclaration } from "typescript";

const treeState = reactive({
  showIndentationGuides: true,
  rowHeight: "25px",
  indentWidth: "15px",
  node: {
    name: "guest",
    label: "Guest",
    isCollapsed: true,
    children: [
      {
        name: "downloads",
        label: "Downloads",
        children: [
          {
            name: "Images",
            label: "download.zip",
            children: [
              {
                name: "image.png",
                label: "image.png",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "documents",
        label: "Documents",
        children: [
          {
            name: "somefile.txt",
            label: "somefile.txt",
            children: [],
          },
          {
            name: "somefile.pdf",
            label: "somefile.pdf",
            children: [],
          },
        ],
      },
    ],
  },
});
</script>

<template>
  <div
    class="grid gap-5 *:rounded *:border [&_label]:text-ink-gray-9 [&_label]:mb-2 [&_label]:text-base"
  >
    <div class="p-5 bg-surface-cards h-fit">
      <Tree
        :options="
          {
            showIndentationGuides: treeState.showIndentationGuides,
            rowHeight: treeState.rowHeight,
            indentWidth: treeState.indentWidth,
            defaultCollapsed: false,
          }
        "
        nodeKey="name"
        :node="treeState.node"
      >
        <template #node="{ node, hasChildren, isCollapsed, toggleCollapsed }">
          <button
            class="flex items-center gap-2 mb-3 cursor-pointer"
            @click="toggleCollapsed"
          >
            <LucideChevronRight
              v-if="hasChildren"
              class="size-4 transition-transform"
              :class='{ "rotate-90": isCollapsed }'
            />

            <LucideFolder v-if="hasChildren" class="size-4" />
            <LucideFile v-else class="size-4 ml-2" />

            {{ node.name }}
          </button>
        </template>
      </Tree>
    </div>

    <div class="prose prose-sm p-5 pt-3 grid gap-3">
      <h3 class="flex items-center gap-2 border-b pb-3">
        <LucideShield class="size-5" />
        Create Password
      </h3>

      <p>
        To ensure the safety and security of your account, its essential to
        create a strong password
      </p>

      <div class="grid">
        <label class="!text-ink-gray-5">Password</label>
        <Password placeholder="Enter password" variant="outline" />
      </div>

      <Progress
        label="Password Strength"
        class="[&_label]:text-ink-gray-5 mt-3"
        :value="30"
        :hint="true"
				size='md'
      >
        <template #hint>
          <span class="text-sm text-ink-red-3">
            Weak
          </span>
        </template>
      </Progress>

      <div class="px-8 !py-3 rounded bg-surface-gray-2 text-sm text-ink-gray-5">
          <li class='line-through'>Includes 9-16 characters</li>
          <li>Combines letters and numbers</li>
          <li>A special character #@$%^&*_?@~</li>
      </div>

      <Button variant="solid" class="w-full py-4">
        Create password
      </Button>
    </div>
  </div>
</template>
