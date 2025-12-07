<script setup>
	import Checkbox from "../../Components/Checkbox.vue";
	import GuestLayout from "../../Layouts/GuestLayout.vue";
	import InputError from "../../Components/InputError.vue";
	import InputLabel from "../../Components/InputLabel.vue";
	import PrimaryButton from "../../Components/PrimaryButton.vue";
	import TextInput from "../../Components/TextInput.vue";
	import Form from "vform";
	import { useAuthStore } from "../../store/useAuthStore";
	import { loginUrl } from "../../Helper/routes-api";
	import { useRouter } from "vue-router";
	//uses
	const authStore = useAuthStore();
	const router = useRouter();

	defineProps({
		canResetPassword: {
			type: Boolean,
		},
		status: {
			type: String,
		},
	});

	const form = new Form({
		email: "",
		password: "",
	});

	const submit = async () => {
		try {
			const res = await form.post(loginUrl, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			console.log(res.data.message);
			authStore.setToken(res.data.results?.token, res.data.results?.user);
			router.push("/");
		} catch (error) {
			console.log(error.response.data.message);
		}
	};
	document.title = "Login - File Manager";
</script>

<template>
	<GuestLayout>
		<div v-if="status" class="mb-4 text-sm font-medium text-green-600">
			{{ status }}
		</div>

		<form @submit.prevent="submit">
			<div>
				<InputLabel for="email" value="Email" />

				<TextInput
					id="email"
					type="email"
					class="mt-1 block w-full"
					v-model="form.email"
					required
					autofocus
					autocomplete="username"
					:class="{ 'is-invalid': form.errors.has('email') }"
				/>
				<div v-if="form.errors.has('email')" class="invalid-feedback">
					<InputError
						class="mt-2"
						:message="form.errors.get('email')"
					/>
				</div>
			</div>

			<div class="mt-4">
				<InputLabel for="password" value="Password" />

				<TextInput
					id="password"
					type="password"
					class="mt-1 block w-full"
					v-model="form.password"
					required
					autocomplete="current-password"
					:class="{ 'is-invalid': form.errors.has('password') }"
				/>

				<div
					v-if="form.errors.has('password')"
					class="invalid-feedback"
				>
					<InputError
						class="mt-2"
						:message="form.errors.get('password')"
					/>
				</div>
			</div>
			<div v-for="index in form.errors.items" :key="index">
				<InputError
					v-if="form.errors.has('items.' + index + '.name')"
					class="mt-2"
					:message="form.errors.errors"
				/>
			</div>
			<div class="mt-4 flex items-center justify-between">
				<router-link
					to="/register"
					class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Register
				</router-link>

				<PrimaryButton
					class="ms-4 ml-auto"
					:class="{ 'opacity-25': form.processing }"
					:disabled="form.processing"
				>
					Log in
				</PrimaryButton>
			</div>
		</form>
	</GuestLayout>
</template>
