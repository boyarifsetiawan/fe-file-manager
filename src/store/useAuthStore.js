import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: localStorage.getItem("token") || null,
		user: localStorage.getItem("user") || null,
	}),

	getters: {
		isLoggedIn: (state) => !!state.token,
	},

	actions: {
		setToken(token, user) {
			this.token = token;
			this.user = user;
			localStorage.setItem("token", token);
		},

		logout() {
			this.token = null;
			localStorage.removeItem("token");
		},
	},
	persist: true,
});
