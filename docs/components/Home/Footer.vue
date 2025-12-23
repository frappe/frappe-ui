<script setup lang="ts">
import LucideGithub from "~icons/lucide/github";
import { Button } from "frappe-ui";
</script>

<template>
  <footer class="border-t p-10 text-gray-50 bg-gray-900 mt-20">
    <div class="max-w-7xl flex [&_a]:text-ink-gray-3 [&_a]:dark:text-ink-gray-5 gap-5 mx-auto ">
      <section class="flex flex-col gap-4">
        <div class="flex gap-3 items-center">
          <img src="/log.svg" class="w-8" />
          <h2 class="text-3xl">Frappe UI</h2>
        </div>

        <p class="text-lg text-ink-gray-3 dark:text-ink-gray-5 max-w-sm leading-relaxed">
          A powerful UI component library made and used with ease. Consistent
          design system.
        </p>
      </section>

      <section class="flex flex-col gap-4 ml-auto mr-20">
        <b> Product </b>
        <a href="/docs/badge"> Components </a>
        <a href="/"> Design system </a>
      </section>

      <section class="flex flex-col gap-4">
        <b>Resources </b>
        <a>Documentation</a>
        <a>Blog</a>
        <a>Changelog</a>
      </section>
    </div>
  </footer>
</template>
