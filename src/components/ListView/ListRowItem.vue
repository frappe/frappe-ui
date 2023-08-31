<script setup></script>

<template>
  <div
    class="flex min-h-[1.5rem] flex-1 items-center space-x-2 truncate text-base"
    :class="$attrs.class"
  >
    <slot> </slot>
  </div>
</template>
