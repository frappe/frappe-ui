import { Dropdown, Button, FeatherIcon } from '../index'

function getStory(code) {
  return {
    render: (args, { argTypes }) => ({
      props: ['style'],
      components: { Dropdown, FeatherIcon, Button },
      template: code,
    }),
    parameters: {
      docs: {
        source: {
          code,
        },
      },
    },
  }
}

export default {
  component: Dropdown,
  tags: ['autodocs'],
}

export const Basic = {
  ...getStory(`<Dropdown
    :options="[
        { label: 'Edit Title', onClick: () => alert('Edit Title'), icon: 'edit' },
        { label: 'Manage Members', onClick: () => alert('Manage Members'), icon: 'users' },
        { label: 'Delete this project', onClick: () => alert('Delete this project'), icon: 'trash' },
    ]"
/>`),
}

export const WithButtonProp = {
  ...getStory(`<Dropdown
    :options="[
        { label: 'Edit Title', onClick: () => alert('Edit Title'), icon: 'edit' },
        { label: 'Manage Members', onClick: () => alert('Manage Members'), icon: 'users' },
        { label: 'Delete this project', onClick: () => alert('Delete this project'), icon: 'trash' },
    ]"
    :button="{
      label: 'Actions',
    }"
/>`),
}

export const WithCustomButtonAndGroups = {
  ...getStory(`<Dropdown
    :options="[
        {
            group: 'Manage',
            items: [
                { label: 'Edit Title', onClick: () => alert('Edit Title'), icon: 'edit' },
                { label: 'Manage Members', onClick: () => alert('Manage Members'), icon: 'users' },
            ]
        },
        {
            group: 'Delete',
            items: [
                { label: 'Delete users', onClick: () => alert('Delete users'), icon: 'edit' },
                { label: 'Delete this project', onClick: () => alert('Delete this project'), icon: 'trash' },
            ]
        }
    ]"
>
    <Button>
        <template #icon>
            <FeatherIcon name="more-horizontal" class="w-4 h-4" />
        </template>
    </Button>
</Dropdown>`),
}
