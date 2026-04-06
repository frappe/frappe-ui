import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Select from './Select.vue'
import Example from './stories/Example.vue'
import OptionSlot from './stories/OptionSlot.vue'
import TriggerSlots from './stories/TriggerSlots.vue'

const meta = {
  title: 'Components/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
export const OptionSlotStory: Story = { render: () => OptionSlot, name: 'Option Slot' }
export const TriggerSlotsStory: Story = { render: () => TriggerSlots, name: 'Trigger Slots' }
