import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Sidebar from './Sidebar.vue'
import Example from './stories/Example.vue'

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
