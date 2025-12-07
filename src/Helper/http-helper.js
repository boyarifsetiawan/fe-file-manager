import { useAuthStore } from "../store/useAuthStore";

export function httpGet(url) {
	return fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${useAuthStore().token}`,
		},
	}).then((response) => response.json());
}

export function httpPost(url, data) {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(data),
		}).then((response) => {
			if (response.ok) {
				resolve(response.json());
			} else {
				response.json().then((data) => {
					reject({ response, error: data });
				});
			}
		});
	});
}
