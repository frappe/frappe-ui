import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TextEditor from './TextEditor.vue'
import Comment from './stories/Comment.vue'
import Example from './stories/Example.vue'

const meta = {
  title: 'Components/TextEditor',
  component: TextEditor,
} satisfies Meta<typeof TextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const CommentStory: Story = { render: () => Comment, name: 'Comment' }
export const ExampleStory: Story = { render: () => Example, name: 'Example' }
