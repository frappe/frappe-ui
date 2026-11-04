<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Checkbox, Divider, Radio, RadioGroup, Switch } from '../../../src'
import * as pending from '../pendingFrappeUIChanges'

const desktopEnabled = ref(true)
const desktopScope = ref('task-updates')

const team = reactive({
  status: true,
  comments: true,
  tasks: true,
  members: false,
})

const account = reactive({
  privacy: true,
  invite: true,
})

const teamOptions = [
  { key: 'status', label: 'Status updates' },
  { key: 'comments', label: 'Comments and messages' },
  { key: 'tasks', label: 'Tasks added' },
  { key: 'members', label: 'Members updates' },
] as const
</script>

<template>
  <!--
    Spacing for lists in a settings modal — one scale, whatever the control:

        4   a heading to its blurb, and a row's title to its description
       16   row to row inside a cluster (radio, checkbox and switch alike)
       24   a heading block down to the first row of its cluster
       24   a section to the rule below it, and the rule to the next section

    Descriptions carry ~2.5px of leading below their last line where labels
    carry none, so a description-ending row used to open a wider gap than a
    plain one. `leadingTrim` removes that, which is what keeps 16 reading as
    16 everywhere.

    The design itself wanders — 26/26/16 under the headings, 16/16/24 between
    rows, 20 above a rule and 35 below — so none of those are followed.
  -->
  <div class="flex w-[700px] max-w-full flex-col gap-6">
    <section class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-4">
          <!--
            The design draws this one heading in #383838 and the other two in
            #171717; all three use #171717 here.
          -->
          <h3 class="min-w-0 flex-1 text-lg-semibold text-ink-gray-8">
            Desktop notifications
          </h3>
          <Switch
            v-model="desktopEnabled"
            :class="pending.bareSwitch"
            size="md"
            aria-label="Desktop notifications"
          />
        </div>
        <p class="text-base text-ink-gray-6" :class="pending.cellText">
          Send me desktop notifications for:
        </p>
      </div>

      <!-- `gap-y-4`: the group's own row gap is 6px; the rows here sit 16 apart. -->
      <RadioGroup
        v-model="desktopScope"
        size="sm"
        class="[&>[role=radiogroup]]:gap-y-4"
        :class="pending.radioRow"
        aria-label="Send me desktop notifications for"
      >
        <Radio
          value="task-updates"
          label="Task updates"
          description="You’ll be notified when there’s a new comment on a task you’re following, you’re assigned a task or you’re added as a collaborator on a task"
        />
        <Radio
          value="mentions"
          label="@Mentions only"
          description="You’ll be notified when someone mentions you"
        />
      </RadioGroup>
    </section>

    <!-- frappe-ui's Divider is a shade darker than every other line here. -->
    <Divider :class="pending.divider" />

    <section class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <h3 class="text-lg-semibold text-ink-gray-8">
          Team and project notifications
        </h3>
        <!-- `-my-[2px]`: same leading trim the rows use, so the 24px below
             this blurb reads as 24. -->
        <p class="-my-[2px] text-p-base text-ink-gray-6">
          Set notification defaults for all the teams and projects that you are
          a part of. You can change settings for individual teams and projects
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <Checkbox
          v-for="option in teamOptions"
          :key="option.key"
          v-model="team[option.key]"
          :class="pending.checkboxRow"
          size="sm"
          :label="option.label"
        />
      </div>
    </section>

    <Divider :class="pending.divider" />

    <section class="flex flex-col gap-6">
      <h3 class="text-lg-semibold text-ink-gray-8">Account &amp; updates</h3>

      <div class="flex flex-col gap-4">
        <Switch
          v-model="account.privacy"
          :class="pending.switchRow"
          size="md"
          label="Privacy and legal updates"
          description="Receive emails when we have important updates to share regarding our privacy policy or terms of service"
        />
        <Switch
          v-model="account.invite"
          :class="pending.switchRow"
          size="md"
          label="Invite accepted"
          description="Receive an email when an invitee accepts your invite"
        />
      </div>
    </section>
  </div>
</template>
