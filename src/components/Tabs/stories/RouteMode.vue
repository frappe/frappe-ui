<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabList, TabTrigger } from 'frappe-ui'

// Without a `v-model`, selection derives from the current route. Clicking a
// trigger navigates; a `<router-view>` outside the tabs renders the page.
const route = useRoute()
const router = useRouter()

onMounted(() => router.replace('/mail/inbox'))
</script>

<template>
  <div class="w-full max-w-md">
    <Tabs>
      <TabList variant="underline">
        <TabTrigger value="inbox" label="Inbox" route="/mail/inbox" />
        <TabTrigger value="sent" label="Sent" route="/mail/sent" />
        <TabTrigger value="archive" label="Archive" route="/mail/archive" />
      </TabList>
    </Tabs>
    <div class="p-4 text-base text-ink-gray-7">
      Current route: <code>{{ route.path }}</code>
    </div>
  </div>
</template>
