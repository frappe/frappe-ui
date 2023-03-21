import { Switch } from '../index'

export default {
  component: Switch,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Switch },
    template: `<Switch v-bind="$props"/>`,
  }),
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: { type: 'select' },
    },
  },
  args: {
    size: 'sm',
  },
}

export const Small = {
  args: {
    size: 'sm',
  },
}

export const Medium = {
  args: {
    size: 'md',
  },
}

export const Disabled = {
  args: {
    disabled: true,
  },
}

export const WithLabel = {
  args: {
    label: 'Switch Off',
  },
}

export const WithLabelAndDescription = {
  args: {
    label: 'Switch Off',
    description:
      'Used when the checkbox is selected and will use its value for the form submission.',
  },
}
