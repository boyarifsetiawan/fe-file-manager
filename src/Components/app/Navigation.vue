<template>
	<nav class="min-w-[200px]">
		<router-link to="/" class="h-[80px] px-3 flex items-center gap-3">
			LaraStorage
		</router-link>
		<div class="px-3">
			<CreateNewDropdown />
			<div class="py-5">
				<NavLink href="/my-files" :active="$route.name === 'myFiles'"
					>My Files</NavLink
				>
				<NavLink
					href="/shared-with-me"
					:active="$route.name === 'file.sharedWithMe'"
					>Shared with me</NavLink
				>
				<NavLink
					href="/shared-by-me"
					:active="$route.name === 'file.sharedByMe'"
					>Shared by me</NavLink
				>
				<NavLink href="/trash" :active="$route.name === 'trash'"
					>Trash</NavLink
				>
			</div>
		</div>
	</nav>
</template>
<script setup>
	import { routerKey, RouterLink } from "vue-router";
	import ApplicationLogo from "../ApplicationLogo.vue";
	import CreateNewDropdown from "./CreateNewDropdown.vue";
	import NavLink from "../NavLink.vue";

	import { useRoute } from "vue-router";

	const route = useRoute();
</script>
