<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { onMounted, provide } from "vue";

const { isDark } = useData();

function applyTheme() {
  const theme = isDark.value ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    isDark.value = saved === "dark";
  }
  applyTheme();
});

provide("toggle-appearance", () => {
  isDark.value = !isDark.value;
  applyTheme();
});
</script>

<template>
  <DefaultTheme.Layout />
</template>
