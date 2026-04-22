<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from 'reka-ui'
import DropdownMenuItemContent from './DropdownMenuItemContent.vue'
import DropdownRenderContent from './DropdownRenderContent.vue'
import DropdownRenderContentAsChild from './DropdownRenderContentAsChild.vue'
import type { DropdownGroupOption, DropdownOption } from './types'
import {
  dropdownClasses,
  getDropdownBackgroundColor,
  getDropdownTextColor,
  groupHasIcons,
  isDropdownComponentOption,
  isDropdownSubmenuOption,
  isDropdownSwitchOption,
  normalizeDropdownOptions,
} from './utils'

defineOptions({
  name: 'DropdownMenuList',
})

const props = withDefaults(
  defineProps<{
    groups?: DropdownGroupOption[]
    portalTo?: string | HTMLElement
    close: () => void
    slotFns?: Record<string, ((props?: any) => any) | undefined>
  }>(),
  {
    groups: () => [],
    portalTo: 'body',
  },
)

const router = useRouter()

const hasVisibleItems = computed(() => {
  return props.groups.some((group) => group.items.length)
})

async function handleItemSelect(item: DropdownOption, event: Event) {
  if (item.route) {
    await router.push(item.route)
    return
  }

  ;(item.onClick as ((event: PointerEvent) => void) | undefined)?.(
    event as PointerEvent,
  )
}
</script>

<template>
  <template v-if="hasVisibleItems">
    <div
      v-for="(group, groupIndex) in groups"
      :key="group.key ?? group.group ?? groupIndex"
      data-slot="group"
      :class="dropdownClasses.group"
    >
      <DropdownMenuLabel
        v-if="group.group && !group.hideLabel"
        data-slot="group-label"
        :class="[dropdownClasses.groupLabel, getDropdownTextColor(group)]"
      >
        <DropdownRenderContent
          v-if="slotFns?.['group-label']"
          :content="slotFns['group-label']?.({ group })"
        />
        <template v-else>
          {{ group.group }}
        </template>
      </DropdownMenuLabel>

      <template
        v-for="(item, itemIndex) in group.items"
        :key="item.value ?? item.label ?? itemIndex"
      >
        <DropdownMenuSub v-if="isDropdownSubmenuOption(item)">
          <DropdownMenuSubTrigger
            data-slot="item"
            :data-disabled="item.disabled ? '' : undefined"
            :disabled="item.disabled"
            :class="[
              dropdownClasses.menuItem,
              getDropdownBackgroundColor(item),
              'data-[disabled]:cursor-not-allowed',
            ]"
          >
            <DropdownMenuItemContent
              :item="item"
              :close="close"
              :reserve-icon-space="groupHasIcons(group)"
              :slot-fns="slotFns"
              trailing="submenu"
            />
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal :to="portalTo">
            <DropdownMenuSubContent
              data-slot="content"
              :class="dropdownClasses.content"
              :side-offset="4"
            >
              <DropdownMenuList
                :groups="normalizeDropdownOptions(item.submenu)"
                :portal-to="portalTo"
                :close="close"
                :slot-fns="slotFns"
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <div
          v-else-if="isDropdownSwitchOption(item)"
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          class="rounded"
        >
          <DropdownMenuItemContent
            :item="item"
            :close="close"
            :reserve-icon-space="groupHasIcons(group)"
            :slot-fns="slotFns"
            trailing="switch"
          />
        </div>

        <DropdownMenuItem
          v-else-if="slotFns?.item"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="(event) => handleItemSelect(item, event)"
        >
          <DropdownRenderContentAsChild
            :content="
              slotFns.item?.({ item, close, selected: !!item.selected })
            "
          />
        </DropdownMenuItem>

        <DropdownMenuItem
          v-else-if="isDropdownComponentOption(item)"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="(event) => handleItemSelect(item, event)"
        >
          <component :is="item.component" :active="false" />
        </DropdownMenuItem>

        <DropdownMenuItem
          v-else
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          :class="[dropdownClasses.menuItem, getDropdownBackgroundColor(item)]"
          @select="(event) => handleItemSelect(item, event)"
        >
          <DropdownMenuItemContent
            :item="item"
            :close="close"
            :reserve-icon-space="groupHasIcons(group)"
            :slot-fns="slotFns"
          />
        </DropdownMenuItem>
      </template>
    </div>
  </template>

  <div v-else data-slot="empty" class="p-1.5 text-base text-ink-gray-5">
    <DropdownRenderContent v-if="slotFns?.empty" :content="slotFns.empty?.()" />
    <template v-else>No options</template>
  </div>
</template>
