import { Avatar } from '../index'

const IconOnline = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full text-green-500" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="10"/></svg>`,
}

const IconOffline = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full text-gray-500" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="10"/></svg>`,
}

const IconSleep = {
  template: `<svg class="h-full w-full" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="18" height="18" rx="9" fill="white"/>
    <path d="M16.9819 9.71993C16.9899 9.63114 16.8851 9.57883 16.8161 9.63536C15.7802 10.4848 14.4551 10.9946 13.0109 10.9946C9.69415 10.9946 7.00543 8.30585 7.00543 4.98914C7.00543 3.54495 7.51521 2.21982 8.36464 1.18388C8.42117 1.11495 8.36886 1.0101 8.28008 1.01809C4.19856 1.3855 1 4.8156 1 8.99276C1 13.415 4.58496 17 9.00724 17C13.1844 17 16.6145 13.8014 16.9819 9.71993Z" fill="#7C7C7C"/>
    </svg>
    `,
}

const IconUser = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
</svg>`,
}

export default {
  component: Avatar,
  tags: ['autodocs'],
  render: function (args, { argTypes }) {
    return {
      props: Object.keys(argTypes),
      components: { Avatar },
      template: `<Avatar v-bind="$props">
            <template v-if="$props.default" #default>
                <component :is="$props.default" />
            </template>
            <template v-if="$props.indicator" #indicator>
                <component :is="$props.indicator" />
            </template>
        </Avatar>`,
    }
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      control: { type: 'inline-radio' },
    },
    shape: {
      options: ['circle', 'square'],
      control: { type: 'inline-radio' },
    },
    indicator: {
      options: ['online', 'offline', 'sleep'],
      mapping: {
        online: IconOnline,
        offline: IconOffline,
        sleep: IconSleep,
      },
    },
    default: {
      options: ['user', 'none'],
      mapping: {
        none: null,
        user: IconUser,
      },
    },
  },
  args: {
    size: '3xl',
    shape: 'circle',
  },
}

export const Normal = {
  args: {
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
}

export const SizeSmall = {
  args: {
    size: 'sm',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
}

export const Label = {
  args: {
    label: 'A',
  },
}

export const RoundedSquare = {
  args: {
    shape: 'square',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
}

export const WithIndicator = {
  args: {
    indicator: 'online',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
}

export const IconViaDefaultSlot = {
  args: {
    default: 'user',
  },
}
