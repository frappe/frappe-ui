<script setup lang="ts">
import { FrappeUIProvider } from "frappe-ui";
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
	<FrappeUIProvider>
		<div class='flex h-screen'>
			<Sidebar />
			<router-view />
		</div>
	</FrappeUIProvider>
</template>
