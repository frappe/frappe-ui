<script setup lang="ts">
import { ref } from "vue";
import Story from "@/components/Story.vue";
import { Button, Tooltip } from "frappe-ui";

const placement = ref("top");
const disabled = ref(true);
</script>

<template>
  <div class="grid gap-5 grid-cols-2">
    <Story title="With Text Prop">
      <Tooltip
        text="This action cannot be undone"
        :hover-delay="1"
        :placement="placement"
      >
        <Button theme="red">Delete</Button>
      </Tooltip>
    </Story>

    <Story title="Disabled Tooltip">
      <Tooltip
        text="Disabled tooltip"
        :disabled="disabled"
        :hover-delay="1"
        :placement="placement"
      >
        <Button theme="red">Delete</Button>
      </Tooltip>
    </Story>

    <Story title="With Slot">
      <Tooltip arrow-class="fill-surface-white" :placement="placement">
        <template #body>
          <div
            class="min-w-[6rem] rounded bg-surface-white px-2 py-1 text-xs text-ink-gray-9 shadow-xl"
          >
            Test
          </div>
        </template>
        <Button theme="red">Delete</Button>
      </Tooltip>
    </Story>
  </div>
</template>
