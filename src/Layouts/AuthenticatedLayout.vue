<template>
	<div class="h-screen bg-gray-50 flex w-full gap-4">
		<Navigation />
		<main
			@drop.prevent="handleDrop"
			@dragover.prevent="onDragOver"
			@dragleave.prevent="onDragLeave"
			:class="dragOver ? 'dropzone' : ''"
			class="flex flex-col flex-1 px-4 overflow-hidden"
		>
			<template
				v-if="dragOver"
				class="text-gray-500 text-center py-8 text-sm"
			>
				Drop files here to upload
			</template>
			<template v-else>
				<div class="flex items-center justify-between w-full">
					<SearchForm />
					<UserSettingDropdown />
				</div>
				<div class="flex-1 flex flex-col overflow-hidden">
					<slot />
					<router-view></router-view>
				</div>
			</template>
		</main>
	</div>
	<FormProgress :form="fileUploadForm" />
	<ErrorDialog />
	<Notification />
</template>
<script setup>
	// Imports
	import Navigation from "../Components/app/Navigation.vue";
	import SearchForm from "../Components/app/SearchForm.vue";
	import UserSettingDropdown from "../Components/app/UserSettingDropdown.vue";
	import FormProgress from "../Components/app/FormProgress.vue";
	import ErrorDialog from "../Components/ErrorDialog.vue";
	import Notification from "../Components/Notification.vue";
	import Form from "vform";
	import { ref, onMounted } from "vue";
	import { useFilesStore } from "../store/useFilesStore.js";
	import { fileUploadUrl } from "../Helper/routes-api.js";
	import { useAuthStore } from "../store/useAuthStore.js";
	import {
		emitter,
		FILE_UPLOAD_STARTED,
		showSuccessNotification,
		showErrorDialog,
	} from "../event-bus.js";

	// Uses
	const fileStore = useFilesStore();
	const fileUploadForm = new Form({
		files: [],
		relative_paths: [],
		parent_id: null,
	});
	const test = ref([])
	// Refs
	const dragOver = ref(false);
	// Methods

	const onDragOver = () => {
		dragOver.value = true;
	};

	const onDragLeave = () => {
		dragOver.value = false;
	};

	const handleDrop = (ev) => {
		dragOver.value = false;
		// const files = ev.dataTransfer.files;
		// if (!files.length) return;
		// uploadFiles(files);
		const items = ev.dataTransfer.items;
		let files = [];

		for (const item of items) {
			const entry = item.webkitGetAsEntry();
			if (entry) {
			traverseFileTree(entry, "", files);
			}
		}

		setTimeout(() => {
			// FILES ready dengan path
			// console.log(files);
			uploadFiles(files);
		}, 500);
	};

	function traverseFileTree(entry, path, files) {
		if (entry.isFile) {
			entry.file((file) => {
			file.relativePath = path + file.name;
			files.push(file);
			});
		} else if (entry.isDirectory) {
			const reader = entry.createReader();
			reader.readEntries((entries) => {
			entries.forEach((e) => {
				traverseFileTree(e, path + entry.name + "/", files);
			});
			});
		}
	}

	const uploadFiles = (files) => {
		fileUploadForm.parent_id = fileStore.folder.id;
		fileUploadForm.files = files;
		fileUploadForm.relative_paths = [...files].map(
			(f) => f.relativePath
		);

		// console.log(fileUploadForm);
		// console.log(fileUploadForm.files);

		fileUploadForm.post(fileUploadUrl, {
			headers : {
				Accept: 'application/json',
				Authorization: `Bearer ${useAuthStore().token}`,
			}
		}).then((res) => {
			showSuccessNotification(`${files.length} files have been uploaded`);
			fileStore.fetchFolder(fileStore.folder.path);
			// fileUploadForm.clearErrors();
			fileUploadForm.reset();
		}).catch((errors) => {
			console.log(errors)
			const m = errors.response.data.message;
		
			let message = "";

			if (typeof m === "object") {
				const firstKey = Object.keys(m)[0];
				message = m[firstKey];
			} else {
				message = m;
			}

			showErrorDialog(message);
		})

	};

	//Hooks
	onMounted(() => {
		emitter.on(FILE_UPLOAD_STARTED, uploadFiles);
	});
</script>
<style scoped>
	.dropzone {
		width: 100%;
		height: 100%;
		color: #8d8d8d;
		border: 2px dashed gray;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
