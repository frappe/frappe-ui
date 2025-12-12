<script setup lang="ts">
import { ref } from "vue";
import Story from "../Story.vue";

import TabButtons from "./TabButtons.vue";

const currentTab = ref("mytasks");
</script>

<template>
  <div class="flex w-4/5">
    <Story>
      <TabButtons
        :buttons='
          [
            { label: "Tasks assigned to me", value: "mytasks" },
            { label: "Tasks created by me", value: "created" },
          ]
        '
        v-model="currentTab"
      />
    </Story>
  </div>
</template>
