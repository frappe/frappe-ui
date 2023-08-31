<script setup></script>

<template>
  <div
    class="flex items-center space-x-2 text-base truncate flex-1 min-h-[1.5rem]"
    :class="$attrs.class"
  >
    <slot> </slot>
  </div>
</template>
