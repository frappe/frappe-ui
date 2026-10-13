<template>
  <ESubheader>
    <template #left>
      <!-- The toolbar runs flush: no gap between its groups and rules. -->
      <div class="flex items-center">
        <ButtonGroup>
          <!-- Leading ghost control, pulled onto the header text's edge. -->
          <HeaderSelect v-bind="ghost" label="Text" class="-ml-1.5" />
          <HeaderSelect v-bind="ghost" label="Inter" />
          <!-- Font-size stepper: only − and + are buttons, each with its own
               hover; the size between them is plain text. The pieces keep
               Figma's 79px layout (glyphs at 8 and 55, the size at 32 in a
               15px box), so everything after it stays on the design grid. -->
          <div class="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              class="!justify-start !pl-2 !pr-1"
              aria-label="Decrease font size"
              @click="fontSize = Math.max(1, fontSize - 1)"
            >
              <template #icon>
                <EIcon name="dash" class="size-4 text-ink-gray-6" />
              </template>
            </Button>
            <span
              class="w-[23px] cursor-default select-none px-1 text-base text-ink-gray-6"
              aria-live="polite"
            >
              {{ fontSize }}
            </span>
            <Button
              variant="ghost"
              size="sm"
              class="!justify-end !pl-1 !pr-2"
              aria-label="Increase font size"
              @click="fontSize++"
            >
              <template #icon>
                <EIcon name="small-add" class="size-4 text-ink-gray-6" />
              </template>
            </Button>
          </div>
        </ButtonGroup>
        <VDivider inset />
        <ButtonGroup>
          <ToolButton
            v-for="icon in ['add-emoji1', 'comment1']"
            :key="icon"
            :icon="icon"
          />
        </ButtonGroup>
        <VDivider />
        <ButtonGroup>
          <ToolButton
            v-for="icon in ['bold', 'italic1', 'underline1', 'strike-through']"
            :key="icon"
            :icon="icon"
          />
        </ButtonGroup>
        <VDivider inset />
        <ButtonGroup>
          <ToolButton
            v-for="icon in ['code', 'quote']"
            :key="icon"
            :icon="icon"
          />
        </ButtonGroup>
        <VDivider inset />
        <HeaderSelect v-bind="ghost" icon="link" />
        <VDivider inset />
        <ButtonGroup>
          <HeaderSelect v-bind="ghost" icon="numbered-List" />
          <HeaderSelect v-bind="ghost" icon="numbered-List" />
          <HeaderSelect v-bind="ghost" icon="align-left" />
        </ButtonGroup>
      </div>
    </template>
  </ESubheader>
</template>

<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { Button } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import ButtonGroup from '../ButtonGroup.vue'
import ESubheader from '../ESubheader.vue'
import HeaderSelect from '../HeaderSelect.vue'
import VDivider from '../VDivider.vue'

// Formatting selects sit flush, in the toolbar's softer ink.
const ghost = { variant: 'ghost', inkClass: 'text-ink-gray-6' } as const

const fontSize = ref(18)

// One 28px ghost icon button, in the toolbar's softer ink.
const ToolButton = defineComponent({
  props: { icon: { type: String, required: true } },
  setup(props) {
    return () =>
      h(
        Button,
        { variant: 'ghost', size: 'sm', 'aria-label': props.icon },
        {
          icon: () =>
            h(EIcon, { name: props.icon, class: 'size-4 text-ink-gray-6' }),
        },
      )
  },
})
</script>
