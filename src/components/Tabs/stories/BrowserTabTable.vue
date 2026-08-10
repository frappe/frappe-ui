<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabList, TabTrigger, TabPanel, Badge } from 'frappe-ui'

const tab = ref('deals')

const tabs = [
  { value: 'deals', label: 'Deals', count: '14' },
  { value: 'contact', label: 'Contact', count: '25' },
  { value: 'organizations', label: 'Organizations', count: '02' },
]

const deals = [
  {
    no: 1,
    organization: 'Attentive',
    returns: '0.00',
    status: 'Negotiation',
    theme: 'amber',
    email: 'bessiecooper@example.com',
  },
  {
    no: 2,
    organization: 'Gumroad',
    returns: '20,000.00',
    status: 'Ready to Close',
    theme: 'violet',
    email: 'jamescooper@example.com',
  },
  {
    no: 3,
    organization: 'Evergreen',
    returns: '10,000.00',
    status: 'Qualification',
    theme: 'blue',
    email: 'maxwell@example.com',
  },
] as const
</script>

<template>
  <div class="w-full max-w-3xl">
    <Tabs v-model="tab">
      <TabList variant="browser-tab" class="px-2">
        <TabTrigger
          v-for="t in tabs"
          :key="t.value"
          :value="t.value"
          :label="t.label"
        >
          <template #suffix>
            <Badge size="sm">{{ t.count }}</Badge>
          </template>
        </TabTrigger>
      </TabList>

      <TabPanel value="deals">
        <table class="w-full border-collapse text-base">
          <thead>
            <tr class="text-left text-ink-gray-5">
              <th class="border-b border-outline-gray-1 p-2 font-normal">No</th>
              <th class="border-b border-outline-gray-1 p-2 font-normal">
                Organization
              </th>
              <th
                class="border-b border-outline-gray-1 p-2 text-right font-normal"
              >
                Annual Returns
              </th>
              <th class="border-b border-outline-gray-1 p-2 font-normal">
                Status
              </th>
              <th class="border-b border-outline-gray-1 p-2 font-normal">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deal in deals" :key="deal.no" class="text-ink-gray-7">
              <td class="border-b border-outline-gray-1 p-2">{{ deal.no }}</td>
              <td class="border-b border-outline-gray-1 p-2">
                {{ deal.organization }}
              </td>
              <td class="border-b border-outline-gray-1 p-2 text-right">
                {{ deal.returns }}
              </td>
              <td class="border-b border-outline-gray-1 p-2">
                <Badge :theme="deal.theme">{{ deal.status }}</Badge>
              </td>
              <td class="border-b border-outline-gray-1 p-2">
                {{ deal.email }}
              </td>
            </tr>
          </tbody>
        </table>
      </TabPanel>
      <TabPanel value="contact">
        <div class="p-4 text-base text-ink-gray-7">Contacts show up here.</div>
      </TabPanel>
      <TabPanel value="organizations">
        <div class="p-4 text-base text-ink-gray-7">
          Organizations show up here.
        </div>
      </TabPanel>
    </Tabs>
  </div>
</template>
