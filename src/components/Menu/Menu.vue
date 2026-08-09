<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MenuItemContent from './MenuItemContent.vue'
import MenuRenderContent from './MenuRenderContent.vue'
import MenuRenderContentAsChild from './MenuRenderContentAsChild.vue'
import type { MenuOption, MenuProps } from './types'
import { usePortalTarget } from '../../composables/usePortalTarget'
import {
  menuClasses,
  getMenuBackgroundColor,
  groupHasIcons,
  isMenuSubmenuOption,
  isMenuSwitchOption,
  normalizeMenuOptions,
} from './utils'

defineOptions({
  name: 'Menu',
})

const props = withDefaults(defineProps<MenuProps>(), {
  groups: () => [],
})

const portalTarget = usePortalTarget(() => props.portalTo)

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

          <component :is="primitives.Portal" :to="portalTarget">
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
          class="rounded-4"
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
 * Shared menu motion. Both Dropdown and ContextMenu render this component
 * inside their `.menu-content` wrapper, so keeping the rule here guarantees it
 * ships whenever either menu is used (the package ships source and is
 * tree-shaken per component).
 *
 * Neither menu scales in. A menu appears at a fixed spot — under the trigger,
 * or at the cursor — with no transform-origin tying it to that point, so the
 * entrance grew it from its own middle and only added latency between the
 * press and the content. The ~80ms fade that remains masks the 1-frame
 * position-settle reka performs after mount.
 */
:global(.menu-content[data-motion='instant'][data-state='open']) {
  animation: menu-instant-fade 80ms linear;
}

:global(.menu-content[data-motion='instant'][data-state='closed']) {
  animation: none;
}

@keyframes menu-instant-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  :global(.menu-content) {
    animation-duration: 0ms !important;
  }
}
</style>
