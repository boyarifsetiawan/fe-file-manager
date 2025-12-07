<template>
	<div class="w-[600px] h-20 flex items-center">
		<TextInput
			type="text"
			class="block w-full mr-2 px-4 py-4"
			v-model="search"
			autocomplete
			@keyup.enter.prevent="onSearch"
			placeholder="Search for files and folders"
		/>
	</div>
</template>

<script setup>
	// Imports
	import TextInput from "../TextInput.vue";
	import { onMounted, ref } from "vue";
	import { emitter, ON_SEARCH } from "../../event-bus.js";
	import { useRouter } from "vue-router";

	// Uses
	const router = useRouter();
	let params = new URLSearchParams(window.location.search);

	// Refs
	const search = ref("");

	// Props & Emit

	// Computed

	// Methods
	function onSearch() {
		params.set("search", search.value);
		emitter.emit(ON_SEARCH, search.value);
	}

	// Hooks
	onMounted(() => {
		search.value = params.get("search");
	});
</script>

<style scoped></style>
