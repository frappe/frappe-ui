import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Password from './Password.vue'
import Example from './stories/Example.vue'

const meta = {
  title: 'Components/Password',
  component: Password,
} satisfies Meta<typeof Password>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
