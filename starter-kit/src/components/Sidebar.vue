<script setup lang="ts">
import { reactive } from "vue";
import { Sidebar } from "frappe-ui";
import { session } from "../data/session";

import Notifications from "~icons/lucide/bell";
import Moon from "~icons/lucide/moon";
import Settings from "~icons/lucide/settings";
import User from "~icons/lucide/user";

function toggleTheme() {
	const currentTheme = document.documentElement.getAttribute("data-theme");
	const newTheme = currentTheme === "dark" ? "light" : "dark";
	document.documentElement.setAttribute("data-theme", newTheme);
}

const crmSidebar = reactive({
	header: {
		title: "Frappe Starter",
		subtitle: session.user,
		logo: "https://raw.githubusercontent.com/frappe/crm/develop/.github/logo.svg",
		menuItems: [
			{ label: "Toggle Theme", icon: Moon, onClick: toggleTheme },
			{
				label: "Help",
				to: "/help",
				icon: Settings,
				onClick: () => alert("Help clicked!"),
			},
			{
				label: "Logout",
				to: "/logout",
				icon: User,
				onClick: () => session.logout(),
			},
		],
	},
	sections: [
		{
			label: "",
			items: [{ label: "Notifications", icon: Notifications, to: "/" }],
		},
	],
});
</script>

<template>
	<Sidebar :header="crmSidebar.header" :sections="crmSidebar.sections" />
</template>
