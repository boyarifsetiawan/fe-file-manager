<template>
	<modal :show="props.modelValue" @show="onShow" max-width="sm">
		<div class="p-6">
			<h2 class="text-lg font-medium text-gray-900">Share Files</h2>
			<div class="mt-6">
				<InputLabel
					for="shareEmail"
					value="Enter Email Address"
					class="sr-only"
				/>

				<TextInput
					type="text"
					ref="emailInput"
					id="shareEmail"
					v-model="form.email"
					 :class="
                        errors
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                    "
					class="mt-1 block w-full"
					placeholder="Enter Email Address"
					@keyup.enter="share"
				/>
					<InputError
						class="mt-2"
						:message="errors"
					/>
			</div>
			<div class="mt-6 flex justify-end">
				<SecondaryButton @click="closeModal">Cancel</SecondaryButton>
				<PrimaryButton
					class="ml-3"
					:class="{ 'opacity-25': form.processing }"
					@click="share"
					:disable="form.processing"
				>
					Submit
				</PrimaryButton>
			</div>
		</div>
	</modal>
</template>

<script setup>
	// Imports
	import Modal from "../../Components/Modal.vue";
	import TextInput from "../../Components/TextInput.vue";
	import InputError from "../../Components/InputError.vue";
	import InputLabel from "../../Components/InputLabel.vue";
	import SecondaryButton from "../../Components/SecondaryButton.vue";
	import PrimaryButton from "../../Components/PrimaryButton.vue";
	import { nextTick, ref } from "vue";
	import { showSuccessNotification } from "../../event-bus";
	import Form from "vform";
	import { useFilesStore } from "../../store/useFilesStore";
import { fileShareUrl } from "../../Helper/routes-api";
import { useAuthStore } from "../../store/useAuthStore";

	const fileStore = useFilesStore();
	const authStore = useAuthStore();


	// Uses
	const form = new Form({
		email: null,
		all: false,
		ids: [],
		parent_id: null,
	});

	// Refs
	const errors = ref(null);
	const emailInput = ref(null);

	// Props & Emit
	const props = defineProps({
		modelValue: Boolean,
		allSelected: Boolean,
		selectedIds: Array,
	});
	const emit = defineEmits(["update:modelValue"]);

	// Computed

	// Methods
	function onShow() {
		nextTick(() => emailInput.value.focus());
	}

	function share() {
		form.parent_id = fileStore.folder.id;
		console.log(form.email);
		console.log(form.parent_id);
		console.log(form.all);
		console.log(form.ids);
		if (props.allSelected) {
			form.all = true;
			form.ids = [];
		} else {
			form.ids = props.selectedIds;
		}
		const email = form.email;
		form.post(fileShareUrl, {
			headers: {
				Accept: "application/json",
				Authorization : `Bearer ${authStore.token}`,
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
			}
		})
		.then(() => {
			closeModal();
			form.reset();
			showSuccessNotification(`Selected files will be shared to "${email}" if the emails exists in the system`);
		}).catch((error) => {
			errors.value = error.response?.data?.errors?.email[0]
			console.log(errors)
			form.reset();	
		});
	}

	function closeModal() {
		emit("update:modelValue");
		errors.value = null
		form.reset();
	}

	// Hooks
</script>

<style scoped></style>
