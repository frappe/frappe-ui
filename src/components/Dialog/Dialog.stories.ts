import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Dialog from './Dialog.vue'
import Confirm from './stories/Confirm.vue'
import Custom from './stories/Custom.vue'
import Interactive from './stories/Interactive.vue'
import Modal from './stories/Modal.vue'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const ConfirmStory: Story = { render: () => Confirm, name: 'Confirm' }
export const CustomStory: Story = { render: () => Custom, name: 'Custom' }
export const InteractiveStory: Story = { render: () => Interactive, name: 'Interactive' }
export const ModalStory: Story = { render: () => Modal, name: 'Modal' }
