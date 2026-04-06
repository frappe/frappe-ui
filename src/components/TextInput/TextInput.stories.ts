import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TextInput from './TextInput.vue'
import List from './stories/List.vue'

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const ListStory: Story = { render: () => List, name: 'List' }
