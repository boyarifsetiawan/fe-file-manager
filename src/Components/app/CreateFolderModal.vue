<template>
	<Modal :show="modelValue" @show="onShow" maxWidth="sm">
		<div class="p-6">
			<h2 class="text-lg font-medium text-gray-900">Create New Folder</h2>
			<div class="mt-5">
				<InputLabel
					for="folderName"
					value="Folder Name"
					class="sr-only"
				/>
				<TextInput
					ref="folderNameInput"
					type="text"
					id="folderName"
					v-model="form.name"
					class="mt-1 block w-full"
					placeholder="Folder Name"
					@keyup.enter="createFolder"
				/>
				<InputError :message="error" class="mt-2" />
			</div>
			<div class="mt-6 flex justify-end">
				<SecondaryButton @click="closeModal" type="text"
					>Cancel</SecondaryButton
				>
				<PrimaryButton
					@click="createFolder"
					class="ml-2"
					>Submit</PrimaryButton
				>
			</div>
		</div>
	</Modal>
</template>
<script setup>
	//   Import Components
	import Modal from "../Modal.vue";
	import TextInput from "../TextInput.vue";
	import InputLabel from "../InputLabel.vue";
	import InputError from "../InputError.vue";
	import SecondaryButton from "../SecondaryButton.vue";
	import PrimaryButton from "../PrimaryButton.vue";
	import Form from "vform";
	import { nextTick, reactive, ref } from "vue";
	import { useFilesStore } from "../../store/useFilesStore";
	import { createFolderUrl } from "../../Helper/routes-api";
	import { useAuthStore } from "../../store/useAuthStore";
	import { api } from "../../axios";
	import axios from "axios";
import { emitter, ON_FOLDER_CREATED } from "../../event-bus";
	// Uses
	const fileStore = useFilesStore();

	// Refs
	const error = ref(null);
	const folderNameInput = ref(false);
	const form = reactive({
		name: "",
		parent_id: null,
	});

	//Props & Emits
	let { modelValue } = defineProps({
		modelValue: Boolean,
	});

	const emit = defineEmits(["update:modelValue"]);

	// Functions
	const createFolder = async () => {
		form.parent_id = fileStore?.folder?.id;
		console.log(fileStore.folder.id);
		try {
			const res = await axios.post('/api/folder-create', form, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${useAuthStore().token}`,
				},
			});
			closeModal()
			await fileStore.fetchFolder(fileStore.folder.path);
		} catch (error) {
			closeModal();
			console.log(error);
		}
	};
	const onShow = () => {
		nextTick(() => folderNameInput.value.focus());
	};

	const closeModal = () => {
		emit("update:modelValue");
		form.name = "";
		error.value = null;
		form.parent_id = null;
	};
</script>
