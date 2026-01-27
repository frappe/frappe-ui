<script setup lang="ts">
import { session } from "../data/session";
import { Button, Password, FormControl } from "frappe-ui";

const submit = (e) => {
	const formData = new FormData(e.target);
	console.log(formData.get("password"), "bruh");

	session.login.submit({
		email: formData.get("email"),
		password: formData.get("password"),
	});
};
</script>

<template>
	<div class="flex p-20 py-36">
		<form class="flex flex-col gap-5 w-1/3 m-auto shadow p-5 rounded" @submit.prevent="submit">
			<span class="font-semibold"> Login </span>

			<FormControl
				required
				name="email"
				type="text"
				placeholder="johndoe@email.com"
				label="User"
			/>
			<Password
				required
				name="password"
				label="Password"
				placeholder="Enter your password"
			/>
			<Button :loading="session.login.loading" variant="solid" type="submit">Login</Button>
		</form>
	</div>
</template>
