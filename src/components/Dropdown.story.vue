<script setup lang="ts">
import { h } from 'vue'
import Dropdown from './Dropdown.vue'
import FeatherIcon from './FeatherIcon.vue'
import Button from './Button.vue'
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="Basic">
      <Dropdown
        :options="[
          {
            label: 'Edit Title',
            onClick: () => {},
            icon: () => h(FeatherIcon, { name: 'edit-2' }),
          },
          {
            label: 'Manage Members',
            onClick: () => {},
            icon: () => h(FeatherIcon, { name: 'users' }),
          },
          {
            label: 'Delete this project',
            onClick: () => {},
            icon: () => h(FeatherIcon, { name: 'trash' }),
          },
        ]"
      />
    </Variant>

    <Variant title="Button prop">
      <Dropdown
        :options="[
          {
            label: 'Edit Title',
            onClick: () => {},
          },
          {
            label: 'Manage Members',
            onClick: () => {},
          },
          {
            label: 'Delete this project',
            onClick: () => {},
          },
        ]"
        :button="{
          label: 'Actions',
        }"
      />
    </Variant>

    <Variant title="Custom Button and Groups">
      <Dropdown
        :options="[
          {
            group: 'Manage',
            items: [
              {
                label: 'Edit Title',
                icon: () => h(FeatherIcon, { name: 'edit' }),
              },
              {
                label: 'Manage Members',
                icon: () => h(FeatherIcon, { name: 'users' }),
              },
            ],
          },
          {
            group: 'Delete',
            items: [
              {
                label: 'Delete users',
                icon: () => h(FeatherIcon, { name: 'edit' }),
              },
              {
                label: 'Delete this project',
                icon: () => h(FeatherIcon, { name: 'trash' }),
              },
            ],
          },
        ]"
      >
        <Button>
          <template #icon>
            <FeatherIcon name="more-horizontal" class="h-4 w-4" />
          </template>
        </Button>
      </Dropdown>
    </Variant>

    <template #controls>
      <!-- <HstText v-model="state.label" title="Label" />
      <HstSelect v-model="state.size" :options="sizes" title="Size" /> -->
    </template>
  </Story>
</template>
