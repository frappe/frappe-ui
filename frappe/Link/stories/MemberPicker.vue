<script setup lang="ts">
import { ref } from 'vue'
import { Avatar } from 'frappe-ui'
import { Link } from 'frappe-ui/frappe'
import { useMockSearchLink, MOCK_USERS } from './_mock'

useMockSearchLink({ User: MOCK_USERS })

// `search_link` only ships value/label/description over the wire, so look up
// the avatar URL locally by primary key.
const imageByValue = new Map(
  MOCK_USERS.map((u) => [u.value, u.image as string | undefined]),
)

const user = ref<string | null>(null)
</script>

<template>
  <div class="w-full !py-20 grid place-items-center">
    <div class="grid w-80 gap-3">
      <Link v-model="user" doctype="User" placeholder="Assign to…">
        <template #item-prefix="{ item }">
          <Avatar
            :image="imageByValue.get(item.value)"
            :label="item.label"
            size="sm"
            class="mr-1"
          />
        </template>
      </Link>

      <div class="text-sm text-ink-gray-5">
        Selected: <code class="text-ink-gray-7">{{ user || 'None' }}</code>
      </div>
    </div>
  </div>
</template>
