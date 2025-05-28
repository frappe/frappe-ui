<template>
  <Dialog
    v-model="show"
    :options="{
      title: props.event.hasOwnProperty('id') ? 'Edit Event' : 'New Event',
      actions: [
        {
          label: 'Submit',
          variant: 'solid',
        },
      ],
    }"
    class="z-50"
  >
    <template #body-content>
      <div>
        <div class="grid grid-cols-1 gap-4">
          <FormControl
            type="Input"
            v-model="newEvent.title"
            label="Title"
            placeholder="Meet with John Doe"
          />
          <FormControl
            type="Date"
            v-model="newEvent.date"
            label="Date"
            required="true"
            @blur="validateFields()"
          />

          <FormControl
            type="Input"
            v-model="newEvent.participant"
            label="Person"
            placeholder="John Doe"
          />

          <FormControl
            type="time"
            v-model="newEvent.from_time"
            label="Start Time"
            @blur="validateFields()"
            v-if="!newEvent.isFullDay"
          />

          <FormControl
            type="time"
            v-model="newEvent.to_time"
            label="End Time"
            @blur="validateFields()"
            v-if="!newEvent.isFullDay"
          />

          <FormControl
            type="Input"
            v-model="newEvent.venue"
            label="Venue"
            placeholder="Frappe, Neelkanth Business Park"
          />
          <FormControl
            type="select"
            v-model="newEvent.color"
            :options="colors"
            label="Color"
            class="form-control prefix"
          >
            <template #prefix>
              <div
                class="h-5 w-5 rounded-full shadow-md"
                :class="[
                  colorMap[newEvent?.color]?.background_color || 'bg-green-100',
                ]"
              />
            </template>
          </FormControl>
          <FormControl
            type="checkbox"
            label="Full Day Event?"
            v-model="newEvent.isFullDay"
          />
          <ErrorMessage :message="errorMessage" v-if="errorMessage" />
        </div>
      </div>
    </template>
    <template #actions="{ close }">
      <div class="flex flex-row-reverse gap-2">
        <Button
          class="w-full"
          variant="solid"
          @click="submitEvent(close)"
          label="Submit"
        />
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { computed, inject, reactive, ref } from 'vue'
import { Dialog } from '../Dialog'
import { FormControl } from '../FormControl'
import { ErrorMessage } from '../ErrorMessage'
import { Button } from '../Button'

import { calculateDiff, colorMap, handleSeconds } from './calendarUtils'
const show = ref(false)

const props = defineProps({
  event: {
    type: Object,
  },
})

const newEvent = reactive({
  title: props.event?.title || '',
  date: props.event?.date || '',
  participant: props.event?.participant || '',
  from_time: props.event?.from_time || '',
  to_time: props.event?.to_time || '',
  venue: props.event?.venue || '',
  color: props.event?.color || 'green',
  id: '',
  isFullDay: props.event?.isFullDay || false,
})

const isUpdated = computed(() => {
  return (
    newEvent.title !== props.event.title ||
    newEvent.date !== props.event.date ||
    newEvent.participant !== props.event.participant ||
    newEvent.from_time !== props.event.from_time ||
    newEvent.to_time !== props.event.to_time ||
    newEvent.venue !== props.event.venue ||
    newEvent.color !== props.event.color ||
    newEvent.isFullDay !== props.event.isFullDay
  )
})

const colors = Object.keys(colorMap)

const errorMessage = ref('')
function validateFields() {
  if (!newEvent.date) {
    errorMessage.value = 'Date is required'
  } else if (!newEvent.from_time && !newEvent.isFullDay) {
    errorMessage.value = 'Start Time is required'
  } else if (!newEvent.to_time && !newEvent.isFullDay) {
    errorMessage.value = 'End Time is required'
  } else {
    errorMessage.value = ''
  }
  if (
    newEvent.hasOwnProperty('from_time') &&
    newEvent.hasOwnProperty('to_time')
  ) {
    validateStartEndTime()
  }
}

function validateStartEndTime() {
  let timeDiff = calculateDiff(newEvent.from_time, newEvent.to_time)
  if (timeDiff <= 0) {
    errorMessage.value = 'Start time must be less than End Time'
  }
}

const calendarActions = inject('calendarActions')

function submitEvent(close) {
  validateFields()
  if (errorMessage.value) {
    return
  }
  if (!isUpdated.value) {
    close()
    return
  }

  // if it has ID then event already exists
  handleEventTime()
  if (props.event.hasOwnProperty('id')) {
    newEvent.id = props.event.id
    calendarActions.updateEventState(newEvent)
  }
  // else new event is created with ID
  else {
    const id = '#' + Math.random().toString(36).substring(3, 9)
    newEvent.id = id
    calendarActions.createNewEvent(newEvent)
  }
  close()
}

function handleEventTime() {
  if (newEvent.isFullDay) {
    newEvent.from_time = ''
    newEvent.to_time = ''
  } else {
    newEvent.from_time = handleSeconds(newEvent.from_time)
    newEvent.to_time = handleSeconds(newEvent.to_time)
  }
}
</script>

<style>
.form-control.prefix select {
  padding-left: 2.2rem !important;
  text-transform: capitalize !important;
}
</style>
