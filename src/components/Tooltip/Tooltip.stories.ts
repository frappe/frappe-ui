import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tooltip from './Tooltip.vue'
import Examples from './stories/Examples.vue'
import Slots from './stories/Slots.vue'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
export const SlotsStory: Story = { render: () => Slots, name: 'Slots' }
