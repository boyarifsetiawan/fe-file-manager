<template>
	<AuthenticatedLayout>
		<nav class="main-nav">
			<ol class="breadcrumb-list">
				<li v-for="ans of fileStore.ancestors" :key="ans.id" class="breadcrumb-item">
					<router-link v-if="!ans.parent_id" :to="{ name: 'myFiles' }" class="home-link">
						<HomeIcon class="home-icon" />
						My Files
					</router-link>
					<div v-else class="breadcrumb-separator-container">
						<ChevronRightIcon class="breadcrumb-separator-icon" stroke-width="4" />
						<router-link :to="{ name: 'myFiles', params: { pathMatch: ans.path }}" class="folder-link">
							{{ ans.name }}
						</router-link>
					</div>
				</li>
			</ol>
			<div class="actions-container">
				<label class="favourites-label">
					Only Favorites
					<Checkbox @change="showOnlyFavourites" v-model:checked="onlyFavourites" class="favourites-checkbox" />
				</label>
				<ShareFilesButton
					:all-selected="allSelected"
					:selected-ids="selectedIds" />
				<DownloadFilesButton :all="allSelected" :ids="selectedIds" class="mr-2" />
				<DeleteFilesButton :delete-all="allSelected" :delete-ids="selectedIds" @delete="onDelete" />
			</div>
		</nav>
		<div class="table-container">
			<table class="file-table">
				<thead class="table-header">
					<tr>
						<th class="th-checkbox">
							<Checkbox @change="onSelectAllChange" v-model:checked="allSelected" />
						</th>
						<th class="th-favourite"></th>
						<th class="th-default">Name</th>
						<th v-if="search" class="th-default">Path</th>
						<th class="th-default">Owner</th>
						<th class="th-default">Last Modified</th>
						<th class="th-default">Size</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="file of files"
						:key="file.id"
						@click="toggleFileSelect(file)"
						@dblclick="openFolder(file)"
						class="table-row"
						:class=" selected[file.id] || allSelected ? 'bg-blue-50' : 'bg-white' " >
						<td class="td-checkbox">
							<Checkbox @change="($event) => onSelectCheckboxChange(file)" v-model="selected[file.id]" :checked="selected[file.id] || allSelected" />
						</td>
						<td class="td-favourite">
							<div @click.stop.prevent="addRemoveFavourite(file)">
								<svg v-if="!file.is_favourite" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="favourite-icon">
									<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
								</svg>
								<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
									class="favourite-icon" >
									<path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"clip-rule="evenodd" />
								</svg>
							</div>
						</td>
						<td class="td-name">
							<FileIcon :file="file" />
							{{ file.name }}
						</td>
						<td v-if="search" class="td-default">
							{{ file.path }}
						</td>
						<td class="td-default">{{ file.owner }}</td>
						<td class="td-default">
							{{ file.updated_at }}
						</td>
						<td class="td-default">{{ file.size }}</td>
					</tr>
				</tbody>
			</table>
			<div v-if="!allFiles.data?.length" class="empty-data-message">
				There is no data in this folder
			</div>
			<div ref="loadMoreIntersect"></div>
		</div>
	</AuthenticatedLayout>
</template>
<script setup>
	// Imports
	import AuthenticatedLayout from "../Layouts/AuthenticatedLayout.vue";
	import FileIcon from "../Components/app/FileIcon.vue";
	import DeleteFilesButton from "../Components/app/DeleteFilesButton.vue";
	import DownloadFilesButton from "../Components/app/DownloadFilesButton.vue";
	import ShareFilesButton from "../Components/app/ShareFilesButton.vue";
	import Checkbox from "../Components/Checkbox.vue";
	import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/20/solid";
	import { computed, ref, onMounted, onUpdated, onUnmounted } from "vue";
	import { httpGet, httpPost } from "../Helper/http-helper";
	import { emitter,ON_DELETED,ON_SEARCH, showSuccessNotification } from "../event-bus";
	import { useFilesStore } from "../store/useFilesStore";
	import { useRouter, useRoute } from "vue-router";
	import { watch } from "vue";
	// Uses
	const fileStore = useFilesStore();
	const router = useRouter();
	const route = useRoute();


	// Refs
	let params = null;
	let search = ref("");
	const selected = ref({});
	const allSelected = ref(false);
	const onlyFavourites = ref(false);
	const loadMoreIntersect = ref(null);

	const files = computed (() => {
		return allFiles.value.data
	})
	const allFiles = ref({ 
		data: fileStore.files.data ?? [], 
		next: fileStore.files.links?.next ?? null,
	})
	
	// Computed
	const selectedIds = computed(() =>
		Object.entries(selected.value)
			.filter((a) => (a[1]))
			.map((a) => a[0])
	);

	// Functions
	const getFolderPath = () => {
		const p = route.params.pathMatch;
		return Array.isArray(p) ? p.join("/") : (p || "");
	};

	const openFolder = async (file) => {
		if (!file.is_folder) return;
		router.push(`/my-files/${file.path}`);
    };


	const loadMore = () => {
		if (!allFiles.value.next) {
			return;
		}

		httpGet(allFiles.value.next).then((res) => {
			var data = ref(res.files.data);
			if (res.files.data) {
				allFiles.value.data = [...allFiles.value.data, ...data.value]
        		allFiles.value.next = res.files.links?.next ?? null
			}
		});
	};

	const onSelectAllChange = () => {
		allFiles.value.data.forEach(
			(f) => (selected.value[f.id] = allSelected.value)
		);
	};

	const toggleFileSelect = (file) => {
		selected.value[file.id] = !selected.value[file.id];
		onSelectCheckboxChange(file);
	};

	const onSelectCheckboxChange = (file) => {
		if (!selected.value[file.id]) {
			allSelected.value = false;
		} else {
			let checked = true;
			for (let file of allFiles.value.data) {
				if (!selected.value[file.id]) {
					checked = false;
					break;
				}
			}
			allSelected.value = checked;
		}
	};

	const onDelete = () => {
		allSelected.value = false;
		selected.value = {};
		fileStore.fetchFolder(getFolderPath())
	};

	const addRemoveFavourite = async (file) => {
			await fileStore.addToFavorite(file.id)
			file.is_favourite = !file.is_favourite;
			if(file.is_favourite == true){
				showSuccessNotification("Selected files have been added to favourites");
			}else{
				showSuccessNotification("Selected files have been removed from favourites");
			}
	};

	const showOnlyFavourites = async () => {
		if (onlyFavourites.value) {
			params.set("favourites", 1);
		} else {
			params.delete("favourites");
		}
		await fileStore.showOnlyFavourites(window.location.pathname + "?" + params.toString());
		console.log(window.location.pathname + "?" + params.toString())
	
	};

	// const onSearch = () => {

	// }

	watch( () => route.params.pathMatch, () => {
		fileStore.fetchFolder(getFolderPath());
	})

	watch(
		() => fileStore.files,
		(newFiles) => {
			allFiles.value = {
				data: newFiles.data ?? [],
				next: newFiles.links?.next ?? null
			};
		},
		{ immediate: true }
	)

	// Hooks
	onUpdated( () => {
		allFiles.value = {
			data: fileStore.files.data,
			next: fileStore.files?.links?.next,
		};
	});

	onUnmounted(()=> {
		emitter.off(ON_SEARCH);
	});


	onMounted( () => {
		 fileStore.fetchFolder(getFolderPath());
		params = new URLSearchParams(window.location.search);
		onlyFavourites.value = params.get("favourites") === "1";

		search.value = params.get("search");
		emitter.on(ON_SEARCH, (value) => {
			search.value = value;
			fileStore.fetchFolder(getFolderPath(), search.value)
		});
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => entry.isIntersecting && loadMore()),
			{
				rootMargin: "-250px 0px 0px 0px",
			}
		);

		observer.observe(loadMoreIntersect.value);
	});
</script>
<style scoped>
	.main-nav {
		@apply mb-3 flex items-center justify-between p-1;
	}
	.breadcrumb-list {
		@apply inline-flex items-center space-x-1 md:space-x-3;
	}
	.breadcrumb-item {
		@apply inline-flex items-center;
	}
	.home-link {
		@apply inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white;
	}
	.home-icon {
		@apply mr-2 h-4 w-4;
	}
	.breadcrumb-separator-container {
		@apply flex items-center;
	}
	.breadcrumb-separator-icon {
		@apply size-5 text-gray-400;
	}
	.folder-link {
		@apply ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ml-2;
	}
	.actions-container {
		@apply flex;
	}
	.favourites-label {
		@apply mr-3 flex items-center;
	}
	.favourites-checkbox {
		@apply ml-2;
	}
	.table-container {
		@apply flex-1 overflow-auto;
	}
	.file-table {
		@apply min-w-full;
	}
	.table-header {
		@apply border-b bg-gray-100;
	}
	.th-checkbox {
		@apply w-[30px] max-w-[30px] pr-0 px-6 py-4 text-left text-sm font-medium text-gray-900;
	}
	.th-favourite {
		@apply px-6 py-4 text-left text-sm font-medium text-gray-900;
	}
	.th-default {
		@apply px-6 py-4 text-left text-sm font-medium text-gray-900;
	}
	.table-row {
		@apply cursor-pointer border-b transition duration-300 ease-in-out hover:bg-blue-100;
	}
	.td-checkbox {
		@apply w-[30px] max-w-[30px] whitespace-nowrap pr-0 px-6 py-4 text-sm font-medium text-gray-900;
	}
	.td-favourite {
		@apply max-w-[40px] px-6 py-4 text-sm font-medium text-yellow-500 text-gray-900;
	}
	.favourite-icon {
		@apply h-6 w-6;
	}
	.td-name {
		@apply flex items-center whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900;
	}
	.td-default {
		@apply whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900;
	}
	.empty-data-message {
		@apply py-8 text-center text-lg text-gray-600;
	}
</style>
