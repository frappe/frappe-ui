import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MultiSelect from './MultiSelect.vue'
import Example from './stories/Example.vue'
import Footer from './stories/Footer.vue'
import Options from './stories/Options.vue'

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleStory: Story = { render: () => Example, name: 'Example' }
export const FooterStory: Story = { render: () => Footer, name: 'Footer' }
export const OptionsStory: Story = { render: () => Options, name: 'Options' }
