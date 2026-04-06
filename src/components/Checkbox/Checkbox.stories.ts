import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Checkbox from './Checkbox.vue'
import Examples from './stories/Examples.vue'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
