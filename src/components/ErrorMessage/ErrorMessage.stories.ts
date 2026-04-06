import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ErrorMessage from './ErrorMessage.vue'
import ErrorObject from './stories/ErrorObject.vue'
import Examples from './stories/Examples.vue'

const meta = {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
} satisfies Meta<typeof ErrorMessage>

export default meta
type Story = StoryObj<typeof meta>

export const ErrorObjectStory: Story = { render: () => ErrorObject, name: 'Error Object' }
export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
