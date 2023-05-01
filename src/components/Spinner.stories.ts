import { Spinner } from '../index'

export default {
  component: Spinner,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: ['style'],
    components: { Spinner },
    template: `<Spinner v-bind="$props" class="w-10" />`,
  }),
}

export const Normal = {}
