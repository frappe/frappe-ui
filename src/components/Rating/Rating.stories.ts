import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Rating from './Rating.vue'
import Examples from './stories/Examples.vue'

const meta = {
  title: 'Components/Rating',
  component: Rating,
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
