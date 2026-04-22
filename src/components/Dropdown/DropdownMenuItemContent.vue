<script setup lang="ts">
import { Comment, Fragment, Text, computed, type VNode } from 'vue'
import FeatherIcon from '../FeatherIcon.vue'
import ItemListRow from '../ItemList/ItemListRow.vue'
import Switch from '../Switch/Switch.vue'
import DropdownRenderContent from './DropdownRenderContent.vue'
import type { DropdownOption } from './types'
import {
  dropdownClasses,
  getDropdownIconColor,
  getDropdownTextColor,
} from './utils'

const props = withDefaults(
  defineProps<{
    item: DropdownOption
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

const hasUserPrefix = computed(() => {
  return hasRenderableContent(userPrefixContent.value)
})

const hasDynamicLabel = computed(() => {
  return hasRenderableContent(dynamicLabelContent.value)
})

const hasUserLabel = computed(() => {
  return hasRenderableContent(userLabelContent.value)
})

const hasUserSuffix = computed(() => {
  return hasRenderableContent(userSuffixContent.value)
})

function handleSwitchChange(value: boolean) {
  ;(props.item.onClick as ((value: boolean) => void) | undefined)?.(value)
}

function hasRenderableContent(nodes?: VNode[]): boolean {
  if (!nodes?.length) return false

  return nodes.some((node) => {
    if (node.type === Comment) return false

    if (node.type === Text) {
      return String(node.children ?? '').trim().length > 0
    }

    if (node.type === Fragment) {
      return hasRenderableContent(
        Array.isArray(node.children) ? (node.children as VNode[]) : [],
      )
    }

    return true
  })
}
</script>

<template>
  <ItemListRow :selected="isSelected" :disabled="item.disabled">
    <template #prefix>
      <DropdownRenderContent
        v-if="hasUserPrefix"
        :content="userPrefixContent"
      />
      <FeatherIcon
        v-else-if="item.icon && typeof item.icon === 'string'"
        :name="item.icon"
        :class="[dropdownClasses.itemIcon, getDropdownIconColor(item)]"
        aria-hidden="true"
      />
      <component
        :is="item.icon"
        v-else-if="item.icon"
        :class="[dropdownClasses.itemIcon, getDropdownIconColor(item)]"
      />
      <div
        v-else-if="reserveIconSpace"
        :class="dropdownClasses.itemIconPlaceholder"
      />
    </template>

    <template #label>
      <DropdownRenderContent
        v-if="hasDynamicLabel"
        :content="dynamicLabelContent"
      />
      <DropdownRenderContent
        v-else-if="hasUserLabel"
        :content="userLabelContent"
      />
      <div v-else class="min-w-0">
        <div :class="['truncate', getDropdownTextColor(item)]">
          {{ item.label }}
        </div>
        <div v-if="item.description" class="truncate text-p-sm text-ink-gray-5">
          {{ item.description }}
        </div>
      </div>
    </template>

    <template #suffix>
      <DropdownRenderContent
        v-if="hasUserSuffix"
        :content="userSuffixContent"
      />
      <Switch
        v-if="trailing === 'switch'"
        class="ml-auto"
        label-classes="cursor-pointer font-normal"
        :disabled="item.disabled"
        :model-value="item.switchValue || false"
        @change="handleSwitchChange"
      />
      <FeatherIcon
        v-else-if="trailing === 'submenu'"
        name="chevron-right"
        :class="[dropdownClasses.chevronIcon, getDropdownIconColor(item)]"
        aria-hidden="true"
      />
    </template>
  </ItemListRow>
</template>
