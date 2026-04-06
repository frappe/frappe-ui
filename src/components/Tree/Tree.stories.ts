import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tree from './Tree.vue'
import Example from './stories/Example.vue'

const meta = {
  title: 'Components/Tree',
  component: Tree,
} satisfies Meta<typeof Tree>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
