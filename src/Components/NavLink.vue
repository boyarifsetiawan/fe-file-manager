<script setup>
	import { computed } from "vue";
	import { RouterLink } from "vue-router";

	const props = defineProps({
		href: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
		},
	});

	const classes = computed(() =>
		props.active
			? "flex items-center px-5 py-2 border-indigo-400 text-sm font-medium leading-5 text-indigo-700 rounded-lg  bg-indigo-100 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
			: "flex items-center px-5 py-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
	);
</script>

<template>
	<router-link :to="href" :class="classes">
		<slot />
	</router-link>
</template>
