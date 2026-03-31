<template>
	<Popover transition="default" @open="registerDeleteShortcut" @close="unregisterDeleteShortcut">
		<template #target="{ togglePopover }">
			<div
				ref="eventRef"
				v-bind="$attrs"
				class="event flex gap-1.5 min-h-6 mx-px rounded p-[5px] transition-all duration-75 w-full"
				:class="[
					activeEvent == (props.event?.id || props.event?.name) && 'active',
					isPastEvent && 'past',
				]"
				:style="eventBgStyle"
				@click.stop="handleEventClick($event, togglePopover)"
				@dblclick.prevent="handleEventEdit($event)"
			>
				<div
					v-if="props.event.fromTime"
					class="event-border w-[2px] rounded shrink-0"
					:style="eventBorderStyle"
				/>
				<div class="relative flex h-full select-none items-start gap-2 overflow-hidden">
					<div v-if="config.showIcon && eventIcons[props.event.type]">
						<component :is="eventIcons[props.event.type]" class="h-4 w-4 text-black" />
					</div>
					<div class="flex w-fit flex-col text-start overflow-hidden whitespace-nowrap">
						<p class="text-sm font-medium truncate" :class="{ italic: !props.event.title }">
							{{ props.event.title || '[No title]' }}
						</p>
					</div>
				</div>
			</div>
		</template>

		<template #body-main="{ close }">
			<slot
				name="event-popover-content"
				:calendarEvent
				:date
				:isEditMode="config.isEditMode"
				:close
			>
				<EventModalContent
					:calendarEvent="calendarEvent"
					:date="date"
					:isEditMode="config.isEditMode"
					@close="close"
					@edit="
						(e) => {
							close()
							handleEventEdit(e)
						}
					"
					@delete="
						() => {
							close()
							handleEventDelete()
						}
					"
				/>
			</slot>
		</template>
	</Popover>

	<NewEventModal v-model="showEventModal" :event="updatedEvent" />
</template>

<script setup>
import { ref } from 'vue'
import EventModalContent from './EventModalContent.vue'
import NewEventModal from './NewEventModal.vue'
import Popover from '../Popover/Popover.vue'
import { eventProps, useEventBase } from './useEventBase.js'

const props = defineProps(eventProps)

const eventRef = ref(null)

const {
	activeEvent,
	config,
	calendarEvent,
	updatedEvent,
	eventIcons,
	showEventModal,
	isPastEvent,
	eventBgStyle,
	eventBorderStyle,
	handleEventClick,
	handleEventEdit,
	handleEventDelete,
	registerDeleteShortcut,
	unregisterDeleteShortcut,
} = useEventBase(props)
</script>

<style scoped>
.event {
	background-color: var(--bg);
}
.event .event-title {
	color: var(--text);
}
.event .event-border {
	background-color: var(--border);
}
.event.active {
	background-color: var(--bg-active);
}
.event.active .event-title {
	color: var(--text-active, #fff);
}
.event.active .event-border {
	background-color: var(--border-active);
}
.event:not(.active):hover {
	background-color: var(--bg-hover);
}
.event.past:not(.active) {
	opacity: 0.5;
}
</style>
