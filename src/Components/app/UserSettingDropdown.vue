<template>
	<!-- <Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton
				@click="onShow"
				:class="[activeLink ? 'bg-indigo-200 text-indigo-700' : '']"
				class="inline-flex w-full justify-center rounded-md bg-black-800 px-4 py-2 text-sm font-medium text-black hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
			>
				Boy
				<ChevronDownIcon
					class="-mr-1 ml-2 h-5 w-5 text-black hover:bg-indigo-200"
					aria-hidden="true"
				/>
			</MenuButton>
		</div>

		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<MenuItems
				class="absolute right-0 mt-2 w-[150px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
			> 
				<div class="px-1 py-1"> 
					 <MenuItem v-slot="{ active }"> 
					 <ResponsiveNavLink
							:href="route('profile.edit')"
							:class="[
								active
									? 'bg-violet-500 text-white'
									: 'text-gray-900',
								'group flex w-full items-center rounded-md px-2 py-2 text-sm flex justify-between',
							]"
						>
							Profile
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
								/>
							</svg>
						</ResponsiveNavLink>
					</MenuItem> 
				 </div>
			</MenuItems>
			
		</transition>
	</Menu> -->
	<button
		@click="handleLogout"
		class="group items-center gap-2 rounded-md px-2 py-2 text-sm flex bg-gray-100 hover:bg-gray-700 hover:text-white"
	>
		Logout
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-4"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
			/>
		</svg>
	</button>
</template>
<script setup>
	import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
	import { ChevronDownIcon } from "@heroicons/vue/20/solid";
	import ResponsiveNavLink from "../ResponsiveNavLink.vue";
	import NavLink from "../NavLink.vue";
	import { ref } from "vue";
	import { useAuthStore } from "../../store/useAuthStore";
	import { api } from "../../axios";
	import { useRouter } from "vue-router";
	import { logoutUrl } from "../../Helper/routes-api";

	const authStore = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		api.post(logoutUrl)
			.then((response) => {
				authStore.logout();
				console.log("Logged out successfully");
			})
			.catch((error) => {
				console.log("Error logging out:", error);
			})
			.finally(() => {
				router.push({ name: "login" });
			});
	};

	let activeLink = ref(false);
	const onShow = () => {
		activeLink.value = !activeLink.value;
	};
</script>
