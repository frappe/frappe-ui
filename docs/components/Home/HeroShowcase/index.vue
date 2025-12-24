<script setup lang="ts">
import Tabs from "./Tabs.vue";
import Progress from "./Progress.vue";
import Charts from "./Charts.vue";
import Notif from "./Notif.vue";
</script>

<template>
  <div class="grid md:flex gap-5 m-auto">
    <div class="grid h-fit gap-5">
      <Tabs />
      <Progress />
    </div>

    <div class="grid h-fit gap-5">
      <Charts />
      <Notif />
    </div>
  </div>
</template>
