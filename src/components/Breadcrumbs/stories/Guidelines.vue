<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'

const tickets = [
  { id: '#1092', title: 'Update website content', color: 'bg-surface-amber-6' },
  {
    id: '#1093',
    title: 'Fix login authentication bug',
    color: 'bg-surface-blue-6',
  },
  {
    id: '#1094',
    title: 'Prepare quarterly report',
    color: 'bg-surface-green-6',
  },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. The last crumb is always the active one -->
    <Guideline
      layout="stack"
      caption="The last crumb should always be in an active state, since it represents the current page."
    >
      <template #do>
        <Breadcrumbs
          :items="[
            { label: 'Frappe' },
            { label: 'Frappe' },
            { label: 'Frappe' },
            { label: 'Frappe' },
          ]"
        />
      </template>
      <template #dont>
        <div class="flex items-center text-lg-medium leading-tighter">
          <span class="text-ink-gray-5">Frappe</span>
          <span class="mx-0.5 text-base text-ink-gray-4" aria-hidden="true"
            >/</span
          >
          <span class="text-ink-gray-5">Frappe</span>
          <span class="mx-0.5 text-base text-ink-gray-4" aria-hidden="true"
            >/</span
          >
          <span class="text-ink-gray-9">Frappe</span>
          <span class="mx-0.5 text-base text-ink-gray-4" aria-hidden="true"
            >/</span
          >
          <span class="text-ink-gray-5">Frappe</span>
        </div>
      </template>
    </Guideline>

    <!-- 2. Collapse into a "…" menu once the trail holds more than five
         links, rather than wrapping or shrinking every crumb. Real
         Breadcrumbs in a narrow box, so the overflow behavior is genuine. -->
    <Guideline
      :mark="false"
      caption="Enable collapse in the middle for breadcrumb trails with more than 5 links."
    >
      <template #do>
        <div class="w-72">
          <Breadcrumbs
            :items="[
              { label: 'Workspace' },
              { label: 'Projects' },
              { label: 'Website redesign' },
              { label: 'Marketing' },
              { label: 'Assets' },
              { label: 'Homepage banner' },
            ]"
          />
        </div>
      </template>
    </Guideline>

    <!-- 3. Breadcrumbs can share the header with other page controls. The
         open dropdown can't be shown with the live component frozen open, so
         it's mocked with markup that mirrors Menu. -->
    <Guideline
      :mark="false"
      caption="Allow switching between views in the current page wherever necessary."
    >
      <template #do>
        <div class="flex flex-col items-start gap-1.5">
          <div class="flex items-center text-lg-medium leading-tighter">
            <span class="text-ink-gray-5">CRM</span>
            <span class="mx-0.5 text-base text-ink-gray-4" aria-hidden="true"
              >/</span
            >
            <span class="text-ink-gray-9">Leads</span>
          </div>
          <div
            class="w-48 divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 p-1.5 shadow-2xl ring-1 ring-black ring-opacity-5"
          >
            <div class="flex flex-col pb-1.5">
              <div
                class="flex h-7 items-center justify-between rounded-4 bg-surface-gray-3 px-2 text-base text-ink-gray-8"
              >
                List view
                <span class="lucide-check size-4" aria-hidden="true" />
              </div>
              <div
                class="flex h-7 items-center rounded-4 px-2 text-base text-ink-gray-7"
              >
                Kanban view
              </div>
              <div
                class="flex h-7 items-center rounded-4 px-2 text-base text-ink-gray-7"
              >
                Group by
              </div>
            </div>
            <div class="flex flex-col pt-1.5">
              <p
                class="flex h-7 items-center px-2 text-sm font-medium text-ink-gray-4"
              >
                Saved views
              </p>
              <div
                class="flex h-7 items-center rounded-4 px-2 text-base text-ink-gray-7"
              >
                My open leads
              </div>
              <div
                class="flex h-7 items-center rounded-4 px-2 text-base text-ink-gray-7"
              >
                Qualified leads
              </div>
              <div
                class="flex h-7 items-center gap-1.5 rounded-4 px-2 text-base text-ink-gray-7"
              >
                <span class="lucide-plus size-4" aria-hidden="true" />
                Create view
              </div>
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Keep the breadcrumb in the same spot in the layout across pages -->
    <Guideline
      :mark="false"
      caption="Always maintain a consistent position so it's easy to navigate between pages."
    >
      <template #do>
        <div
          class="flex w-[360px] overflow-hidden rounded-6 border border-outline-gray-2"
        >
          <div
            class="flex w-10 flex-col items-center gap-3 border-r border-outline-gray-2 bg-surface-gray-1 py-3"
          >
            <span
              class="lucide-search size-4 text-ink-gray-6"
              aria-hidden="true"
            />
            <span
              class="lucide-bell size-4 text-ink-gray-6"
              aria-hidden="true"
            />
            <span
              class="lucide-ticket size-4 text-ink-gray-9"
              aria-hidden="true"
            />
            <span
              class="lucide-layout-grid size-4 text-ink-gray-6"
              aria-hidden="true"
            />
            <span
              class="lucide-book-open size-4 text-ink-gray-6"
              aria-hidden="true"
            />
          </div>
          <div class="flex min-w-0 flex-1 flex-col">
            <div
              class="flex h-10 items-center text-lg-medium leading-tighter border-b border-outline-gray-2 px-3"
            >
              <span class="text-ink-gray-5">Helpdesk</span>
              <span class="mx-0.5 text-base text-ink-gray-4" aria-hidden="true"
                >/</span
              >
              <span class="text-ink-gray-9">Tickets</span>
            </div>
            <div class="flex flex-col divide-y divide-outline-gray-1">
              <div
                v-for="t in tickets"
                :key="t.id"
                class="flex items-center gap-3 px-3 py-2 text-sm"
              >
                <span class="text-ink-gray-5">{{ t.id }}</span>
                <span class="min-w-0 flex-1 truncate text-ink-gray-8">{{
                  t.title
                }}</span>
                <span class="size-1.5 shrink-0 rounded-full" :class="t.color" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
