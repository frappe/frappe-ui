<script setup lang="ts">
import { createResource } from "frappe-ui";
import LucideCircle from "~icons/lucide/circle";

const todos = createResource({
	auto: true,
	url: "/api/method/frappe.client.get_list",
	params: {
		doctype: "ToDo",
		fields: ["name", "status", "priority"],
	},
});

const priorityClasses = {
  Low: "text-ink-gray-3",
  Medium: "text-ink-blue-3",
  High: "text-ink-red-4",
}
</script>

<template>
	<div class="m-4 mt-0 w-full">
		<table class="w-full">
			<tbody class="[&_th]:p-3 [&_td]:p-3">
				<tr class="text-left *:border-b *:border-outline-gray-5">
					<th>Name</th>
					<th>Status</th>
					<th>priority</th>
				</tr>

				<tr v-for="x in todos.data" class="*:border-b">
					<td>{{ x.name }}</td>
					<td>{{ x.status }}</td>
					<td>
						<div class="flex gap-2">
							<LucideCircle class="size-4" :class="priorityClasses[x.priority]" />
							{{ x.priority }}
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
