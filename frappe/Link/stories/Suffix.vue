<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Dialog } from 'frappe-ui'
import { Link } from 'frappe-ui/frappe'
import {
  useMockSearchLink,
  MOCK_USERS,
  type MockSearchLinkRecord,
} from './_mock'

useMockSearchLink({ User: MOCK_USERS })

// `search_link` only ships value/label/description; look up the rest locally.
const userByValue = new Map<string, MockSearchLinkRecord>(
  MOCK_USERS.map((u) => [u.value, u]),
)

const user = ref<string | null>(null)
const dropdownOpen = ref(false)
const detailsOpen = ref(false)

const selectedUser = computed(() =>
  user.value ? (userByValue.get(user.value) ?? null) : null,
)
</script>

<template>
  <div class="w-full !py-20 grid place-items-center">
    <div class="grid w-96 gap-3">
      <Link
        v-model="user"
        v-model:open="dropdownOpen"
        doctype="User"
        placeholder="Pick a user"
      >
        <template #suffix="{ selectedOption, open }">
          <button
            v-if="selectedOption"
            type="button"
            aria-label="Open user details"
            class="grid size-4 place-items-center rounded-sm text-ink-gray-5 hover:bg-surface-gray-3 hover:text-ink-gray-7"
            @pointerdown.stop
            @click="
              () => {
                dropdownOpen = false
                detailsOpen = true
              }
            "
          >
            <span class="lucide-arrow-up-right size-3.5" />
          </button>
        </template>
      </Link>

      <p class="text-sm text-ink-gray-5">
        <code>#suffix</code> fully replaces the default clear button. Render
        your own clear if you need one.
      </p>
    </div>

    <Dialog v-model:open="detailsOpen" title="User details" size="sm">
      <template v-if="selectedUser" #default>
        <div class="grid gap-5">
          <div class="flex items-center gap-3">
            <Avatar
              :image="selectedUser.image as string | undefined"
              :label="(selectedUser.label as string) || selectedUser.value"
              size="2xl"
            />
            <div class="grid min-w-0 gap-0.5">
              <div class="flex items-center gap-2">
                <div class="truncate text-base font-medium text-ink-gray-9">
                  {{ selectedUser.label || selectedUser.value }}
                </div>
                <span
                  class="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-p-xs"
                  :class="
                    selectedUser.enabled
                      ? 'bg-surface-green-1 text-ink-green-3'
                      : 'bg-surface-gray-2 text-ink-gray-5'
                  "
                >
                  <span
                    class="size-1.5 rounded-full"
                    :class="
                      selectedUser.enabled
                        ? 'bg-surface-green-3'
                        : 'bg-surface-gray-5'
                    "
                  />
                  {{ selectedUser.enabled ? 'Active' : 'Disabled' }}
                </span>
              </div>
              <div class="truncate text-p-sm text-ink-gray-5">
                {{ selectedUser.value }}
              </div>
            </div>
          </div>

          <dl class="grid gap-2 border-t border-outline-gray-1 pt-4 text-sm">
            <div class="flex items-baseline justify-between gap-4">
              <dt class="text-ink-gray-5">Department</dt>
              <dd class="truncate text-ink-gray-8">
                {{ selectedUser.department || '—' }}
              </dd>
            </div>
            <div class="flex items-baseline justify-between gap-4">
              <dt class="text-ink-gray-5">Role</dt>
              <dd class="truncate text-ink-gray-8">
                {{ selectedUser.description || '—' }}
              </dd>
            </div>
          </dl>
        </div>
      </template>
    </Dialog>
  </div>
</template>
