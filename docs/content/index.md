---
layout: recipes
description:
  Full-page, high-fidelity screens built with frappe-ui, modeled on Frappe
  products.
---

<script setup>
import Hero from '@/components/Home/Hero.vue'
import RecipeExample from '@/components/recipes/RecipeExample.vue'
</script>

<Hero class="not-prose" />

<RecipeExample base="discussions" eager>
<template #desktop>

<<< ../components/recipes/DiscussionsDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/DiscussionsMobile.vue

</template>
</RecipeExample>

<RecipeExample base="compose">
<template #desktop>

<<< ../components/recipes/ComposeDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/ComposeMobile.vue

</template>
</RecipeExample>

<RecipeExample base="deals">
<template #desktop>

<<< ../components/recipes/DealsDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/DealsMobile.vue

</template>
</RecipeExample>

<RecipeExample base="tickets">
<template #desktop>

<<< ../components/recipes/TicketsDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/TicketsMobile.vue

</template>
</RecipeExample>

<RecipeExample base="mail">
<template #desktop>

<<< ../components/recipes/MailDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/MailMobile.vue

</template>
</RecipeExample>

<RecipeExample base="files">
<template #desktop>

<<< ../components/recipes/FilesDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/FilesMobile.vue

</template>
</RecipeExample>

<RecipeExample base="tasks">
<template #desktop>

<<< ../components/recipes/TasksDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/TasksMobile.vue

</template>
</RecipeExample>

<RecipeExample base="accounting" height="820px">
<template #desktop>

<<< ../components/recipes/AccountingDesktop.vue

</template>
<template #mobile>

<<< ../components/recipes/AccountingMobile.vue

</template>
</RecipeExample>
