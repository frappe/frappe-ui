import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Switch from './Switch.vue'
import Example from './stories/Example.vue'
import Labels from './stories/Labels.vue'

const meta = {
  title: 'Components/Switch',
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
export const LabelsStory: Story = { render: () => Labels, name: 'Labels' }
