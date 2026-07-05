---
layout: recipes
title: Recipes
description:
  Full-page, high-fidelity screens built with frappe-ui, modeled on Frappe
  products.
---

<script setup>
import { Button } from 'frappe-ui'
import RecipeExample from '@/components/recipes/RecipeExample.vue'
</script>

<div class="not-prose border-outline-gray-1 text-center">
  <h1 class="max-w-3xl text-balance text-4xl tracking-tight text-ink-gray-9 sm:text-6xl-semibold mx-auto">
    Build beautiful apps, fast
  </h1>
  <p class="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-ink-gray-6 sm:text-lg mx-auto">
     Battle-tested components, polished over years of real-world use.
  </p>
  <div class="mt-4">
    <Button link="/docs" icon-right="lucide-arrow-right">Get Started</Button>
  </div>
</div>

<RecipeExample base="discussions">
<template #desktop>

<<< ../../components/recipes/DiscussionsDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/DiscussionsMobile.vue

</template>
</RecipeExample>

<RecipeExample base="compose">
<template #desktop>

<<< ../../components/recipes/ComposeDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/ComposeMobile.vue

</template>
</RecipeExample>

<RecipeExample base="deals">
<template #desktop>

<<< ../../components/recipes/DealsDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/DealsMobile.vue

</template>
</RecipeExample>

<RecipeExample base="tickets">
<template #desktop>

<<< ../../components/recipes/TicketsDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/TicketsMobile.vue

</template>
</RecipeExample>

<RecipeExample base="mail">
<template #desktop>

<<< ../../components/recipes/MailDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/MailMobile.vue

</template>
</RecipeExample>

<RecipeExample base="files">
<template #desktop>

<<< ../../components/recipes/FilesDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/FilesMobile.vue

</template>
</RecipeExample>

<RecipeExample base="tasks">
<template #desktop>

<<< ../../components/recipes/TasksDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/TasksMobile.vue

</template>
</RecipeExample>

<RecipeExample base="accounting" height="820px">
<template #desktop>

<<< ../../components/recipes/AccountingDesktop.vue

</template>
<template #mobile>

<<< ../../components/recipes/AccountingMobile.vue

</template>
</RecipeExample>
