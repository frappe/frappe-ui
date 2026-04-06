import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Textarea from './Textarea.vue'
import Variants from './stories/Variants.vue'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const VariantsStory: Story = { render: () => Variants, name: 'Variants' }
