<template>
  <Combobox
    v-model="team"
    placeholder="Select a team"
    :options
    :disabled
    :open-on-click="true"
  />
</template>
<script setup lang="ts">
import { getTeams } from '../js/resources'
import icons from '../js/icons'
import { dynamicList } from '../js/utils'
import { computed, watch } from 'vue'
import Combobox from '../../../src/components/Combobox/Combobox.vue'
import { DropdownItem } from '../../../src/components/Dropdown/types'

getTeams.fetch()
const team = defineModel<string>()
const props = defineProps({
  // UC - redo
  none: { default: false, type: Boolean || String },
  allowBlank: { default: false },
  disabled: { default: false },
})
watch(
  () => getTeams.data,
  (teams) => {
    if (props.allowBlank || team.value) return
    if (props.none) {
      team.value = props.none === true ? 'all' : 'home'
    } else {
      team.value = Object.values(teams)[0]?.name
    }
  },
  { immediate: true },
)
const options = computed<DropdownItem[]>(() => {
  const res = Object.values(getTeams.data).map((k) => ({
    label: k.title,
    value: k.name,
    icon: icons[k.icon || 'building'],
  }))
  return dynamicList([
    { cond: props.none === true, label: 'Everywhere', value: 'all' },
    { cond: props.none, label: 'Home', value: 'home' },
    ...res,
  ])
})
</script>
