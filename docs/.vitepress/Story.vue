<script setup></script>
<template>
  <div class="flex w-full items-center justify-center rounded-lg border p-4">
    <div>
      <slot name="code" />
    </div>
    <slot />
  </div>
</template>
