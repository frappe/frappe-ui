<template>
  <div class="inline-flex bg-surface-white px-1 py-1">
    <div class="inline-flex items-center gap-1">
      <template v-for="button in buttons" :key="button.label">
        <div
          class="h-4 w-[2px] border-l"
          v-if="button.type === 'separator'"
        ></div>
        <div class="shrink-0" v-else-if="button.map || button.group">
          <SubMenu :editor :button @click="onButtonClick" />
        </div>
        <component v-else :is="button.component || 'div'" v-bind="{ editor }">
          <template v-slot="componentSlotProps">
            <button
              class="flex rounded p-1 text-ink-gray-8 transition-colors"
              :class="[
                button.isActive(editor) || componentSlotProps?.isActive
                  ? 'bg-surface-gray-3'
                  : 'hover:bg-surface-gray-2',
                button.class,
              ]"
              @click="
                componentSlotProps?.onClick
                  ? componentSlotProps.onClick(button)
                  : onButtonClick(button)
              "
              :title="button.label"
            >
              <component v-if="button.icon" :is="button.icon" class="h-4 w-4" />
              <span
                class="inline-block h-4 min-w-[1rem] text-sm leading-4"
                v-else
              >
                {{ button.text }}
              </span>
            </button>
          </template>
        </component>
      </template>
    </div>
  </div>
</template>
<script>
import SubMenu from './SubMenu.vue'

export default {
  name: 'TipTapMenu',
  props: ['buttons'],
  inject: ['editor'],
  components: {
    SubMenu,
  },
  methods: {
    onButtonClick(button) {
      button.action(this.editor)
    },
  },
}
</script>
