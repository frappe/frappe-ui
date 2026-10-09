<script setup lang="ts">
/**
 * The `@` list, per the design (espresso-2.0, node 32467-13501): every person
 * with their 16px avatar before the name, 8px apart, on a 204px-wide menu —
 * and, when nobody matches what was typed, one row that offers to invite
 * that name, led by the user-add glyph. The list, its rows, its keyboard and
 * its grouping are `SuggestionList`'s; this only draws what sits in a row.
 */
import { useTemplateRef, type PropType } from 'vue'
import Avatar from '#components/Avatar/Avatar.vue'
import SuggestionList from '../suggestion/SuggestionList.vue'
import type { MentionSuggestionItem } from './mention-extension'

defineProps({
  items: {
    type: Array as PropType<MentionSuggestionItem[]>,
    required: true,
  },
  command: {
    type: Function as PropType<(item: MentionSuggestionItem) => void>,
    required: true,
  },
})

const list = useTemplateRef<InstanceType<typeof SuggestionList>>('list')

defineExpose({
  onKeyDown: (payload: { event: KeyboardEvent }) =>
    list.value?.onKeyDown(payload) ?? false,
})
</script>

<template>
  <SuggestionList
    ref="list"
    :items="items"
    :command="command"
    container-class="min-w-[204px]"
  >
    <template #default="{ item }">
      <span v-if="item.invite" class="flex items-center gap-2">
        <span class="lucide-user-plus size-4" aria-hidden="true" />
        <span>Invite “{{ item.label }}”</span>
      </span>
      <span v-else class="flex items-center gap-2">
        <Avatar
          :image="item.image as string | undefined"
          :label="item.label as string"
          size="xs"
          shape="circle"
        />
        <span>{{ item.label }}</span>
      </span>
    </template>
  </SuggestionList>
</template>
