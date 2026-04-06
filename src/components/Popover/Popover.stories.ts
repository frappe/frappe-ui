import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Popover from './Popover.vue'
import Click from './stories/Click.vue'
import Hover from './stories/Hover.vue'

const meta = {
  title: 'Components/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const ClickStory: Story = { render: () => Click, name: 'Click' }
export const HoverStory: Story = { render: () => Hover, name: 'Hover' }
