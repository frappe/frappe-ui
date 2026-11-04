<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
import GuidelinePage from './GuidelinePage.vue'

// Card 3's view menu, drawn open under the last crumb. A live Dropdown can't
// stay open inside a static card, so it mirrors Menu's classes.
const menuItem =
  'flex h-7 items-center rounded-4 px-2 text-base text-ink-gray-7'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Frappe records often have generated IDs as their name. Label the
         crumb with the record's title instead. -->
    <Guideline
      layout="stack"
      caption="Show a record's title in the trail, not its ID."
    >
      <template #do>
        <div class="w-80">
          <Breadcrumbs
            :items="[{ label: 'Deals' }, { label: 'Acme Corp renewal' }]"
          />
        </div>
      </template>
      <template #dont>
        <div class="w-80">
          <Breadcrumbs
            :items="[{ label: 'Deals' }, { label: 'CRM-DEAL-2026-00042' }]"
          />
        </div>
      </template>
    </Guideline>

    <!-- 2. Keep the breadcrumb in the same spot in the layout across pages.
         Drawn at page scale and cropped by the card, so it reads as a page. -->
    <Guideline
      layout="bleed"
      caption="Always maintain a consistent position so it's easy to navigate between pages."
    >
      <template #do>
        <GuidelinePage>
          <template #header>
            <Breadcrumbs
              :items="[{ label: 'Helpdesk' }, { label: 'Tickets' }]"
            />
          </template>
        </GuidelinePage>
      </template>
    </Guideline>

    <!-- 3. View switching lives in a menu on the last crumb. The chevron is
         the real Breadcrumbs `#suffix` slot, the way an app would build it. -->
    <Guideline
      layout="bleed"
      caption="Put view switching, like list, kanban and saved views, in a menu on the last crumb."
    >
      <template #do>
        <GuidelinePage>
          <template #header>
            <Breadcrumbs
              :items="[
                { label: 'Helpdesk' },
                { label: 'Tickets', views: true },
              ]"
            >
              <template #suffix="{ item }">
                <span
                  v-if="item.views"
                  class="lucide-chevron-down ml-1 size-4 text-ink-gray-5"
                  aria-hidden="true"
                />
              </template>
            </Breadcrumbs>
          </template>
          <template #overlay>
            <div
              class="absolute left-[92px] top-12 z-10 w-52 divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 p-1.5 shadow-2xl ring-1 ring-black ring-opacity-5"
            >
              <div class="flex flex-col pb-1.5">
                <div
                  :class="[
                    menuItem,
                    'justify-between bg-surface-gray-3 text-ink-gray-8',
                  ]"
                >
                  List view
                  <span class="lucide-check size-4" aria-hidden="true" />
                </div>
                <div :class="menuItem">Kanban view</div>
                <div :class="menuItem">Group by</div>
              </div>
              <div class="flex flex-col pt-1.5">
                <p
                  class="flex h-7 items-center px-2 text-sm font-medium text-ink-gray-4"
                >
                  Saved views
                </p>
                <div :class="menuItem">My open tickets</div>
                <div :class="menuItem">Urgent tickets</div>
                <div :class="[menuItem, 'gap-1.5']">
                  <span class="lucide-plus size-4" aria-hidden="true" />
                  Create view
                </div>
              </div>
            </div>
          </template>
        </GuidelinePage>
      </template>
    </Guideline>
  </div>
</template>
