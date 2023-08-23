import { h } from 'vue'
import { Badge, FeatherIcon } from '../index'

let ActivityIcon = {
  render() {
    return h(FeatherIcon, {
      name: 'activity',
      class: 'h-3',
    })
  },
}

let prefixSuffixOptions = {
  options: ['None', '1', '100', 'Icon'],
  mapping: {
    None: null,
    Icon: ActivityIcon,
  },
}

export default {
  component: Badge,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Badge },
    template: `<Badge v-bind="$props">
        <template #prefix>
            <template v-if="typeof $props.prefix == 'string'">{{ $props.prefix }}</template>
            <component v-else :is="$props.prefix" />
        </template>
        <template #default>
            <template v-if="typeof $props.default == 'string'">{{ $props.default }}</template>
            <component v-else :is="$props.default" />
        </template>
        <template #suffix>
            <template v-if="typeof $props.suffix == 'string'">{{ $props.suffix }}</template>
            <component v-else :is="$props.suffix" />
        </template>
    </Badge>`,
  }),
  tags: ['autodocs'],
  argTypes: {
    prefix: prefixSuffixOptions,
    suffix: prefixSuffixOptions,
    default: {
      control: 'text',
    },
    theme: {
      options: ['gray', 'blue', 'green', 'orange', 'red'],
      control: 'select',
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: 'select',
    },
    variant: {
      options: ['solid', 'subtle', 'outline', 'ghost'],
      control: 'select',
    },
  },
  args: {
    label: 'Gamma',
    theme: 'gray',
    size: 'md',
    variant: 'solid',
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
export const Large = {
  args: {
    size: 'lg',
  },
}

export const Gray = {
  args: {
    theme: 'gray',
  },
}

export const Blue = {
  args: {
    theme: 'blue',
  },
}

export const Green = {
  args: {
    theme: 'green',
  },
}

export const Orange = {
  args: {
    theme: 'orange',
  },
}

export const Red = {
  args: {
    theme: 'red',
  },
}

export const Solid = {
  args: {
    variant: 'solid',
  },
}

export const Subtle = {
  args: {
    variant: 'subtle',
  },
}

export const Outline = {
  args: {
    variant: 'outline',
  },
}

export const Ghost = {
  args: {
    variant: 'ghost',
  },
}

export const Prefix = {
  args: {
    prefix: 'Icon',
  },
}

export const Suffix = {
  args: {
    suffix: 'Icon',
  },
}
