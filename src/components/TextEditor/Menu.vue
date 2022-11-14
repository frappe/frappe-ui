<template>
  <div class="inline-flex bg-white px-1 py-1">
    <div class="inline-flex items-center gap-1">
      <template v-for="button in buttons" :key="button.label">
        <div
          class="h-4 w-[2px] border-l"
          v-if="button.type === 'separator'"
        ></div>
        <div class="shrink-0" v-else-if="button.map">
          <Popover>
            <template #target="{ togglePopover }">
              <button
                class="rounded px-2 py-1 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100"
                @click="togglePopover"
                :set="
                  (activeBtn =
                    button.find((b) => b.isActive(editor)) || button[0])
                "
              >
                <component
                  v-if="activeBtn.icon"
                  :is="activeBtn.icon"
                  class="h-4 w-4"
                />
                <span v-else>
                  {{ activeBtn.label }}
                </span>
              </button>
            </template>
            <template #body="{ close }">
              <ul class="rounded border bg-white p-1 shadow-md">
                <li
                  class="w-full"
                  v-for="option in button"
                  v-show="option.isDisabled ? !option.isDisabled(editor) : true"
                >
                  <button
                    class="w-full rounded px-2 py-1 text-left text-base hover:bg-gray-50"
                    @click="
                      () => {
                        onButtonClick(option)
                        close()
                      }
                    "
                  >
                    {{ option.label }}
                  </button>
                </li>
              </ul>
            </template>
          </Popover>
        </div>
        <component v-else :is="button.component || 'div'" v-bind="{ editor }">
          <template v-slot="componentSlotProps">
            <button
              class="flex rounded p-1 text-gray-800 transition-colors"
              :class="
                button.isActive(editor) || componentSlotProps?.isActive
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
              "
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
import Popover from '../Popover.vue'

export default {
  name: 'TipTapMenu',
  props: ['buttons'],
  inject: ['editor'],
  components: {
    Popover,
  },
  methods: {
    onButtonClick(button) {
      button.action(this.editor)
    },
  },
}
</script>
