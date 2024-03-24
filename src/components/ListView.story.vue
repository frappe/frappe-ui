<script setup>
import { reactive, h, ref } from 'vue'
import Avatar from './Avatar.vue'
import Badge from './Badge.vue'
import Button from './Button.vue'
import FeatherIcon from './FeatherIcon.vue'
import ListHeader from './ListView/ListHeader.vue'
import ListHeaderItem from './ListView/ListHeaderItem.vue'
import ListRow from './ListView/ListRow.vue'
import ListRowItem from './ListView/ListRowItem.vue'
import ListRows from './ListView/ListRows.vue'
import ListGroups from './ListView/ListGroups.vue'
import ListSelectBanner from './ListView/ListSelectBanner.vue'
import ListView from './ListView/ListView.vue'

const state = reactive({
  selectable: true,
  showTooltip: true,
  resizeColumn: true,
  emptyState: {
    title: 'No records found',
    description: 'Create a new record to get started',
    button: {
      label: 'New Record',
      variant: 'solid',
      onClick: () => console.log('New Record'),
    },
  },
})

const simple_columns = reactive([
  {
    label: 'Name',
    key: 'name',
    width: 3,
    getLabel: ({ row }) => row.name,
    prefix: ({ row }) => {
      return h(Avatar, {
        shape: 'circle',
        image: row.user_image,
        size: 'sm',
      })
    },
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
])

const simple_rows = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@doe.com',
    status: 'Active',
    role: 'Developer',
    user_image: 'https://avatars.githubusercontent.com/u/499550',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@doe.com',
    status: 'Inactive',
    role: 'HR',
    user_image: 'https://avatars.githubusercontent.com/u/499120',
  },
]

const group_columns = reactive([
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
])

const grouped_rows = ref([
  {
    group: 'Developer',
    collapsed: false,
    rows: [
      {
        id: 2,
        name: 'Gary Fox',
        email: 'gary@fox.com',
        status: 'Inactive',
        role: 'Developer',
      },
      {
        id: 6,
        name: 'Emily Davis',
        email: 'emily@davis.com',
        status: 'Active',
        role: 'Developer',
      },
      {
        id: 9,
        name: 'David Lee',
        email: 'david@lee.com',
        status: 'Inactive',
        role: 'Developer',
      },
    ],
  },
  {
    group: 'Manager',
    collapsed: false,
    rows: [
      {
        id: 3,
        name: 'John Doe',
        email: 'john@doe.com',
        status: 'Active',
        role: 'Manager',
      },
      {
        id: 8,
        name: 'Sarah Wilson',
        email: 'sarah@wilson.com',
        status: 'Active',
        role: 'Manager',
      },
    ],
  },
  {
    group: 'Designer',
    collapsed: false,
    rows: [
      {
        id: 4,
        name: 'Alice Smith',
        email: 'alice@smith.com',
        status: 'Active',
        role: 'Designer',
      },
      {
        id: 10,
        name: 'Olivia Taylor',
        email: 'olivia@taylor.com',
        status: 'Active',
        role: 'Designer',
      },
    ],
  },
  {
    group: 'HR',
    collapsed: false,
    rows: [
      {
        id: 1,
        name: 'Jane Mary',
        email: 'jane@doe.com',
        status: 'Inactive',
        role: 'HR',
      },
      {
        id: 7,
        name: 'Michael Brown',
        email: 'michael@brown.com',
        status: 'Inactive',
        role: 'HR',
      },
      {
        id: 12,
        name: 'Sophia Martinez',
        email: 'sophia@martinez.com',
        status: 'Active',
        role: 'HR',
      },
    ],
  },
  {
    group: 'Tester',
    collapsed: false,
    rows: [
      {
        id: 5,
        name: 'Bob Johnson',
        email: 'bob@johnson.com',
        status: 'Inactive',
        role: 'Tester',
      },
      {
        id: 11,
        name: 'James Anderson',
        email: 'james@anderson.com',
        status: 'Inactive',
        role: 'Tester',
      },
    ],
  },
])

const custom_columns = reactive([
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
])

const custom_rows = [
  {
    id: 1,
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
  {
    id: 2,
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
]
</script>

<template>
  <Story :layout="{ type: 'grid', width: '95%' }">
    <Variant title="Simple List">
      <ListView
        class="h-[150px]"
        :columns="simple_columns"
        :rows="simple_rows"
        :options="{
          getRowRoute: (row) => ({ name: 'User', params: { userId: row.id } }),
          selectable: state.selectable,
          showTooltip: state.showTooltip,
          resizeColumn: state.resizeColumn,
        }"
        row-key="id"
      />
    </Variant>
    <Variant title="Custom List">
      <ListView
        class="h-[150px]"
        :columns="custom_columns"
        :rows="custom_rows"
        :options="{
          onRowClick: (row) => console.log(row),
          selectable: state.selectable,
          showTooltip: state.showTooltip,
          resizeColumn: state.resizeColumn,
        }"
        row-key="id"
      >
        <ListHeader>
          <ListHeaderItem
            v-for="column in custom_columns"
            :key="column.key"
            :item="column"
          >
            <template #prefix="{ item }">
              <FeatherIcon :name="item.icon" class="h-4 w-4" />
            </template>
          </ListHeaderItem>
        </ListHeader>
        <ListRows>
          <ListRow
            v-for="row in custom_rows"
            :key="row.id"
            v-slot="{ column, item }"
            :row="row"
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
    <Variant title="Grouped Rows">
      <ListView
        class="h-[250px]"
        :columns="group_columns"
        :rows="grouped_rows"
        :options="{
          getRowRoute: (row) => ({ name: 'User', params: { userId: row.id } }),
          selectable: state.selectable,
          showTooltip: state.showTooltip,
          resizeColumn: state.resizeColumn,
        }"
        row-key="id"
      >
        <template #group-header="{ group }">
          <span class="text-base font-medium leading-6 text-gray-900">
            {{ group.group }} ({{ group.rows.length }})
          </span>
        </template>
      </ListView>
    </Variant>
    <Variant title="Cell Slot">
      <div>
        <ListView
          class="h-[250px]"
          :columns="simple_columns"
          :rows="simple_rows"
          :options="{
            selectable: state.selectable,
            showTooltip: state.showTooltip,
            resizeColumn: state.resizeColumn,
            emptyState: state.emptyState,
          }"
          row-key="id"
        >
          <template #cell="{ item, row, column }">
            <Badge v-if="column.key == 'status'">{{ item }}</Badge>
            <span class="font-medium text-gray-700" v-else>{{ item }}</span>
          </template>
        </ListView>
      </div>
    </Variant>
    <Variant title="Empty List">
      <div>
        <ListView
          class="h-[250px]"
          :columns="simple_columns"
          :rows="[]"
          :options="{
            selectable: state.selectable,
            showTooltip: state.showTooltip,
            resizeColumn: state.resizeColumn,
            emptyState: state.emptyState,
          }"
          row-key="id"
        />
      </div>
    </Variant>

    <template #controls>
      <HstCheckbox v-model="state.selectable" title="Selectable" />
      <HstCheckbox v-model="state.showTooltip" title="Show tooltip" />
      <HstCheckbox v-model="state.resizeColumn" title="Resize Column" />
      <!-- empty state config -->
      <HstText
        v-model="state.emptyState.title"
        title="Empty Title"
        placeholder="No records found"
      />
      <HstText
        v-model="state.emptyState.description"
        title="Empty Description"
        placeholder="Create a new record to get started"
      />
    </template>
  </Story>
</template>
