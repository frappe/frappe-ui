import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FileUploader from './FileUploader.vue'
import Examples from './stories/Examples.vue'

const meta = {
  title: 'Components/FileUploader',
  component: FileUploader,
} satisfies Meta<typeof FileUploader>

export default meta
type Story = StoryObj<typeof meta>

export const ExamplesStory: Story = { render: () => Examples, name: 'Examples' }
