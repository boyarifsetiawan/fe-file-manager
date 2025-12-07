<script setup>
	import GuestLayout from "../../Layouts/GuestLayout.vue";
	import InputError from "../../Components/InputError.vue";
	import InputLabel from "../../Components/InputLabel.vue";
	import PrimaryButton from "../../Components/PrimaryButton.vue";
	import TextInput from "../../Components/TextInput.vue";
	import Form from "vform";
	import { useAuthStore } from "../../store/useAuthStore";
	import { registerUrl } from "../../Helper/routes-api";
	import { useRouter } from "vue-router";
	//uses
	const router = useRouter();

	const form = new Form({
		email: "",
		password: "",
	});

	const submit = async () => {
		try {
			const res = await form.post(registerUrl, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			console.log(res.data.message);
			router.push("/login");
		} catch (error) {
			console.log(error.response.data.message);
		}
	};
	document.title = "Register - File Manager";
</script>

<template>
	<GuestLayout>
		<form @submit.prevent="submit">
			<div class="mt-4">
				<InputLabel for="email" value="Email" />

				<TextInput
					id="email"
					type="email"
					class="mt-1 block w-full"
					v-model="form.email"
					required
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
					autocomplete="new-password"
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

			<div class="mt-4 flex items-center justify-end">
				<router-link
					to="/login"
					class="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Already registered?
				</router-link>

				<PrimaryButton
					class="ms-4"
					:class="{ 'opacity-25': form.processing }"
					:disabled="form.processing"
				>
					Register
				</PrimaryButton>
			</div>
		</form>
	</GuestLayout>
</template>
