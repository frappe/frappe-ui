<script setup lang="ts">
// The Kanban card page: the deals board from the file's core screen, its
// cards free to move between stages. One screen, so no outline.
import DealsBoard from './DealsBoard.vue'
</script>

<template>
  <div class="v2-scroll h-full overflow-y-auto px-5 py-20">
    <DealsBoard />
  </div>
</template>
