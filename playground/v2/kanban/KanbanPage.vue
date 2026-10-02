<script setup lang="ts">
// The Kanban card page: the deals board from the file's core screen, its
// cards free to move between stages. One screen, so no outline.
import DealsBoard from './DealsBoard.vue'
</script>

<template>
  <!-- 20px around the 850px columns keeps the board inside the stage -->
  <div class="v2-scroll h-full overflow-y-auto p-5">
    <DealsBoard />
  </div>
</template>
