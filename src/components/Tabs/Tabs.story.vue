<script setup lang="ts">
import { h, reactive } from 'vue'
import Tabs from './Tabs.vue'
import FeatherIcon from '../FeatherIcon.vue'
const state = reactive({
  index: 0,
  tabs_without_icon: [
    {
      label: 'Github',
      content:
        'Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.',
    },
    {
      label: 'Twitter',
      content:
        'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
    },
    {
      label: 'Linkedin',
      content:
        'LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.',
    },
  ],
  tabs_with_icon: [
    {
      label: 'Github',
      content:
        'Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.',
      icon: h(FeatherIcon, { class: 'w-4 h-4', name: 'github' }),
    },
    {
      label: 'Twitter',
      content:
        'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
      icon: h(FeatherIcon, { class: 'w-4 h-4', name: 'twitter' }),
    },
    {
      label: 'Linkedin',
      content:
        'LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.',
      icon: h(FeatherIcon, { class: 'w-4 h-4', name: 'linkedin' }),
    },
  ],
})
</script>

<template>
  <Story :layout="{ type: 'grid', width: '80%' }">
    <Variant title="Without Icon">
      <Tabs
        as="div"
        class="border rounded"
        v-model="state.index"
        :tabs="state.tabs_without_icon"
      >
        <template #tab-panel="{ tab }">
          <div class="p-5">
            {{ tab.content }}
          </div>
        </template>
      </Tabs>
    </Variant>
    <Variant title="With Icon">
      <Tabs
        as="div"
        class="border rounded"
        v-model="state.index"
        :tabs="state.tabs_with_icon"
      >
        <template #tab-panel="{ tab }">
          <div class="p-5">
            {{ tab.content }}
          </div>
        </template>
      </Tabs>
    </Variant>
    <Variant title="Vertical Tabs">
      <Tabs
        as="div"
        class="border rounded"
        v-model="state.index"
        :tabs="state.tabs_with_icon"
        vertical
      >
        <template #tab-panel="{ tab }">
          <div class="p-5">
            {{ tab.content }}
          </div>
        </template>
      </Tabs>
    </Variant>

    <template #controls>
      <HstNumber v-model="state.index" title="Tab Index" />
    </template>
  </Story>
</template>
