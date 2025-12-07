import axios from "axios";
import { useAuthStore } from "./store/useAuthStore.js";

export const api = axios.create({
	baseURL: "http://202.10.37.4:8080/api" || "/api",
});

api.interceptors.request.use((config) => {
	const auth = useAuthStore();
	// console.log("METHOD:", config.method);
	// console.log("URL:", config.url);
	// console.log("DATA:", config.data);

	if (config.noToken === true) return config;

	if (auth.token) {
		config.headers.Authorization = `Bearer ${auth.token}`;
	}

	return config;
});
api.interceptors.response.use((config) => {
	const auth = useAuthStore();
	// console.log("METHOD:", config.method);
	// console.log("URL:", config.url);
	// console.log("DATA:", config);
	if (config.noToken === true) return config;

	if (auth.token) {
		config.headers.Authorization = `Bearer ${auth.token}`;
	}

	return config;
});

export default { api };
