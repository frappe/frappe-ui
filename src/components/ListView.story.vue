<script setup>
import ListView from './ListView/ListView.vue'
import ListHeader from './ListView/ListHeader.vue'
import ListHeaderItem from './ListView/ListHeaderItem.vue'
import ListRows from './ListView/ListRows.vue'
import ListRow from './ListView/ListRow.vue'
import ListRowItem from './ListView/ListRowItem.vue'
import ListSelectBanner from './ListView/ListSelectBanner.vue'
import FeatherIcon from './FeatherIcon.vue'
import Badge from './Badge.vue'
import Button from './Button.vue'
import Avatar from './Avatar.vue'

const simple_columns = [
  {
    label: 'Name',
    key: 'name',
    width: 3,
  },
  {
    label: 'Email',
    key: 'email',
    width: '200px',
  },
  {
    label: 'Role',
    key: 'role',
  },
  {
    label: 'Status',
    key: 'status',
  },
]

const simple_rows = [
  {
    id: 1,
    row: {
      name: 'John Doe',
      email: 'john@doe.com',
      status: 'Active',
      role: 'Developer',
    },
    onClick: () => console.log('John Doe was clicked'),
  },
  {
    id: 2,
    row: {
      name: 'Jane Doe',
      email: 'jane@doe.com',
      status: 'Inactive',
      role: 'HR',
    },
    route: { name: 'User', params: { userId: 2 } },
  },
]

const custom_columns = [
  {
    label: 'Name',
    key: 'name',
    width: 3,
    icon: 'user',
  },
  {
    label: 'Email',
    key: 'email',
    width: '200px',
    icon: 'at-sign',
  },
  {
    label: 'Role',
    key: 'role',
    icon: 'users',
  },
  {
    label: 'Status',
    key: 'status',
    icon: 'check-circle',
  },
]

const custom_rows = [
  {
    id: 1,
    row: {
      name: {
        label: 'John Doe',
        image: 'https://avatars.githubusercontent.com/u/499550',
      },
      email: 'john@doe.com',
      status: {
        label: 'Active',
        bg_color: 'bg-green-600',
      },
      role: {
        label: 'Developer',
        color: 'green',
      },
    },
    onClick: () => console.log('John Doe was clicked'),
  },
  {
    id: 2,
    row: {
      name: {
        label: 'Jane Doe',
        image: 'https://avatars.githubusercontent.com/u/499120',
      },
      email: 'jane@doe.com',
      status: {
        label: 'Inactive',
        bg_color: 'bg-red-600',
      },
      role: {
        label: 'HR',
        color: 'red',
      },
    },
    route: { name: 'User', params: { userId: 2 } },
  },
]
</script>

<template>
  <Story :layout="{ type: 'grid', width: '95%' }">
    <Variant title="Simple List">
      <ListView
        class="h-[250px]"
        :columns="simple_columns"
        :rows="simple_rows"
        row-key="id"
      />
    </Variant>
    <Variant title="Custom List">
      <ListView
        class="h-[250px]"
        :columns="custom_columns"
        :rows="custom_rows"
        row-key="id"
      >
        <ListHeader>
          <ListHeaderItem
            v-for="column in custom_columns"
            :key="column.key"
            :column="column"
          >
            <template #prefix="{ column }">
              <FeatherIcon :name="column.icon" class="h-4 w-4" />
            </template>
          </ListHeaderItem>
        </ListHeader>
        <ListRows>
          <ListRow
            v-for="(row, i) in custom_rows"
            :key="i"
            v-slot="{ column, item }"
            :row="row"
            :idx="i"
          >
            <ListRowItem :item="item" :align="column.align">
              <template #prefix>
                <div
                  v-if="column.key == 'status'"
                  class="h-3 w-3 rounded-full"
                  :class="item.bg_color"
                />
                <Avatar
                  v-if="column.key == 'name'"
                  :shape="'circle'"
                  :image="item.image"
                  size="sm"
                />
              </template>
              <Badge
                v-if="column.key == 'role'"
                variant="subtle"
                :theme="item.color"
                size="md"
                :label="item.label"
              />
            </ListRowItem>
          </ListRow>
        </ListRows>
        <ListSelectBanner>
          <template #actions="{ unselectAll }">
            <div class="flex gap-2">
              <Button variant="ghost" label="Delete" />
              <Button
                variant="ghost"
                label="Unselect all"
                @click="unselectAll"
              />
            </div>
          </template>
        </ListSelectBanner>
      </ListView>
    </Variant>
  </Story>
</template>
