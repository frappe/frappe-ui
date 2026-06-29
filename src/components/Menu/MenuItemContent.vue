<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { hasRenderableContent } from '../../utils/vnode'
import {
  isEmojiIconString,
  isLucideIconString,
  warnFeatherIconUsage,
} from '../../utils/iconString'
import FeatherIcon from '../FeatherIcon.vue'
import ItemListRow from '../ItemListRow/ItemListRow.vue'
import Switch from '../Switch/Switch.vue'
import MenuRenderContent from './MenuRenderContent.vue'
import type { MenuOption } from './types'
import { menuClasses, getMenuIconColor, getMenuTextColor } from './utils'

const props = withDefaults(
  defineProps<{
    item: MenuOption
    close: () => void
    reserveIconSpace?: boolean
    trailing?: 'none' | 'submenu' | 'switch'
    slotFns?: Record<string, ((props?: any) => any) | undefined>
  }>(),
  {
    reserveIconSpace: false,
    trailing: 'none',
  },
)

const itemSlotName = computed(() => {
  return props.item.slot ? `item-${props.item.slot}` : undefined
})

const isSelected = computed(() => {
  return Boolean(props.item.selected)
})

watchEffect(() => {
  warnFeatherIconUsage('Dropdown', 'item.icon', props.item.icon)
})

const userPrefixContent = computed(() => {
  return props.slotFns?.['item-prefix']?.({
    item: props.item,
    close: props.close,
    selected: isSelected.value,
  })
})

const userLabelContent = computed(() => {
  return props.slotFns?.['item-label']?.({
    item: props.item,
    close: props.close,
    selected: isSelected.value,
  })
})

const dynamicLabelContent = computed(() => {
  if (!itemSlotName.value) return undefined

  return props.slotFns?.[itemSlotName.value]?.({
    item: props.item,
    close: props.close,
    selected: isSelected.value,
  })
})

const userSuffixContent = computed(() => {
  return props.slotFns?.['item-suffix']?.({
    item: props.item,
    close: props.close,
    selected: isSelected.value,
  })
})

const itemSlotsContext = computed(() => ({
  item: props.item,
  close: props.close,
  selected: isSelected.value,
}))

const itemSlotsPrefixContent = computed(() => {
  return props.item.slots?.prefix?.(itemSlotsContext.value)
})

const itemSlotsLabelContent = computed(() => {
  return props.item.slots?.label?.(itemSlotsContext.value)
})

const itemSlotsSuffixContent = computed(() => {
  return props.item.slots?.suffix?.(itemSlotsContext.value)
})

const hasUserPrefix = computed(() => {
  return hasRenderableContent(userPrefixContent.value)
})

const hasItemSlotsPrefix = computed(() => {
  return hasRenderableContent(itemSlotsPrefixContent.value)
})

const hasDynamicLabel = computed(() => {
  return hasRenderableContent(dynamicLabelContent.value)
})

const hasUserLabel = computed(() => {
  return hasRenderableContent(userLabelContent.value)
})

const hasItemSlotsLabel = computed(() => {
  return hasRenderableContent(itemSlotsLabelContent.value)
})

const hasUserSuffix = computed(() => {
  return hasRenderableContent(userSuffixContent.value)
})

const hasItemSlotsSuffix = computed(() => {
  return hasRenderableContent(itemSlotsSuffixContent.value)
})

function handleSwitchChange(value: boolean) {
  ;(props.item.onClick as ((value: boolean) => void) | undefined)?.(value)
}
</script>

<template>
  <ItemListRow :selected="isSelected" :disabled="item.disabled">
    <template #prefix>
      <MenuRenderContent v-if="hasUserPrefix" :content="userPrefixContent" />
      <MenuRenderContent
        v-else-if="hasItemSlotsPrefix"
        :content="itemSlotsPrefixContent"
      />
      <span
        v-else-if="isLucideIconString(item.icon)"
        :class="[item.icon, menuClasses.itemIcon, getMenuIconColor(item)]"
        aria-hidden="true"
      />
      <span
        v-else-if="isEmojiIconString(item.icon)"
        :class="[
          menuClasses.itemIcon,
          'inline-flex items-center justify-center text-base leading-none',
        ]"
        aria-hidden="true"
        >{{ item.icon }}</span
      >
      <FeatherIcon
        v-else-if="item.icon && typeof item.icon === 'string'"
        :name="item.icon"
        :class="[menuClasses.itemIcon, getMenuIconColor(item)]"
        aria-hidden="true"
      />
      <component
        :is="item.icon"
        v-else-if="item.icon"
        :class="[menuClasses.itemIcon, getMenuIconColor(item)]"
      />
      <div
        v-else-if="reserveIconSpace"
        :class="menuClasses.itemIconPlaceholder"
      />
    </template>

    <template #label>
      <MenuRenderContent
        v-if="hasDynamicLabel"
        :content="dynamicLabelContent"
      />
      <MenuRenderContent v-else-if="hasUserLabel" :content="userLabelContent" />
      <MenuRenderContent
        v-else-if="hasItemSlotsLabel"
        :content="itemSlotsLabelContent"
      />
      <div v-else class="min-w-0">
        <div :class="['truncate', getMenuTextColor(item)]">
          {{ item.label }}
        </div>
        <div v-if="item.description" class="truncate text-p-sm text-ink-gray-5">
          {{ item.description }}
        </div>
      </div>
    </template>

    <template #suffix>
      <MenuRenderContent v-if="hasUserSuffix" :content="userSuffixContent" />
      <MenuRenderContent
        v-else-if="hasItemSlotsSuffix"
        :content="itemSlotsSuffixContent"
      />
      <Switch
        v-else-if="trailing === 'switch'"
        class="ml-auto"
        label-classes="cursor-pointer font-normal"
        :disabled="item.disabled"
        :model-value="item.switchValue || false"
        @change="handleSwitchChange"
      />
      <span
        v-else-if="trailing === 'submenu'"
        :class="[
          'lucide-chevron-right',
          menuClasses.chevronIcon,
          getMenuIconColor(item),
        ]"
        aria-hidden="true"
      />
    </template>
  </ItemListRow>
</template>

<style scoped>
/*
 * The outer MenuItem paints the row background via
 * data-[highlighted] / data-[state=checked] utilities — including the
 * combined hover+selected state. Clear ItemListRow's own bg so the outer
 * color always shows through; text emphasis on selected stays.
 */
[data-slot='item-list-row'] {
  background-color: transparent;
}
</style>
