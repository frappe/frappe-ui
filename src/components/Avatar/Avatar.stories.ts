import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Avatar from './Avatar.vue'
import Shapes from './stories/Shapes.vue'
import Sizes from './stories/Sizes.vue'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const ShapesStory: Story = { render: () => Shapes, name: 'Shapes' }
export const SizesStory: Story = { render: () => Sizes, name: 'Sizes' }
