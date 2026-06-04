<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  injectContextMenuRootContext,
} from 'reka-ui'
import DropdownMenuItemContent from '../Dropdown/DropdownMenuItemContent.vue'
import DropdownRenderContent from '../Dropdown/DropdownRenderContent.vue'
import DropdownRenderContentAsChild from '../Dropdown/DropdownRenderContentAsChild.vue'
import type { DropdownOption } from '../Dropdown/types'
import {
  dropdownClasses,
  getDropdownBackgroundColor,
  groupHasIcons,
  isDropdownComponentOption,
  isDropdownSubmenuOption,
  isDropdownSwitchOption,
  normalizeDropdownOptions,
  type NormalizedDropdownGroup,
} from '../Dropdown/utils'

defineOptions({
  name: 'ContextMenuList',
})

const props = withDefaults(
  defineProps<{
    groups?: NormalizedDropdownGroup[]
    slotFns?: Record<string, ((props?: any) => any) | undefined>
  }>(),
  {
    groups: () => [],
  },
)

const rootContext = injectContextMenuRootContext()
const router = useRouter()

function close() {
  rootContext.onOpenChange(false)
}

const hasVisibleItems = computed(() => {
  return props.groups.some((group) => group.options.length)
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
      <ContextMenuLabel
        v-if="group.group && !group.hideLabel"
        data-slot="group-label"
        :class="dropdownClasses.groupLabel"
      >
        <DropdownRenderContent
          v-if="slotFns?.['group-label']"
          :content="slotFns['group-label']?.({ group })"
        />
        <template v-else>
          {{ group.group }}
        </template>
      </ContextMenuLabel>

      <template
        v-for="(item, itemIndex) in group.options"
        :key="item.value ?? item.label ?? itemIndex"
      >
        <ContextMenuSub v-if="isDropdownSubmenuOption(item)">
          <ContextMenuSubTrigger
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
          </ContextMenuSubTrigger>

          <ContextMenuPortal>
            <ContextMenuSubContent
              data-slot="content"
              :class="dropdownClasses.content"
              :side-offset="4"
            >
              <ContextMenuList
                :groups="normalizeDropdownOptions(item.submenu)"
                :slot-fns="slotFns"
              />
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>

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

        <ContextMenuItem
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
        </ContextMenuItem>

        <ContextMenuItem
          v-else-if="item.slots?.item"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="(event) => handleItemSelect(item, event)"
        >
          <DropdownRenderContentAsChild
            :content="
              item.slots.item({ item, close, selected: !!item.selected })
            "
          />
        </ContextMenuItem>

        <ContextMenuItem
          v-else-if="isDropdownComponentOption(item)"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="(event) => handleItemSelect(item, event)"
        >
          <component :is="item.component" :active="false" />
        </ContextMenuItem>

        <ContextMenuItem
          v-else
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :data-state="item.selected ? 'checked' : undefined"
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
        </ContextMenuItem>
      </template>
    </div>
  </template>

  <div v-else data-slot="empty" class="p-1.5 text-base text-ink-gray-5">
    <DropdownRenderContent v-if="slotFns?.empty" :content="slotFns.empty?.()" />
    <template v-else>No options</template>
  </div>
</template>
