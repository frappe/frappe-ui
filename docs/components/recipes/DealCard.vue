<script setup>
import { Avatar, Badge, Button, Dropdown, HoverCard } from 'frappe-ui'

// Shared deal-card body for DealsDesktop — rendered both as the live board card
// and as the drag ghost. `ghost` swaps the two interactive bits (actions menu,
// owner hover card) for static stand-ins so the ghost stays inert while
// matching the card's layout exactly.
defineProps({
  deal: { type: Object, required: true },
  owners: { type: Object, required: true },
  logo: { type: Function, required: true },
  ghost: { type: Boolean, default: false },
})

const cardActions = [
  { label: 'Edit deal', icon: 'lucide-pencil' },
  { label: 'Assign to…', icon: 'lucide-user-plus' },
  { label: 'Archive', icon: 'lucide-archive' },
]
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <Avatar
        :label="deal.org"
        :image="logo(deal.org)"
        size="sm"
        shape="square"
      />
      <span class="flex-1 truncate text-base font-medium text-ink-gray-9">
        {{ deal.org }}
      </span>
      <!-- Ghost keeps the row height with an invisible button; the live card
           exposes the actions menu. -->
      <Button
        v-if="ghost"
        variant="ghost"
        icon="lucide-ellipsis"
        label="Deal options"
        class="opacity-0"
      />
      <Dropdown v-else :options="cardActions" align="end">
        <Button
          variant="ghost"
          icon="lucide-ellipsis"
          label="Deal options"
          class="opacity-0 transition group-hover:opacity-100"
        />
      </Dropdown>
    </div>
    <div class="mt-2 flex items-center justify-between">
      <span class="text-base font-semibold text-ink-gray-8">
        {{ deal.value }}
      </span>
      <Badge variant="outline" :label="deal.tag" />
    </div>
    <div class="mt-3 flex items-center justify-between">
      <div v-if="ghost" class="flex items-center gap-1.5">
        <Avatar
          :label="owners[deal.owner].name"
          :image="owners[deal.owner].image"
          size="sm"
        />
        <span class="text-sm text-ink-gray-6">
          {{ owners[deal.owner].name }}
        </span>
      </div>
      <HoverCard v-else :hover-delay="0.3">
        <template #trigger>
          <button class="flex items-center gap-1.5">
            <Avatar
              :label="owners[deal.owner].name"
              :image="owners[deal.owner].image"
              size="sm"
            />
            <span class="text-sm text-ink-gray-6">
              {{ owners[deal.owner].name }}
            </span>
          </button>
        </template>
        <div class="flex w-56 items-center gap-3 p-1">
          <Avatar
            :label="owners[deal.owner].name"
            :image="owners[deal.owner].image"
            size="xl"
          />
          <div class="min-w-0">
            <div class="truncate text-base font-medium text-ink-gray-9">
              {{ owners[deal.owner].name }}
            </div>
            <div class="truncate text-sm text-ink-gray-6">
              {{ owners[deal.owner].title }}
            </div>
            <div class="mt-0.5 text-xs text-ink-gray-5">
              {{ owners[deal.owner].deals }} open deals
            </div>
          </div>
        </div>
      </HoverCard>
      <span class="flex items-center gap-1 text-sm text-ink-gray-5">
        <span class="lucide-calendar size-3.5" aria-hidden="true" />
        {{ deal.due }}
      </span>
    </div>
  </div>
</template>
