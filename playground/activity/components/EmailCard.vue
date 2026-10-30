<script setup lang="ts">
import { Button, Divider } from '../../../src'
import FileIcon from './FileIcon.vue'

export type Attachment = {
  name: string
  meta: string
  type: 'zip' | 'pdf' | 'doc'
}

withDefaults(
  defineProps<{
    /** Sender and their address, as the design prints them. */
    name: string
    address: string
    /** Recipients and subject — left out on a one-line preview. */
    to?: string
    subject?: string
    /** Right-hand timestamp. */
    time: string
    /** The message itself. Blank lines are kept. */
    body: string
    attachments?: Attachment[]
    /** A preview drops the rule and the To/Subject block. */
    preview?: boolean
    /** The design shows a Reply button under one message. */
    reply?: boolean
    /** The "…" control that hides the thread this message answers. */
    thread?: boolean
    /** The quoted thread itself, when it is opened out. */
    quotedFrom?: string
    quoted?: string
  }>(),
  { attachments: () => [] },
)
</script>

<template>
  <!--
    A one-line message is its own shape in the file (node 35076:55048): the
    card is 6/12/10/12 rather than 6/12/12/12, and the message doesn't sit in
    a section of its own — it shares a stack with the header row at an item
    spacing of **-2**. A full message keeps the 14 between its sections.
  -->
  <div
    class="flex flex-col rounded-5 border border-outline-gray-1 bg-surface-elevation-1 px-3 pt-1.5"
    :class="preview ? 'gap-0 pb-2.5' : 'gap-3.5 pb-3'"
  >
    <div class="flex flex-col">
      <div class="flex h-7 items-center gap-2">
        <p class="flex min-w-0 items-baseline gap-1.5">
          <span class="text-base-medium text-ink-gray-7">{{ name }}</span>
          <span class="truncate text-base text-ink-gray-5">
            &lt;{{ address }}&gt;
          </span>
        </p>

        <!--
        The actions are the same grey as the timestamp beside them, and the
        last one is pulled out by the difference between the card's sides and
        its top (12 and 6), so its hover square sits the same distance from
        both edges instead of looking wedged into the corner.
      -->
        <div class="ml-auto flex shrink-0 items-center gap-1 -mr-1.5">
          <span class="mr-1 text-sm text-ink-gray-5">{{ time }}</span>
          <Button
            size="sm"
            variant="ghost"
            icon="lucide-reply"
            class="!text-ink-gray-5"
          />
          <Button
            v-if="!preview"
            size="sm"
            variant="ghost"
            icon="lucide-reply-all"
            class="!text-ink-gray-5"
          />
          <Button
            size="sm"
            variant="ghost"
            icon="lucide-more-horizontal"
            class="!text-ink-gray-5"
          />
        </div>
      </div>

      <div v-if="!preview" class="-mt-0.5 flex flex-col gap-1">
        <p class="truncate text-base text-ink-gray-5">To: {{ to }}</p>
        <p class="truncate text-base text-ink-gray-5">
          Subject: <span class="text-ink-gray-7">{{ subject }}</span>
        </p>
      </div>
    </div>

    <!--
      Divider draws itself in `outline-gray-2`, which is a step too light
      against a card in the dark theme; every rule in the design is
      `outline-gray-1`. The component has no colour prop, hence the override.
    -->
    <Divider v-if="!preview" class="!border-outline-gray-1" />

    <!--
      The preview's line is a 16.1px one, not the paragraph's 21 — which is
      what makes the file's -2 work out to 20px baseline to baseline. Against
      a 21px line the same -2 would read 2.5px tight.
    -->
    <p
      class="whitespace-pre-line text-ink-gray-7"
      :class="preview ? '-mt-0.5 text-base' : 'text-p-base'"
    >
      {{ body }}
    </p>

    <!-- Attachments share the row evenly, each one a grey tile. -->
    <div v-if="attachments.length" class="flex gap-2">
      <div
        v-for="file in attachments"
        :key="file.name"
        class="flex min-w-0 flex-1 flex-col gap-[5px] rounded-5 bg-surface-gray-2 px-2 py-1.5"
      >
        <p class="truncate text-base-medium text-ink-gray-7">{{ file.name }}</p>
        <p class="flex items-center gap-1.5 text-xs text-ink-gray-7">
          <FileIcon :type="file.type" />
          {{ file.meta }}
        </p>
      </div>
    </div>

    <Button
      v-if="reply"
      class="self-start"
      size="sm"
      variant="subtle"
      icon-left="lucide-reply"
      label="Reply"
    />

    <!-- The quoted thread: the "…" control, then the message it hides. -->
    <span
      v-if="thread || quoted"
      class="inline-flex h-4 w-7 items-center justify-center rounded-4 bg-surface-gray-2"
    >
      <span
        class="lucide-more-horizontal size-4 text-ink-gray-6"
        aria-hidden="true"
      />
    </span>

    <!-- 14px from the rule to the quoted text, as the divider's own gap. -->
    <div
      v-if="quoted"
      class="flex flex-col gap-4 border-l border-outline-gray-1 pl-3.5"
    >
      <p class="text-p-base text-ink-gray-7">{{ quotedFrom }}</p>
      <p class="whitespace-pre-line text-p-base text-ink-gray-7">
        {{ quoted }}
      </p>
    </div>
  </div>
</template>
