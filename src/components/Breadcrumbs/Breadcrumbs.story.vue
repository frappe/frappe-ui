<script setup lang="ts">
import Breadcrumbs from "./Breadcrumbs.vue";
import Story from "../Story.vue";
import LucideHouse from "~icons/lucide/house";
import LucideList from "~icons/lucide/list";
import LucideView from "~icons/lucide/user-star";
</script>

<template>
  <div class="grid gap-5 grid-cols-2">
    <Story title='With route option'>
      <Breadcrumbs
        :items='
          [
            { label: "Home", route: { name: "Home" } },
            { label: "Views", route: "/components" },
            { label: "List", route: "/components/breadcrumbs" },
          ]
        '
      />
    </Story>

    <Story title='With onClick option'>
      <Breadcrumbs
        :items='
          [
            { label: "Home", onClick: () => console.log("Home clicked") },
            {
              label: "Views",
              onClick: () => console.log("Views clicked"),
            },
            {
              label: "Kanban",
              onClick: () => console.log("Kanban clicked"),
            },
          ]
        '
      />
    </Story>

    <Story title='With prefix slot'>
      <Breadcrumbs
        :items='
          [
            { label: "Home", icon: LucideHouse, route: { name: "Home" } },
            { label: "Views", icon: LucideView, route: "/components" },
            {
              label: "List",
              icon: LucideList,
              route: "/components/breadcrumbs",
            },
          ]
        '
      >
        <template #prefix="{ item }">
					<component :is="item.icon" class="size-4 mr-1" />
        </template>
      </Breadcrumbs>
    </Story>
  </div>
</template>
