import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Breadcrumbs from './Breadcrumbs.vue'
import Example from './stories/Example.vue'
import Slots from './stories/Slots.vue'

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
export const SlotsStory: Story = { render: () => Slots, name: 'Slots' }
