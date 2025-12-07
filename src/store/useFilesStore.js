import { defineStore } from "pinia";
import { api } from "../axios.js";
import axios from "axios";
import {  addToFavoriteUrl, fileSharedByMeUrl, fileSharedWithMeUrl, fileShareUrl, fileTrashUrl } from "../Helper/routes-api.js";
import { showSuccessNotification } from "../event-bus.js";
import { useAuthStore } from "./useAuthStore.js";

const baseURL = "http://202.10.37.4:8080/api"
export const useFilesStore = defineStore("files", {
	state: () => ({
		files: [],
		folder: null,
		ancestors: [],
		loading: false,
		error: null,
		fileTrash: [],
		fileSharedByMe:[],
		fileSharedWithMe: []
	}),

	actions: {
		async fetchFolder(folderPath = "", search ="") {
			const url = folderPath ? `/my-files/${folderPath}` : `/my-files`;
			try {
				const res = await axios.get(baseURL+url, {
					headers: {
						Authorization: `Bearer ${useAuthStore().token}`
					},
					params:{
						search: search
					}
				})
				this.files = res.data.files;
				this.folder = res.data.folder;
				this.ancestors = res.data.ancestors;
			} catch (error) {
				console.log(error);
			}
		},

		async fetchFileTrash(search = ""){
			await api.get(fileTrashUrl, {
				params:{
					search: search
				}
			})
			.then((res) => {
				console.log(res.data.files)
				this.fileTrash = res.data.files;
			}).catch((er) => {
				console.log(er);
			});
		},

		async fetchFileSharedByMe(){
			await api.get(fileSharedByMeUrl)
			.then((res) => {
				this.fileSharedByMe = res.data.files;
			}).catch((er) => {
				console.log(er);
			});
		},

		async fetchFileSharedWithMe(){
			await api.get(fileSharedWithMeUrl)
			.then((res) => {
				this.fileSharedWithMe = res.data.files;
			}).catch((er) => {
				console.log(er);
			});
		},

		async addToFavorite(fileId) {
			await api.post(addToFavoriteUrl, { id: fileId })
			.then(() =>{
			})
			.catch((er) => {
				console.log(er);
			});
		},

		async showOnlyFavourites(params){
			await api.get(`${baseURL}${params}`)
			.then((res) => {
				this.files = res.data.files;
				this.folder = res.data.folder;
				this.ancestors = res.data.ancestors;
				console.log(res)
			})
			.catch((er) => {
				console.log(er);
			});
		},

		async fileShare(data){
			console.log(data)
			// await api.post(fileShareUrl, data)
			// .then((res) => {
			// 	showSuccessNotification(`Selected files will be shared to "${data.email}" if the emails exists in the system`)
			// })
			// .catch((er) => {
			// 	console.log(er);
			// });
		} 


	},

	persist: true,
});
