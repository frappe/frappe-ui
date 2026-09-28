<script setup lang="ts">
import { Breadcrumbs } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Collapse into a "…" menu once the trail holds more than five
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

    <!-- 2. Breadcrumbs can share the header with other page controls. The
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
  </div>
</template>
