<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MenuItemContent from './MenuItemContent.vue'
import MenuRenderContent from './MenuRenderContent.vue'
import MenuRenderContentAsChild from './MenuRenderContentAsChild.vue'
import type { MenuOption, MenuProps } from './types'
import {
  menuClasses,
  getMenuBackgroundColor,
  groupHasIcons,
  isMenuComponentOption,
  isMenuSubmenuOption,
  isMenuSwitchOption,
  normalizeMenuOptions,
} from './utils'

defineOptions({
  name: 'Menu',
})

const props = withDefaults(defineProps<MenuProps>(), {
  groups: () => [],
  portalTo: 'body',
})

const router = useRouter()

const hasVisibleItems = computed(() => {
  return props.groups.some((group) => group.options.length)
})

async function handleItemSelect(item: MenuOption, event: Event) {
  if (item.route && router) {
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
      :class="menuClasses.group"
    >
      <component
        :is="primitives.Label"
        v-if="group.group && !group.hideLabel"
        data-slot="group-label"
        :class="menuClasses.groupLabel"
      >
        <MenuRenderContent
          v-if="slotFns?.['group-label']"
          :content="slotFns['group-label']?.({ group })"
        />
        <template v-else>
          {{ group.group }}
        </template>
      </component>

      <template
        v-for="(item, itemIndex) in group.options"
        :key="item.value ?? item.label ?? itemIndex"
      >
        <component :is="primitives.Sub" v-if="isMenuSubmenuOption(item)">
          <component
            :is="primitives.SubTrigger"
            data-slot="item"
            :data-disabled="item.disabled ? '' : undefined"
            :disabled="item.disabled"
            :class="[
              menuClasses.menuItem,
              getMenuBackgroundColor(item),
              'data-[disabled]:cursor-not-allowed',
            ]"
          >
            <MenuItemContent
              :item="item"
              :close="close"
              :reserve-icon-space="groupHasIcons(group)"
              :slot-fns="slotFns"
              trailing="submenu"
            />
          </component>

          <component :is="primitives.Portal" :to="portalTo">
            <component
              :is="primitives.SubContent"
              data-slot="content"
              :class="menuClasses.content"
              :side-offset="4"
            >
              <Menu
                :groups="normalizeMenuOptions(item.submenu)"
                :close="close"
                :slot-fns="slotFns"
                :portal-to="portalTo"
                :primitives="primitives"
              />
            </component>
          </component>
        </component>

        <div
          v-else-if="isMenuSwitchOption(item)"
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          class="rounded"
        >
          <MenuItemContent
            :item="item"
            :close="close"
            :reserve-icon-space="groupHasIcons(group)"
            :slot-fns="slotFns"
            trailing="switch"
          />
        </div>

        <component
          :is="primitives.Item"
          v-else-if="slotFns?.item"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="handleItemSelect(item, $event)"
        >
          <MenuRenderContentAsChild
            :content="
              slotFns.item?.({ item, close, selected: !!item.selected })
            "
          />
        </component>

        <component
          :is="primitives.Item"
          v-else-if="item.slots?.item"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="handleItemSelect(item, $event)"
        >
          <MenuRenderContentAsChild
            :content="
              item.slots.item({ item, close, selected: !!item.selected })
            "
          />
        </component>

        <component
          :is="primitives.Item"
          v-else-if="isMenuComponentOption(item)"
          as-child
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          @select="handleItemSelect(item, $event)"
        >
          <component :is="item.component" :active="false" />
        </component>

        <component
          :is="primitives.Item"
          v-else
          data-slot="item"
          :data-disabled="item.disabled ? '' : undefined"
          :data-state="item.selected ? 'checked' : undefined"
          :disabled="item.disabled"
          class="data-[disabled]:cursor-not-allowed"
          :class="[menuClasses.menuItem, getMenuBackgroundColor(item)]"
          @select="handleItemSelect(item, $event)"
        >
          <MenuItemContent
            :item="item"
            :close="close"
            :reserve-icon-space="groupHasIcons(group)"
            :slot-fns="slotFns"
          />
        </component>
      </template>
    </div>
  </template>

  <div v-else data-slot="empty" class="p-1.5 text-base text-ink-gray-5">
    <MenuRenderContent v-if="slotFns?.empty" :content="slotFns.empty?.()" />
    <template v-else>No options</template>
  </div>
</template>

<style scoped>
/*
 * Shared menu entrance/exit. Both Dropdown and ContextMenu render this
 * component inside their `.menu-content` wrapper, so keeping the animated
 * keyframes + reduced-motion reset here guarantees they ship whenever either
 * menu is used (the package ships source and is tree-shaken per component).
 * Dropdown's keyboard-only `instant` motion stays in Dropdown.vue.
 */
@keyframes menu-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes menu-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

:global(.menu-content[data-motion='animated'][data-state='open']) {
  animation: menu-in 100ms ease-out;
}

:global(.menu-content[data-motion='animated'][data-state='closed']) {
  animation: menu-out 75ms ease-in;
}

@media (prefers-reduced-motion: reduce) {
  :global(.menu-content) {
    animation-duration: 0ms !important;
  }
}
</style>
