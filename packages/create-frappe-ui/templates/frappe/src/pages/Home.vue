<script setup lang="ts">
import {
  Badge,
  Button,
  ErrorMessage,
  PageHeader,
  PageHeaderTitle,
  useCall,
  useColorScheme,
} from 'frappe-ui'

const { resolvedColorScheme, toggleColorScheme } = useColorScheme()

const bootUser = window.user

// A POST request needs the CSRF token from the boot data. In development there
// is no boot data, so the site needs `ignore_csrf`.
const loggedUser = useCall<string>({
  url: '/api/v2/method/frappe.auth.get_logged_user',
  method: 'POST',
})
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="__TITLE__" />
    <div class="flex items-center gap-2">
      <Button
        :icon="resolvedColorScheme === 'dark' ? 'lucide-sun' : 'lucide-moon'"
        :tooltip="resolvedColorScheme === 'dark' ? 'Light mode' : 'Dark mode'"
        aria-label="Switch light and dark mode"
        @click="toggleColorScheme"
      />
      <Button icon-left="lucide-layout-grid" label="Open Desk" href="/app" />
    </div>
  </PageHeader>

  <div class="mx-auto max-w-[770px] space-y-6 px-3 pb-10 pt-8 sm:px-5">
    <div class="space-y-2">
      <h1 class="text-2xl-semibold text-ink-gray-9">Your frontend is ready</h1>
      <p class="text-p-base text-ink-gray-7">
        Edit
        <code class="rounded-1 bg-surface-gray-2 px-1 py-0.5 font-mono text-sm"
          >src/pages/Home.vue</code
        >
        to start building. The checks below show that the page can talk to your
        site.
      </p>
    </div>

    <div
      class="divide-y divide-outline-gray-1 rounded-6 border border-outline-gray-1"
    >
      <div class="flex items-center gap-3 px-4 py-3">
        <span
          class="lucide-file-json size-4 shrink-0 text-ink-gray-6"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <p class="text-base-medium text-ink-gray-8">Boot data</p>
          <p class="mt-1.5 truncate text-sm text-ink-gray-5">
            {{
              bootUser
                ? `Signed in as ${bootUser}`
                : 'Only a production build has boot data'
            }}
          </p>
        </div>
        <Badge
          :theme="bootUser ? 'green' : 'gray'"
          :label="bootUser ? 'Loaded' : 'Dev server'"
        />
      </div>

      <div class="flex items-center gap-3 px-4 py-3">
        <span
          class="lucide-server size-4 shrink-0 text-ink-gray-6"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <p class="text-base-medium text-ink-gray-8">Server call</p>
          <ErrorMessage
            v-if="loggedUser.error"
            class="mt-1.5"
            :message="loggedUser.error"
          />
          <p v-else class="mt-1.5 truncate text-sm text-ink-gray-5">
            {{
              loggedUser.data
                ? `frappe.auth.get_logged_user returned ${loggedUser.data}`
                : 'Calling frappe.auth.get_logged_user…'
            }}
          </p>
        </div>
        <Badge v-if="loggedUser.data" theme="green" label="Working" />
        <Badge v-else-if="loggedUser.error" theme="red" label="Failed" />
        <Button
          icon="lucide-refresh-cw"
          tooltip="Call again"
          aria-label="Call again"
          :loading="loggedUser.loading"
          @click="loggedUser.reload()"
        />
      </div>
    </div>
  </div>
</template>
